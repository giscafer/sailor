import {AsideNav, Button, confirm, Layout} from 'amis';
import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {matchPath} from 'react-router';
import {Link, RouteComponentProps, withRouter} from 'react-router-dom';
import AddProjectModal from '../../component/AddProjectModal';
import Card from '../../component/common/Card';
import Empty from '../../component/common/Empty';
import SiteHeader from '../../component/SiteHeader';
import {isActive} from '../../component/AsideMenu';
import {MENUS} from '../../config';
import {useStore} from '../../store';

function ProjectComponent({location, history, staticContext}: RouteComponentProps) {
    const store = useStore();

    useEffect(() => {
        store.project.getList().then(() => {
            console.log('getList');
        });
    }, []);

    function renderAside() {
        const navigations = MENUS;

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
                        <a onClick={link.onClick ? link.onClick : link.children ? () => toggleExpand(link) : undefined}>
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

    function handleConfirm(value: {name: string; path: string; icon: string}) {
        store.project.add({
            ...value,
            pages: JSON.stringify([
                {
                    label: '测试页面',
                    path: 'hello-world',
                    schema: {
                        type: 'page',
                        title: '测试页面',
                        body: [{type: 'tpl', tpl: '这是你刚刚新增的页面。', inline: false}]
                    }
                }
            ])
        });
        store.project.setAddModelOpen(false);
    }

    const renderHeader = () => {
        return (
            <SiteHeader>
                <Button size="sm" level="info" onClick={() => store.project.setAddModelOpen(true)}>
                    新增项目
                </Button>
                <Button size="sm mx-10" level="default" onClick={() => store.project.getList()}>
                    刷新列表
                </Button>
            </SiteHeader>
        );
    };

    return (
        <Layout aside={renderAside()} header={renderHeader()} folded={store.asideFolded} offScreen={store.offScreen}>
            <h4 className="text-green-700 text-center h-2">
                {store.project.state === 'pending' && (
                    <span>
                        <i className="fa fa-spinner fa-spin"></i> 数据加载……
                    </span>
                )}
            </h4>
            <div className="flex justify-center justify-items-center flex-wrap">
                {store.project.projectList.map((item: any) => (
                    <div className="w-1/4 mt-10 mx-5 -mb-5" key={item.path}>
                        <Card
                            onDelete={() => {
                                confirm('确认要删除?').then(confirmed => {
                                    confirmed && store.project.deleteProject(item);
                                });
                            }}
                            onEdit={() => {
                                // toast.info('edit');
                                history.push(`/view/${item.id}`);
                            }}
                            {...item}
                        >
                            {item.name}
                        </Card>
                    </div>
                ))}
                {!store.project.projectList.length && (
                    <Empty
                        onRefresh={() => {
                            store.project.getList();
                        }}
                    />
                )}
            </div>

            <AddProjectModal
                show={store.project.addModelIsOpen}
                onClose={() => store.project.setAddModelOpen(false)}
                onConfirm={handleConfirm}
                pages={store.pages.concat()}
            />
        </Layout>
    );
}

export default withRouter(observer(ProjectComponent));
