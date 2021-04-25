import React, {FC, useEffect} from 'react';
import {observer, inject} from 'mobx-react';
import {IMainStore} from '../store';
import {Button, AsideNav, Layout, confirm} from 'amis';
import {RouteComponentProps, matchPath, Switch, Route, Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import NotFound from '../component/common/NotFound';
import AMISRenderer from '../component/AMISRenderer';
import AddPageModal from '../component/AddPageModal';
import UserInfo from '../component/common/UserInfo';
import {sortedIndex} from 'lodash';

function isActive(link: any, location: any) {
    const ret = matchPath(location.pathname, {
        path: link ? link.replace(/\?.*$/, '') : '',
        exact: true,
        strict: true
    });

    return !!ret;
}

let currentProjectId = '-1';

export default inject('store')(
    observer(function ({store, location, history, match}: {store: IMainStore} & RouteComponentProps<{id: string}>) {
        const projectId = match.params.id;

        if (projectId !== currentProjectId) {
            currentProjectId = projectId;
            store.getProjectInfo(projectId);
        }
        const project = getProjectById(projectId);
        function renderHeader() {
            return (
                <div>
                    <div className={`a-Layout-brandBar`}>
                        <button onClick={store.toggleOffScreen} className="pull-right visible-xs">
                            <i className="glyphicon glyphicon-align-justify"></i>
                        </button>
                        <div className={`a-Layout-brand`}>
                            <i className="fa fa-code"></i>
                            <span className="hidden-folded m-l-sm">Sailor 低码平台</span>
                        </div>
                    </div>
                    <div className={`a-Layout-headerBar`}>
                        <div className="hidden-xs p-t-sm pull-left">
                            <Button
                                size="sm"
                                className="m-r-xs"
                                level="success"
                                onClick={() => {
                                    store.project.download(projectId);
                                }}
                            >
                                导出项目
                            </Button>
                            <Button size="sm" level="info" onClick={() => store.setAddPageIsOpen(true)}>
                                新增页面
                            </Button>
                        </div>
                        <UserInfo
                            user={store.user}
                            onLogout={() => {
                                store.user.logout();
                                history.replace('/login');
                            }}
                        />
                    </div>
                </div>
            );
        }

        function genRoutePath(path: string) {
            return `/view/${projectId}/${path}`;
        }

        function getProjectById(id: string) {
            return store.project.projectList.find(p => p.id === id);
        }

        function renderAside() {
            const navigations = store.pages.map(item => ({
                label: item.label,
                path: genRoutePath(item.path),
                icon: item.icon
            }));
            const paths = navigations.map(item => item.path);

            return (
                <AsideNav
                    key={store.asideFolded ? 'folded-aside' : 'aside'}
                    navigations={[
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
                    ]}
                    renderLink={({link, toggleExpand, classnames: cx, depth}: any) => {
                        if (link.hidden) {
                            return null;
                        }

                        let children = [];

                        if (link.children) {
                            children.push(
                                <span
                                    key="expand-toggle"
                                    className={cx('AsideNav-itemArrow')}
                                    onClick={e => toggleExpand(link, e)}
                                ></span>
                            );
                        }

                        link.badge &&
                            children.push(
                                <b key="badge" className={cx(`AsideNav-itemBadge`, link.badgeClassName || 'bg-info')}>
                                    {link.badge}
                                </b>
                            );

                        if (link.icon) {
                            children.push(<i key="icon" className={cx(`AsideNav-itemIcon`, link.icon)} />);
                        } else if (store.asideFolded && depth === 1) {
                            children.push(
                                <i
                                    key="icon"
                                    className={cx(`AsideNav-itemIcon`, link.children ? 'fa fa-folder' : 'fa fa-info')}
                                />
                            );
                        }

                        if (!link.isMenu && !link.active) {
                            children.push(
                                <i
                                    key="delete"
                                    data-tooltip="删除"
                                    data-position="bottom"
                                    className={'navbtn fa fa-times'}
                                    onClick={(e: React.MouseEvent) => {
                                        e.preventDefault();
                                        confirm('确认要删除').then(confirmed => {
                                            confirmed && store.removePageAt(paths.indexOf(link.path));
                                        });
                                    }}
                                />
                            );
                        }
                        if (!link.isMenu) {
                            children.push(
                                <i
                                    key="edit"
                                    data-tooltip="编辑"
                                    data-position="bottom"
                                    className={'navbtn fa fa-pencil'}
                                    onClick={(e: React.MouseEvent) => {
                                        e.preventDefault();
                                        history.push(`/edit/${projectId}/${paths.indexOf(link.path)}`);
                                    }}
                                />
                            );
                        }

                        children.push(
                            <span key="label" className={cx('AsideNav-itemLabel')}>
                                {link.label}
                            </span>
                        );

                        return link.path ? (
                            link.active ? (
                                <a>{children}</a>
                            ) : (
                                <Link to={link.path[0] === '/' ? link.path : `${link.path}`}>{children}</Link>
                            )
                        ) : (
                            <a
                                onClick={
                                    link.onClick ? link.onClick : link.children ? () => toggleExpand(link) : undefined
                                }
                            >
                                {children}
                            </a>
                        );
                    }}
                    isActive={(link: any) =>
                        isActive(link.path && link.path[0] === '/' ? link.path : `${link.path}`, location)
                    }
                />
            );
        }

        function handleConfirm(value: {label: string; icon: string; path: string}) {
            const page = {
                ...value,
                schema: {
                    type: 'page',
                    title: value.label,
                    body: '这是你刚刚新增的页面。'
                }
            };

            store.updateProject(page).then(() => {
                store.setAddPageIsOpen(false);
            });
        }

        return (
            <Layout
                aside={renderAside()}
                header={renderHeader()}
                folded={store.asideFolded}
                offScreen={store.offScreen}
            >
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
                <AddPageModal
                    show={store.addPageIsOpen}
                    onClose={() => store.setAddPageIsOpen(false)}
                    onConfirm={handleConfirm}
                    pages={store.pages.concat()}
                />
            </Layout>
        );
    })
);
