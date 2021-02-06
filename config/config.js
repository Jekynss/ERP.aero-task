require('dotenv').config()

module.exports = {
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DATABASE_NAME,
    "host": process.env.DB_HOST,
    "logging": false,
    "dialect": "mysql",
    "define": {
      "timestamps": false
    },
    "use_env_variable": false
  },
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DATABASE_NAME,
    "host": process.env.DB_HOST,
    "logging": false,
    "dialect": "mysql",
    "define": {
      "timestamps": false
    },
    "use_env_variable": false
  },
  "staging": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DATABASE_NAME,
    "host": process.env.DB_HOST,
    "logging": false,
    "dialect": "mysql",
    "define": {
      "timestamps": false
    },
    "use_env_variable": false
  }
}
