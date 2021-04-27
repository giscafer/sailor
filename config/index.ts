export const appName = 'Sailor';

export const BASE_URL = '//localhost:3000/sailor';

export const MENUS = [
    {
        label: '项目管理',
        path: '/project',
        icon: 'fa fa-folder'
    },
    {
        label: '模板示例',
        icon: 'fa fa-file-code-o',
        onClick: () => {
            window.open('https://baidu.gitee.io/amis/examples/index');
        }
    },
    {
        label: 'Github',
        icon: 'fa fa-github',
        onClick: () => {
            window.open('https://github.com/giscafer/sailor');
        }
    }
];

export const defaultProjectCoverImg = 'https://raw.sevencdn.com/giscafer/sailor/master/images/cover.png';
