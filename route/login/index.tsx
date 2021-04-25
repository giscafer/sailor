/**
 * 登陆页面使用amis样式手写实现，不依赖第三方组件库和样式库
 *
 */

import {Button, toast, wrapFetcher} from 'amis';
import React from 'react';
import {observer, inject} from 'mobx-react';
import {RouteComponentProps, matchPath, Switch, Route} from 'react-router';
import {IMainStore} from '../../store';
import './style.scss';

export default inject('store')(
    observer(function ({store, location, history}: {store: IMainStore} & RouteComponentProps) {
        const user = {
            username: '',
            password: ''
        };
        function loginHandle() {
            store.user.login(user).then(isLogin => {
                if (isLogin) {
                    (history as any).replace('/project');
                    toast.success('欢迎使用 Sailor');
                }
            });
        }

        return (
            <div className="login-page">
                <div className="logo">
                    <h3>Sailor 低码平台</h3>
                </div>
                <div className="a-Form a-Form--horizontal">
                    <div className="a-Form-item a-Form-item--horizontal">
                        <label className="a-Form-label a-Form-itemColumn--2">
                            <span>账号:</span>
                        </label>
                        <div className="a-TextControl-input">
                            <input
                                placeholder="请输入账号"
                                className=""
                                onChange={e => {
                                    user.username = e.currentTarget.value;
                                }}
                            />
                        </div>
                    </div>
                    <div className="a-Form-item a-Form-item--horizontal">
                        <label className="a-Form-label a-Form-itemColumn--2">
                            <span>密码:</span>
                        </label>
                        <div className="a-TextControl-input">
                            <input
                                type="password"
                                placeholder="请输入密码"
                                onChange={e => {
                                    user.password = e.currentTarget.value;
                                }}
                            />
                        </div>
                    </div>
                    <div className="form-footer text-center">
                        <Button size="ml" level="info" onClick={loginHandle}>
                            登录
                        </Button>
                    </div>
                </div>
            </div>
        );
    })
);
