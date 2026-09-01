// Single place to pull the fields audit events need for forensic traceability
// (GDPR accountability: who, from where) out of an Express request, so every
// controller passes the same shape down to its service instead of re-reading
// req.ip/headers inline in each one.
export const getRequestContext = (req) => ({
    ip: req.ip,
    userAgent: req.headers['user-agent'] || null,
});
