import React from 'react';
import {ToastComponent, AlertComponent, Spinner} from 'amis';
import {Route, Switch, Redirect, HashRouter as Router, RouteComponentProps} from 'react-router-dom';
import {observer} from 'mobx-react';
import {IMainStore} from '../store';
import Login from './login';
import Project from './project';

const Preview = React.lazy(() => import('./Preview'));
const Editor = React.lazy(() => import('./Editor'));

export default observer(function ({store, history}: {store: IMainStore} & RouteComponentProps) {
    // TODO: 改掉路由模式会出问题
    if (!location.hash?.startsWith('#/login')) {
        // 检查用户登录情况
        store.user.getUserInfo().then(userInfo => {
            if (!userInfo) {
                history.replace('/login');
            }
        });
    }
    if (location.hash?.startsWith('#/project')) {
        store.project.getList().then(() => {
            console.log('getList');
        });
    }
    return (
        <Router>
            <div className="routes-wrapper">
                <ToastComponent key="toast" position={'top-right'} theme={store.theme} />
                <AlertComponent key="alert" theme={store.theme} />
                <React.Suspense fallback={<Spinner overlay className="m-t-lg" size="lg" />}>
                    <Switch>
                        <Redirect to={`/project`} from={`/`} exact />
                        <Route path="/project" component={Project} />
                        <Route path="/view/:id" component={Preview} />
                        <Route path="/edit/:projectId/:id" component={Editor} />
                        <Route path="/login" component={Login} />
                    </Switch>
                </React.Suspense>
            </div>
        </Router>
    );
});
