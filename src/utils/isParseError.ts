import { SafeParseError, SafeParseReturnType } from 'zod';

export function isParseError<T>(
  parse: SafeParseReturnType<T, T>,
): parse is SafeParseError<T> {
  return !parse.success;
}
