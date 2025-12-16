export default () => ({
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    serviceName: process.env.SERVICE_NAME || 'NestApp',
    domain: process.env.SERVICE_DOMAIN || 'http://localhost:3000'
  },
  port: parseInt(process.env.PORT || '3000'),
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    hashRounds: parseInt(process.env.JWT_HASH_ROUNDS || '10', 10)
  },
  aws: {
    region: process.env.AWS_REGION,
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    defaultBucket: process.env.AWS_DEFAULT_BUCKET,
    cloudFront: process.env.AWS_CLOUD_FRONT
  },
  mailer: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT ?? '587', 10),
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    from: process.env.MAIL_FROM
  }
});
