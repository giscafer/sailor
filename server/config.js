const localConfig = {
  port: 3000,
  host: '0.0.0.0',
  mongoUrl: 'mongodb://localhost:27017/admin',
  secret: 'giscafer',
  tianApiKey: '',
};
const development = {};

let config = Object.assign(localConfig, development);
if (process.env.NODE_ENV == 'production') {
  const {
    MONGODB_HOST,
    MONGODB_USER,
    MONGODB_PORT,
    MONGODB_PASSWORD,
  } = process.env;
  config = Object.assign(localConfig, {
    port: 3000,
    mongoUrl: `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/sailor`,
    mongodbUser: MONGODB_USER,
    mongodbPass: MONGODB_PASSWORD,
  });
  /* const {
    MONGODB_HOST,
    MONGODB_USER,
    MONGODB_PORT,
    MONGODB_PASSWORD,
  } = process.env;
  config = Object.assign(localConfig, {
    port: 3000,
    mongoUrl: `mongodb://${MONGODB_USER}:${encodeURIComponent(
      MONGODB_PASSWORD
    )}@${MONGODB_HOST}:${MONGODB_PORT}/admin`,
  }); */
}
module.exports = config;
