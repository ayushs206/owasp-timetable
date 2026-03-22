import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 30, // Limit each IP to 30 requests per `window` (here, per 5 minutes).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    ipv6Subnet: 56,
    message: 'Too many requests from this IP, please try again later.' // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
    // store: ... , // Redis, Memcached, etc. See below.
})