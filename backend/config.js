require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
  dbName: process.env.DB_NAME || 'nature_blog.db',
  admin: {
    username: process.env.ADMIN_USERNAME || 'girlfriend',
    password: process.env.ADMIN_PASSWORD || 'change-this-password'
  }
}; 