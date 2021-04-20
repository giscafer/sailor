import React from 'react';
import {ToastComponent, AlertComponent, Spinner} from 'amis';
import {Route, Switch, Redirect, HashRouter as Router} from 'react-router-dom';
import {observer} from 'mobx-react';
import {IMainStore} from '../store';
import Login from './login/Login';

const Preview = React.lazy(() => import('./Preview'));
const Editor = React.lazy(() => import('./Editor'));

export default observer(function ({store}: {store: IMainStore}) {
    return (
        <Router>
            <div className="routes-wrapper">
                <ToastComponent key="toast" position={'top-right'} theme={store.theme} />
                <AlertComponent key="alert" theme={store.theme} />
                <React.Suspense fallback={<Spinner overlay className="m-t-lg" size="lg" />}>
                    <Switch>
                        <Redirect to={`/hello-world`} from={`/`} exact />
                        <Route path="/edit/:id" component={Editor} />
                        <Route path="/login" component={Login} />
                        <Route component={Preview} />
                    </Switch>
                </React.Suspense>
            </div>
        </Router>
    );
});
