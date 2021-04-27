/**
 * 登陆页面使用amis样式手写实现，不依赖第三方组件库和样式库
 *
 */

import {Button, toast} from 'amis';
import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import {useStore} from '../../store';
import './style.scss';

function Login(props: RouteComponentProps) {
    const store = useStore();
    const {user} = store;
    const {history} = props;
    const userInfo = {
        username: '',
        password: ''
    };
    function loginHandle() {
        if (!userInfo.username || !userInfo.password) {
            return toast.warning('请输入账号或密码！');
        }
        user.login(userInfo).then(isLogin => {
            if (isLogin) {
                (history as any).replace('/project');
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
                                userInfo.username = e.currentTarget.value;
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
                                userInfo.password = e.currentTarget.value;
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
}

export default withRouter(observer(Login));
