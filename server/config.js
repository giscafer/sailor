const localConfig = {
    port: 3000,
    host: '0.0.0.0',
    mongoUrl: 'mongodb://localhost:27017/admin',
    secret: 'giscafer',
    tianApiKey: ''
};
const development = {};
const production = {
    port: 8081,
    mongoUrl: 'mongodb://webgis:giscafer@ip:27017/admin'
};
let config = Object.assign(localConfig, development);
if (process.env.NODE_ENV == 'production') {
    config = Object.assign(localConfig, production);
}
module.exports = config;
