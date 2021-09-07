// require modules
const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
// 目标模板
const adminTemplatePath = path.join(__dirname, '../', '_templates/sailor-admin');

/**
 * 生成页面json文件
 * @param {String} username 用户名
 * @param {String} project 项目路径
 * @param {Array<any>} pages 页面schema数组
 */
function genProjectCode(username, project, pages = []) {
    return new Promise(resolve => {
        const {projectPath, templatePath, reactivePath} = ensureFileDir(username, project);
        const jsonFilePath = path.join(templatePath, 'pages');
        try {
            genSiteSchemaJson(pages, jsonFilePath);
        } catch (e) {
            console.log(e);
        }

        archiverFile(projectPath, templatePath, file => {
            resolve({
                file: `${templatePath}.zip`,
                fileName: `sailor-admin-${project}.zip`
            });
            console.log('项目生成成功！');
        });
    });
}

function genSiteSchemaJson(pages = [], jsonFilePath) {
    const siteObj = {
        status: 0,
        msg: '',
        data: {
            pages: [
                {
                    label: 'Home',
                    url: '/',
                    redirect: '/index/1'
                },
                {
                    label: '导航',
                    children: []
                }
            ]
        }
    };
    let index = 0;
    for (const page of pages) {
        const route = {
            label: page.label,
            url: `/${page.path}`,
            icon: page.icon,
            schemaApi: `get:/pages/${page.path}.json`
        };
        if (index === 0) {
            if (!siteObj.data?.pages) {
                siteObj.data.pages = [];
            }
            if (!siteObj.data?.pages[0]) {
                siteObj.data?.pages.push({});
            }
            if (siteObj.data?.pages[0]) {
                siteObj.data.pages[0]['redirect'] = `/${page.path}`;
            }
        }
        siteObj.data.pages[1]['children'].push(route);
        index++;
        fs.outputJsonSync(`${jsonFilePath}/${page.path}.json`, page.schema);
    }
    //   const siteJsonString = JSON.stringify(siteObj, null, 4);
    //   console.log(siteJsonString);
    fs.outputJsonSync(`${jsonFilePath}/site.json`, siteObj);
    //   return siteJsonString;
}

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
    fs.copySync(adminTemplatePath, tempTemplatePath);
    const idx = tempTemplatePath.indexOf('/.sailor/');
    const reactivePath = tempTemplatePath.substr(idx + 1);
    // console.log(tempTemplatePath, reactivePath);
    return {
        projectPath: tempProjectPath,
        templatePath: tempTemplatePath,
        reactivePath
    };
}

module.exports = {
    archiverFile,
    genProjectCode
};
