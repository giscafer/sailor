import React from 'react';
import {observer, inject} from 'mobx-react';
import {IMainStore} from '../../store';
import {Button, AsideNav, Layout, confirm} from 'amis';
import {RouteComponentProps, matchPath, Switch, Route} from 'react-router';
import {Link} from 'react-router-dom';
import NotFound from '../NotFound';
import AMISRenderer from '../../component/AMISRenderer';
import AddProjectModal from '../../component/AddProjectModal';
import UserInfo from '../../component/common/UserInfo';
import {MENUS} from '../../config';

function isActive(link: any, location: any) {
    const ret = matchPath(location.pathname, {
        path: link ? link.replace(/\?.*$/, '') : '',
        exact: true,
        strict: true
    });

    return !!ret;
}

export default inject('store')(
    observer(function ({store, location, history}: {store: IMainStore} & RouteComponentProps) {
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
                            <Button size="sm" level="info" onClick={() => store.setAddPageIsOpen(true)}>
                                新增项目
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

        function renderAside() {
            const navigations = MENUS;
            const paths = navigations.map(item => item.path);

            return (
                <AsideNav
                    key={store.asideFolded ? 'folded-aside' : 'aside'}
                    navigations={[
                        {
                            label: '菜单',
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
            store.addPage({
                ...value,
                schema: {
                    type: 'page',
                    title: value.label,
                    body: '这是你刚刚新增的页面。'
                }
            });
            store.setAddPageIsOpen(false);
        }

        return (
            <Layout
                aside={renderAside()}
                header={renderHeader()}
                folded={store.asideFolded}
                offScreen={store.offScreen}
            >
                <Switch>
                    {store.pages.map(item => (
                        <Route
                            key={item.id}
                            path={`/${item.path}`}
                            render={() => <AMISRenderer schema={item.schema} />}
                        />
                    ))}
                    <Route component={NotFound} />
                </Switch>
                <AddProjectModal
                    show={store.addPageIsOpen}
                    onClose={() => store.setAddPageIsOpen(false)}
                    onConfirm={handleConfirm}
                    pages={store.pages.concat()}
                />
            </Layout>
        );
    })
);
