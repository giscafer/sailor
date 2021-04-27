import {observer} from 'mobx-react-lite';
import React from 'react';
import {withRouter} from 'react-router';
import {useStore} from '../../store';
import UserInfo from '../common/UserInfo';

function SiteHeader(props: any) {
    const {user, toggleOffScreen} = useStore();
    return (
        <div>
            <div className={`a-Layout-brandBar`}>
                <button onClick={toggleOffScreen} className="pull-right visible-xs">
                    <i className="glyphicon glyphicon-align-justify"></i>
                </button>
                <div className={`a-Layout-brand`}>
                    <i className="fa fa-code"></i>
                    <span className="hidden-folded m-l-sm">Sailor 低码平台</span>
                </div>
            </div>
            <div className={`a-Layout-headerBar`}>
                <div className="hidden-xs p-t-sm pull-left">{props.children}</div>
                <UserInfo
                    user={user}
                    onLogout={() => {
                        user.logout();
                        props.history.replace('/login');
                    }}
                />
            </div>
        </div>
    );
}

export default withRouter(observer(SiteHeader));
