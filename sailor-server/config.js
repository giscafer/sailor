console.log('NODE_ENV=', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
    require('dotenv').config({path: '.env.prod'});
} else {
    require('dotenv').config({path: '.env'});
}

console.log(process.env.NODE_ENV, process.env.MONGODB_HOST);
// console.log(process.env);

const localConfig = {
    port: 3000,
    host: '0.0.0.0',
    secret: 'giscafer',
    tianApiKey: ''
};

const {MONGODB_HOST, MONGODB_USER, MONGODB_PORT, MONGODB_PASSWORD} = process.env;

const config = Object.assign(localConfig, {
    port: 3000,
    mongoUrl: `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/sailor`,
    mongodbUser: MONGODB_USER,
    mongodbPass: MONGODB_PASSWORD
});

module.exports = config;
