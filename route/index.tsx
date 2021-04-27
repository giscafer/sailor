import React, {useEffect} from 'react';
import {ToastComponent, AlertComponent, Spinner} from 'amis';
import {Route, Switch, Redirect, HashRouter as Router, RouteComponentProps, withRouter} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {useStore} from '../store';
import LoginComponent from './login';
import ProjectComponent from './project';
const PreviewComponent = React.lazy(() => import('./Preview'));
const EditorComponent = React.lazy(() => import('./Editor'));

function MainRouter() {
    const {user, project, theme} = useStore();
    useEffect(() => {
        user.getUserInfo().then(userInfo => {
            if (!userInfo) {
                // history.replace('/login');
            }
        });
    });

    /*   if (location.hash?.startsWith('#/project')) {
        project.getList().then(() => {
            console.log('getList');
        });
    } */
    return (
        <Router>
            <div className="routes-wrapper">
                <ToastComponent key="toast" position={'top-right'} theme={theme} />
                <AlertComponent key="alert" theme={theme} />
                <React.Suspense fallback={<Spinner overlay className="m-t-lg" size="lg" />}>
                    <Switch>
                        <Redirect to={`/project`} from={`/`} exact />
                        <Route path="/project" component={ProjectComponent} />
                        <Route path="/view/:id" component={PreviewComponent} />
                        <Route path="/edit/:projectId/:id" component={EditorComponent} />
                        <Route path="/login" component={LoginComponent} />
                    </Switch>
                </React.Suspense>
            </div>
        </Router>
    );
}

export default observer(MainRouter);
