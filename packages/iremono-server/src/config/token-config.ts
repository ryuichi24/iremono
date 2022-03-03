export const tokenConfig = Object.freeze({
  JWT_SECRET_FOR_ACCESS_TOKEN: process.env.JWT_SECRET_FOR_ACCESS_TOKEN || 'jwt-secret-for-access-token',
  JWT_EXPIRE_IN_FOR_ACCESS_TOKEN: process.env.JWT_EXPIRE_IN_FOR_ACCESS_TOKEN || '900000',
  EXPIRE_IN_FOR_REFRESH_TOKEN: process.env.EXPIRE_IN_FOR_REFRESH_TOKEN || '86400000',
});