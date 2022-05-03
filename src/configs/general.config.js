const env = process.env.NODE_ENV || "dev";

const dev = {
  port: parseInt(process.env.DEV_APP_PORT) || 3001,
};

const config = {
  dev,
};

module.exports = config[env];
