export const appName = 'Sailor';

export const BASE_URL = '//localhost:3000/sailor';
// export const BASE_URL = '//localhost:3000/sailor';

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
