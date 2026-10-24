import { INestApplication } from '@nestjs/common';
import { createValidationPipe } from './common/validation';
import { AllExceptionsFilter } from './common/all-exceptions.filter';

// Shared by main.ts and the e2e tests so both run the same global pipeline.
export const configureApp = (app: INestApplication) => {
  app.enableCors();
  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  return app;
};
