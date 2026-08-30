// MASAR API Configuration
// Enterprise API settings

export const apiConfig = {
  // API Version
  version: 'v1',
  prefix: '/api/v1',
  
  // Rate Limiting
  rateLimits: {
    default: { windowMs: 60000, max: 100 }, // 100 requests per minute
    auth: { windowMs: 900000, max: 20 }, // 20 attempts per 15 minutes
    sensitive: { windowMs: 60000, max: 30 }, // 30 requests per minute
    upload: { windowMs: 60000, max: 10 }, // 10 uploads per minute
    webhook: { windowMs: 60000, max: 200 }, // 200 webhooks per minute
  },
  
  // Pagination
  pagination: {
    defaultLimit: 25,
    maxLimit: 100,
    cursorParam: 'cursor',
    limitParam: 'limit',
  },
  
  // Request Limits
  requestLimits: {
    jsonBody: '10mb',
    multipart: '50mb',
    urlEncoded: '10mb',
  },
  
  // Timeouts
  timeouts: {
    request: 30000, // 30 seconds
    externalApi: 10000, // 10 seconds
    database: 5000, // 5 seconds
  },
  
  // CORS
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.NEXT_PUBLIC_APP_URL || 'https://masar.vercel.app']
      : ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'Idempotency-Key'],
    exposedHeaders: ['X-Request-ID', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
    credentials: true,
    maxAge: 86400,
  },
  
  // Security Headers
  securityHeaders: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  },
  
  // Idempotency
  idempotency: {
    ttl: 86400, // 24 hours
    header: 'Idempotency-Key',
  },
  
  // Request ID
  requestId: {
    header: 'X-Request-ID',
    prefix: 'req_',
  },
};

export default apiConfig;
