/**
 * 登陆页面使用amis样式手写实现，不依赖第三方组件库和样式库
 *
 */

import {Button, toast} from 'amis';
import React from 'react';
import './style.scss';

export default () => {
    function loginHandle() {
        toast.success('登陆', '提示');
    }

    return (
        <div className="login-page">
            <div className="logo">
                <h3>Sailor Low-Code Platform</h3>
            </div>
            <div className="a-Form a-Form--horizontal">
                <div className="a-Form-item a-Form-item--horizontal">
                    <label className="a-Form-label a-Form-itemColumn--2">
                        <span>账号:</span>
                    </label>
                    <div className="a-TextControl-input">
                        <input placeholder="账号" className="" />
                    </div>
                </div>
                <div className="a-Form-item a-Form-item--horizontal">
                    <label className="a-Form-label a-Form-itemColumn--2">
                        <span>密码:</span>
                    </label>
                    <div className="a-TextControl-input">
                        <input type="password" placeholder="密码" />
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
};
