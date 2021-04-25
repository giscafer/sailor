import {toast} from 'amis';
import {saveAs} from 'file-saver';
import {flow, types} from 'mobx-state-tree';
import {defaultProjectCoverImg} from '../config';
import {toArrayBuffer} from '../utils';
import {doGet, doPost} from '../utils/fetcher';

export const Project = types.model({
    name: types.string,
    path: types.union(types.undefined, types.string),
    description: types.union(types.undefined, types.string),
    pages: types.union(types.undefined, types.string),
    coverImg: types.union(types.undefined, types.string),
    createTime: types.union(types.undefined, types.string),
    id: types.identifier,
    userId: types.string
});

export const ProjectStore = types
    .model('ProjectStore', {
        state: '',
        downloadLoading: false,
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
            self.state = 'pending';
            try {
                list = yield doGet('/api/project/list') || [];
                self.state = 'success';
                self.projectList.clear();
                self.projectList.replace(
                    list.map(p => {
                        return createProject(p);
                    })
                );
            } catch (error) {
                console.error('Failed to get project ', error);
                self.state = 'error';
            }

            return list;
        });

        const add = flow(function* (data) {
            let p;
            self.state = 'pedding';
            try {
                p = yield doPost('/api/project/add', data);
                self.projectList.push(createProject(p));
                self.state = 'success';
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
                self.state = 'success';
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
                self.state = 'success';
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

        const update = flow(function* (project) {
            self.state = 'pedding';
            let result;
            try {
                // console.log('update project=', project);
                result = yield doPost('/api/project/update', project);
                self.state = 'success';
            } catch (error) {
                console.error('Failed to update project', error);
                self.state = 'error';
            }
            if (result && result.ok === result.deletedCount) {
                toast.success('更新成功！');
                getList();
                return true;
            } else {
                return false;
            }
        });

        const download = flow(function* (id) {
            self.downloadLoading = true;
            let result;
            try {
                result = yield doPost('/api/project/exportZip', {id}, {responseType: 'blob'});
                saveAs(result.content, result.filename);
                toast.success('导出成功！');
            } catch (error) {
                console.error('Failed to download project', error);
                toast.success('导出失败！');
            }
            self.downloadLoading = false;

            return result;
        });

        return {
            setAddModelOpen,
            getList,
            getProject,
            add,
            update,
            deleteProject,
            download,
            afterAttach() {
                console.log('onAttach-project');
            },
            afterCreate() {
                getList();
                console.log('afterCreate-project');
            }
        };
    });

export type IProjectStore = typeof ProjectStore.Type;
