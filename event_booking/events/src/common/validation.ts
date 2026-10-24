import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { Transform } from 'class-transformer';

// Flattens nested class-validator errors into { "field.path": ["message", ...] }.
const collectErrors = (
  errors: ValidationError[],
  parent = '',
  out: Record<string, string[]> = {},
) => {
  for (const error of errors) {
    const path = parent ? `${parent}.${error.property}` : error.property;
    if (error.constraints) {
      out[path] = [...(out[path] ?? []), ...Object.values(error.constraints)];
    }
    if (error.children?.length) collectErrors(error.children, path, out);
  }
  return out;
};

// The one global validation pipe. Keeps Nest's default error shape
// ({ statusCode, message: string[], error }) and adds per-field `errors`.
export const createValidationPipe = () =>
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (validationErrors) => {
      const errors = collectErrors(validationErrors);
      return new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        message: Object.values(errors).flat(),
        errors,
      });
    },
  });

// Trims string input so whitespace-only values fail @IsNotEmpty.
export const Trim = () =>
  Transform(({ value }) => (typeof value === 'string' ? value.trim() : value));

// Lowercases and trims email addresses.
export const NormalizeEmail = () =>
  Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  );
