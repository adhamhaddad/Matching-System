export default () => ({
  encryptionKey: process.env.NODE_SERVICE_ENCRYPTION_KEY,
  encryptionSalt: process.env.NODE_SERVICE_ENCRYPTION_SALT,
  mongo: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    uri: process.env.MONGO_URI,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  JWT: {
    auth_token: process.env.JWT_AUTH,
    timeout: process.env.JWT_TIMEOUT,
  },
});
