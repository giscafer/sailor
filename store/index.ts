import {reaction} from 'mobx';
import {applySnapshot, flow, getEnv, getSnapshot, types} from 'mobx-state-tree';
import {PageStore} from './Page';
import {Project, IProjectStore, ProjectStore} from './Project';
import {UserStore} from './User';
let pagIndex = 1;
export const MainStore = types
    .model('MainStore', {
        pages: types.optional(types.array(PageStore), [
            /*  {
                id: `${pagIndex}`,
                path: 'hello-world',
                label: 'Hello world',
                icon: 'fa fa-file',
                schema: {
                    type: 'page',
                    title: 'Hello world',
                    body: '初始页面'
                }
            } */
        ]),
        project: types.optional(ProjectStore, {}),
        // currentProject: types.frozen(),
        currentProject: types.optional(Project, {
            name: '',
            path: '',
            description: '',
            pages: '',
            coverImg: '',
            createTime: '',
            id: '',
            userId: ''
        }),
        user: types.optional(UserStore, {}),
        theme: 'default',
        asideFixed: true,
        asideFolded: false,
        offScreen: false,
        addPageIsOpen: false,
        preview: false,
        isMobile: false,
        schema: types.frozen()
    })
    .views(self => ({
        get fetcher() {
            return getEnv(self).fetcher;
        },
        get notify() {
            return getEnv(self).notify;
        },
        get alert() {
            return getEnv(self).alert;
        },
        get copy() {
            return getEnv(self).copy;
        }
    }))
    .actions(self => {
        function createPage(data: any, index = null) {
            return PageStore.create({
                id: `${pagIndex++}`,
                ...data
            });
        }
        function toggleAsideFolded() {
            self.asideFolded = !self.asideFolded;
        }

        function toggleAsideFixed() {
            self.asideFixed = !self.asideFixed;
        }

        function toggleOffScreen() {
            self.offScreen = !self.offScreen;
        }

        function setAddPageIsOpen(isOpened: boolean) {
            self.addPageIsOpen = isOpened;
        }

        function addPage(data: {label: string; path: string; icon?: string; schema?: any}) {
            self.pages.push(createPage(data));
        }

        function removePageAt(index: number) {
            self.pages.splice(index, 1);
            // 更新数据库
            updateProject();
        }

        function updatePageSchemaAt(index: number) {
            self.pages[index].updateSchema(self.schema);
            // 更新数据库
            updateProject();
        }

        function updateSchema(value: any) {
            self.schema = value;
        }

        function setPreview(value: boolean) {
            self.preview = value;
        }

        function setIsMobile(value: boolean) {
            self.isMobile = value;
        }

        async function updateProject(
            data: {label: string; path: string; icon?: string; schema?: any} | undefined = undefined
        ) {
            const project: any = self.currentProject;
            if (data) {
                self.pages.push(createPage(data));
            }
            project.pages = JSON.stringify(self.pages);
            try {
                const updateRes = await self.project.update(project);
                console.log(updateRes);
            } catch (e) {
                console.log(e);
            }
        }
        const getProjectInfo = flow(function* (id: string) {
            try {
                const projectInfo = yield self.project.getProject(id);
                projectInfo.id = projectInfo._id;
                self.currentProject = projectInfo;
                let pages = JSON.parse(projectInfo?.pages);
                if (!Array.isArray(pages)) {
                    pages = [];
                }
                self.pages.replace(pages.map((page: any) => createPage(page)));
            } catch (e) {
                console.log(e);
            }
        });

        return {
            toggleAsideFolded,
            toggleAsideFixed,
            toggleOffScreen,
            setAddPageIsOpen,
            addPage,
            removePageAt,
            updatePageSchemaAt,
            updateSchema,
            setPreview,
            setIsMobile,
            getProjectInfo,
            updateProject,
            afterCreate() {
                // persist store
                if (typeof window !== 'undefined' && window.localStorage) {
                    const storeData = window.localStorage.getItem('store');
                    if (storeData) applySnapshot(self, JSON.parse(storeData));

                    reaction(
                        () => getSnapshot(self),
                        json => {
                            window.localStorage.setItem('store', JSON.stringify(json));
                        }
                    );
                }
            }
        };
    });

export type IMainStore = typeof MainStore.Type;
