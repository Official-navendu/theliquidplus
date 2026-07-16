import { logger } from '@/lib/logger';
import { ApiResponse } from '@/types/api';
import { AppError } from './errors';

export function handleAppError(err: unknown, requestId?: string): ApiResponse<never> {
  const correlationId = requestId || 'no-correlation-id';

  if (err instanceof AppError) {
    logger.warn(
      {
        err: {
          name: err.name,
          message: err.message,
          code: err.code,
          statusCode: err.statusCode,
          stack: err.stack,
          details: err.details,
        },
        requestId: correlationId,
      },
      'Application warning exception handled'
    );

    return {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    };
  }

  const standardError = err instanceof Error ? err : new Error(String(err));
  logger.error(
    {
      err: {
        name: standardError.name,
        message: standardError.message,
        stack: standardError.stack,
      },
      requestId: correlationId,
    },
    'Unhandled system exception caught'
  );

  return {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected system error occurred. Please try again later.',
    },
  };
}
