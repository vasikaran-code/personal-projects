import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ConnectionError,
  DatabaseError,
  ForeignKeyConstraintError,
  UniqueConstraintError,
  ValidationError as SequelizeValidationError,
} from 'sequelize';

const body = (statusCode: number, error: string, message: string) => ({
  statusCode,
  error,
  message,
});

// Body-parser errors (malformed JSON, oversized payloads) carry an HTTP status.
const isClientHttpError = (e: any): e is { status: number; type?: string } =>
  typeof e?.status === 'number' && e.status >= 400 && e.status < 500;

// Maps every error to Nest's standard { statusCode, error, message } shape.
// Database and unexpected errors are logged server-side and never leak
// SQL, stack traces or constraint names to the client.
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exceptions');

  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const { status, payload } = this.toResponse(exception);
    res.status(status).json(payload);
  }

  private toResponse(exception: unknown): { status: number; payload: object } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const payload =
        typeof response === 'string'
          ? body(status, exception.name, response)
          : response;
      return { status, payload };
    }

    // Subclasses of SequelizeValidationError, so check these first.
    if (exception instanceof UniqueConstraintError) {
      return {
        status: HttpStatus.CONFLICT,
        payload: body(
          409,
          'Conflict',
          'A record with these details already exists.',
        ),
      };
    }
    if (exception instanceof SequelizeValidationError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        payload: body(400, 'Bad Request', 'The submitted data is invalid.'),
      };
    }
    if (exception instanceof ForeignKeyConstraintError) {
      return {
        status: HttpStatus.CONFLICT,
        payload: body(
          409,
          'Conflict',
          'This record is referenced by other data.',
        ),
      };
    }
    if (exception instanceof ConnectionError) {
      this.logger.error(`Database unavailable: ${exception.name}`);
      return {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        payload: body(
          503,
          'Service Unavailable',
          'The service is temporarily unavailable. Please try again.',
        ),
      };
    }
    if (isClientHttpError(exception)) {
      const tooLarge = exception.type === 'entity.too.large';
      const message = tooLarge
        ? 'Request body is too large.'
        : exception.type === 'entity.parse.failed'
          ? 'Request body is not valid JSON.'
          : 'Bad request.';
      const label = tooLarge ? 'Payload Too Large' : 'Bad Request';
      return {
        status: exception.status,
        payload: body(exception.status, label, message),
      };
    }

    const label =
      exception instanceof DatabaseError ? 'Database error' : 'Unhandled error';
    this.logger.error(
      label,
      exception instanceof Error ? exception.stack : String(exception),
    );
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      payload: body(
        500,
        'Internal Server Error',
        'Something went wrong. Please try again.',
      ),
    };
  }
}
