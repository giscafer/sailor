import {Button, confirm, Layout} from 'amis';
import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import AddProjectModal from '../../component/AddProjectModal';
import AsideMenu from '../../component/AsideMenu';
import Card from '../../component/common/Card';
import Empty from '../../component/common/Empty';
import SiteHeader from '../../component/SiteHeader';
import {MENUS} from '../../config';
import {useStore} from '../../store';

function ProjectComponent({history}: RouteComponentProps) {
    const store = useStore();

    useEffect(() => {
        store.project.getList().then(() => {
            console.log('getList');
        });
    }, []);

    function renderAside() {
        const navigations = [
            {
                label: '菜单',
                children: MENUS
            }
        ];

        return <AsideMenu asideFolded editable={false} navigations={navigations}></AsideMenu>;
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
