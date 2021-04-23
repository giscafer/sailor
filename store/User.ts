import {toast} from 'amis';
import {types, flow} from 'mobx-state-tree';
import {doGet, doPost} from '../utils/fetcher';
export const UserStore = types
    .model('User', {
        state: '',
        name: '',
        username: '',
        password: '',
        token: ''
    })
    .views(self => ({
        get isAuthenticated() {
            return !!self.name;
        }
    }))
    .actions(self => {
        const login = flow(function* (user: any) {
            self.state = 'pending';
            let success = true;
            try {
                // ... yield can be used in async/await style
                const res: any = yield doPost('/api/auth/login', user);
                updateToken(res.token);
                getUserInfo();
                self.state = 'done';
                console.log('login');
            } catch (error) {
                // ... including try/catch error handling
                console.error('Failed to fetch user', error);
                self.state = 'error';
                success = false;
            }
            return success;
        });
        const getUserInfo = flow(function* () {
            let userInfo: any;
            try {
                userInfo = yield doGet('/api/auth/user');
                const {username, name} = userInfo;
                localStorage.setItem('authenticated', name);
                self.name = name;
                self.username = username;
            } catch (error) {
                console.error('Failed to get user info', error);
                self.state = 'error';
            }
            return userInfo;
        });
        function updateToken(token: string) {
            self.token = token;
            localStorage.setItem('sailorToken', token);
        }

        return {
            login,
            updateToken,
            getUserInfo,
            logout() {
                self.name = '';
                self.token = '';
                localStorage.removeItem('sailorToken');
                localStorage.removeItem('authenticated');
            },
            afterCreate() {
                console.log('afterCreate-user');
                self.name = localStorage.getItem('authenticated') || '';
                self.token = localStorage.getItem('sailorToken') || '';
            }
        };
    });

export type IUserStore = typeof UserStore.Type;
