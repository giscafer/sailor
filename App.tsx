import {alert, confirm, toast} from 'amis';
import copy from 'copy-to-clipboard';
import {Provider} from 'mobx-react';
import React from 'react';
import RootRoute from './route/index';
import {MainStore} from './store/index';
import {fetcher, isCancel} from './utils/fetcher';

export default function (): JSX.Element {
    const store = ((window as any).store = MainStore.create(
        {},
        {
            fetcher,
            isCancel,
            notify: (type: 'success' | 'error' | 'info', msg: string) => {
                toast[type]
                    ? toast[type](msg, type === 'error' ? '系统错误' : '系统消息')
                    : console.warn('[Notify]', type, msg);
                console.log('[notify]', type, msg);
            },
            alert,
            confirm,
            copy: (contents: string, options: any = {}) => {
                const ret = copy(contents, options);
                ret && (!options || options.shutup !== true) && toast.info('内容已拷贝到剪切板');
                return ret;
            }
        }
    ));

    return (
        <Provider store={store}>
            <RootRoute store={store} />
        </Provider>
    );
}
