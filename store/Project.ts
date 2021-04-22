import {toast} from 'amis';
import {types, flow} from 'mobx-state-tree';
import {defaultProjectCoverImg} from '../config';
import {doGet, doPost} from '../utils/fetcher';

const Project = types.model({
    name: types.string,
    path: types.union(types.undefined, types.string),
    description: types.union(types.undefined, types.string),
    pages: types.union(types.undefined, types.string),
    coverImg: types.union(types.undefined, types.string),
    createTime: types.union(types.undefined, types.string),
    id: types.string,
    userId: types.string
});

export const ProjectStore = types
    .model('ProjectStore', {
        state: '',
        addModelIsOpen: false,
        projectList: types.array(Project)
    })
    .views(self => ({}))
    .actions(self => {
        function createProject(p: any = {}) {
            return Project.create({
                ...p,
                id: p._id,
                createTime: p.createTime || '',
                coverImg: p.coverImg || defaultProjectCoverImg
            });
        }
        function setAddModelOpen(isOpened: boolean) {
            self.addModelIsOpen = isOpened;
        }

        const getList = flow(function* () {
            let list: any[] = [];
            try {
                list = yield doGet('/api/project/list');
            } catch (error) {
                console.error('Failed to get project ', error);
                self.state = 'error';
            }
            self.projectList.clear();
            self.projectList.replace(
                list.map(p => {
                    return createProject(p);
                })
            );
            return list;
        });

        const add = flow(function* (data) {
            let p;
            self.state = 'pedding';
            try {
                p = yield doPost('/api/project/add', data);
                self.projectList.push(createProject(p));
            } catch (error) {
                console.error('Failed to add project', error);
                self.state = 'error';
            }

            return p;
        });

        const getProject = flow(function* (id) {
            self.state = 'pedding';
            let result;
            try {
                result = yield doGet(`/api/project/info/${id}`);
            } catch (error) {
                console.error('Failed to fetch project', error);
                self.state = 'error';
            }
            if (!result?._id) {
                toast.error(`无法找到id为${id}的项目`);
            }
            return result;
        });

        const deleteProject = flow(function* ({id}) {
            self.state = 'pedding';
            let result;
            try {
                result = yield doPost('/api/project/del', {id});
            } catch (error) {
                console.error('Failed to del project', error);
                self.state = 'error';
            }
            if (result && result.ok === result.deletedCount) {
                toast.success('删除成功！');
                getList();
                return true;
            } else {
                return false;
            }
        });

        return {
            setAddModelOpen,
            getList,
            getProject,
            add,
            deleteProject,
            afterCreate() {
                getList();
                console.log('afterCreate-project');
            }
        };
    });

export type IProjectStore = typeof ProjectStore.Type;