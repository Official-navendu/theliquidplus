import pino from 'pino';

const transport = process.env.NODE_ENV !== 'production' 
  ? { target: 'pino-pretty', options: { colorize: true } } 
  : undefined;

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  transport,
});

export const logRequest = (reqId: string, method: string, url: string) => {
  logger.info({ reqId, method, url }, 'Incoming Request');
};

export const logError = (error: Error, metadata?: Record<string, unknown>) => {
  logger.error({ err: error, ...metadata }, 'System Exception Caught');
};

export const logAudit = (userId: string, action: string, resource: string, payload: Record<string, unknown>) => {
  logger.info({ userId, action, resource, payload, type: 'AUDIT' }, `Audit: User ${userId} performed ${action} on ${resource}`);
};
export default logger;
