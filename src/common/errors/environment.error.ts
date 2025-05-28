import { ZodError } from 'zod';

export class EnvironmentError<T> extends Error {
  constructor(schema: ZodError<T>) {
    const missingEnvs = schema.issues
      .map((issue) => {
        return `${issue.path.join('.')}: ${issue.message}`;
      })
      .join('\n');
    super(`the following environment variables are missing:\n${missingEnvs}`);
    this.name = 'EnvironmentError';
  }
}
