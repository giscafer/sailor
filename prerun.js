/**
 * 根据环境变量修改服务地址
 */

const {readFileSync, writeFileSync} = require('fs');

function prebuild() {
    const env = process.env.NODE_ENV || process.argv[2];
    console.log(env);
    let envStr = "export const BASE_URL = '//localhost:3000/sailor';";
    if (env === 'prod' || env === 'production') {
        envStr = "export const BASE_URL = '//api.bighome360.com/sailor';";
    }
    const filePath = './config/index.ts';
    const configContent = readFileSync(filePath).toString();
    const newContent = configContent.replace(new RegExp("export const BASE_URL = '(.*)';", 'g'), envStr);
    writeFileSync(filePath, newContent);
}

prebuild();
