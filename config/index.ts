export const appName = 'Sailor';

export const BASE_URL = '//api.bighome360.com/sailor';

export const MENUS = [
    {
        label: '项目管理',
        path: '/project',
        icon: 'fa fa-folder'
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
