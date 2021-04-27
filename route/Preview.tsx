import {Button, Layout} from 'amis';
import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {matchPath, Redirect, Route, RouteComponentProps, Switch} from 'react-router-dom';
import AddPageModal from '../component/AddPageModal';
import AMISRenderer from '../component/AMISRenderer';
import SiteHeader from '../component/SiteHeader';
import AsideMenu from '../component/AsideMenu';
import NotFound from '../component/common/NotFound';
import {Provider, useStore} from '../store';

let currentProjectId = '-1';

function Preview({history, match}: RouteComponentProps<{id: string}>) {
    const store = useStore();

    const projectId = match.params.id;

    const project = getProjectById(projectId);

    useEffect(() => {
        store.getProjectInfo(projectId);
    }, [projectId]);

    function genRoutePath(path: string) {
        return `/view/${projectId}/${path}`;
    }

    function getProjectById(id: string) {
        return store.project.projectList.find(p => p.id === id);
    }

    function handleConfirm(value: {label: string; icon: string; path: string}) {
        const page = {
            ...value,
            schema: {
                type: 'page',
                title: value.label,
                body: [{type: 'tpl', tpl: '这是你刚刚新增的页面。', inline: false}]
            }
        };

        store.updateProject(page).then(() => {
            store.setAddPageIsOpen(false);
        });
    }

    const renderAside = () => {
        const navigations = store.pages.map(item => ({
            label: item.label,
            path: genRoutePath(item.path),
            icon: item.icon
        }));
        const paths = navigations.map(item => item.path);
        const menuData = [
            {
                label: `当前：${project?.name}`,
                children: [
                    {
                        label: '项目管理',
                        path: '/project',
                        icon: 'fa fa-folder-open-o',
                        isMenu: true,
                        disabled: true
                    }
                ]
            },
            {
                label: '页面导航',
                children: navigations
            }
        ];
        return (
            <AsideMenu
                asideFolded
                navigations={menuData}
                onDelete={(path: string) => {
                    store.removePageAt(paths.indexOf(path));
                }}
                onEdit={(path: string) => {
                    history.push(`/edit/${projectId}/${paths.indexOf(path)}`);
                }}
            ></AsideMenu>
        );
    };

    const renderHeader = () => {
        return (
            <SiteHeader>
                <Button
                    size="sm"
                    className="m-r-xs"
                    level="success"
                    disabled={store.project.downloadLoading}
                    onClick={() => {
                        store.project.download(projectId);
                    }}
                >
                    {store.project.downloadLoading ? '导出中…' : '导出项目'}
                </Button>
                <Button size="sm" className="mx-5" level="info" onClick={() => store.setAddPageIsOpen(true)}>
                    新增页面
                </Button>
            </SiteHeader>
        );
    };

    return (
        <Layout aside={renderAside()} header={renderHeader()} folded={store.asideFolded} offScreen={store.offScreen}>
            <Provider value={store}>
                <Switch>
                    <Redirect to={genRoutePath(store.pages[0].path)} from={genRoutePath('')} exact />
                    {store.pages.map(item => {
                        return (
                            <Route
                                key={item.id}
                                path={genRoutePath(item.path)}
                                render={() => <AMISRenderer schema={item.schema} />}
                            />
                        );
                    })}
                    <Route component={NotFound} />
                </Switch>
            </Provider>
            <AddPageModal
                show={store.addPageIsOpen}
                onClose={() => store.setAddPageIsOpen(false)}
                onConfirm={handleConfirm}
                pages={store.pages.concat()}
            />
        </Layout>
    );
}

export default observer(Preview);
