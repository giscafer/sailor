// require modules
const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

const directoryPath = path.join(__dirname, '../../', '_templates/sailor-admin');
/**
 * 打包下载
 * @param {String} projectPath 项目路径
 * @param {String} templatePath 模板路径
 * @param {Function} cb 回调方法
 */
function archiverFile(projectPath, templatePath, cb) {
    // 临时存放目录
    if (!projectPath || !templatePath) {
        return;
    }
    const output = fs.createWriteStream(`${templatePath}.zip`);
    const archive = archiver('zip', {
        zlib: {level: 9} // Sets the compression level.
    });

    output.on('close', () => {
        console.log(archive.pointer() + ' total bytes', projectPath);
        console.log('archiver has been finalized and the output file descriptor has closed.');
        if (cb) {
            cb(`${templatePath}.zip`);
        }
    });

    output.on('end', () => {
        console.log('Data has been drained');
    });

    archive.on('warning', err => {
        console.log(err);
        if (err.code === 'ENOENT') {
            // log warning
        } else {
            // throw error
            throw err;
        }
    });

    // good practice to catch this error explicitly
    archive.on('error', err => {
        throw err;
    });

    // pipe archive data to the file
    archive.pipe(output);

    archive.directory(templatePath, false);
    archive.finalize();
}

/**
 * 确保目录
 * @param {用户路径} userPath
 * @param {项目路径} projectPath
 */
function ensureFileDir(userPath = '', projectPath = '') {
    // 临时用户目录
    const tempUserPath = path.join(__dirname, '../', '.sailor', userPath);
    // 项目目录
    const tempProjectPath = path.join(tempUserPath, projectPath);
    // 模板目录
    const tempTemplatePath = path.join(tempProjectPath, `sailor-admin-${projectPath}`);
    fs.ensureDirSync(tempUserPath);
    fs.ensureDirSync(tempProjectPath);
    try {
        fs.unlinkSync(tempTemplatePath);
    } catch (error) {}
    fs.copySync(directoryPath, tempTemplatePath);
    const idx = tempTemplatePath.indexOf('/.sailor/');
    const reactivePath = tempTemplatePath.substr(idx + 1);
    console.log(tempTemplatePath, reactivePath);
    return {projectPath: tempProjectPath, templatePath: tempTemplatePath, reactivePath};
}
/**
 * 生成页面json文件
 * @param {String} username 用户名
 * @param {String} project 项目路径
 * @param {Array<any>} pages 页面schema数组
 */
function genPageSchemaJson(username, project, pages = []) {
    return new Promise(resolve => {
        const {projectPath, templatePath, reactivePath} = ensureFileDir(username, project);
        const jsonFilePath = path.join(templatePath, 'pages');
        for (const page of pages) {
            fs.outputJsonSync(`${jsonFilePath}/${page.path}.json`, page);
        }
        archiverFile(projectPath, templatePath, file => {
            resolve({file: `${templatePath}.zip`, fileName: `sailor-admin-${project}.zip`});
            console.log('项目生成成功！');
        });
    });
}

module.exports = {
    archiverFile,
    genPageSchemaJson
};
