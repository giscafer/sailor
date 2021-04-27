import {AsideNav, confirm} from 'amis';
import React from 'react';
import {matchPath, withRouter} from 'react-router';
import {Link} from 'react-router-dom';

export function isActive(link: any, location: any) {
    const ret = matchPath(location.pathname, {
        path: link ? link.replace(/\?.*$/, '') : '',
        exact: true,
        strict: true
    });

    return !!ret;
}

function AsideMenu(props: any) {
    const {
        navigations = [
            {
                label: '页面导航',
                children: []
            }
        ],
        asideFolded,
        editable = true,
        onDelete,
        onEdit,
        location
    } = props;

    return (
        <AsideNav
            key={asideFolded ? 'folded-aside' : 'aside'}
            navigations={navigations}
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
                } else if (asideFolded && depth === 1) {
                    children.push(
                        <i
                            key="icon"
                            className={cx(`AsideNav-itemIcon`, link.children ? 'fa fa-folder' : 'fa fa-info')}
                        />
                    );
                }

                if (!link.isMenu && !link.active && editable) {
                    children.push(
                        <i
                            key="delete"
                            data-tooltip="删除"
                            data-position="bottom"
                            className={'navbtn fa fa-times'}
                            onClick={(e: React.MouseEvent) => {
                                e.preventDefault();
                                confirm('确认要删除').then(confirmed => {
                                    confirmed && onDelete(link.path);
                                });
                            }}
                        />
                    );
                }
                if (!link.isMenu && editable) {
                    children.push(
                        <i
                            key="edit"
                            data-tooltip="编辑"
                            data-position="bottom"
                            className={'navbtn fa fa-pencil'}
                            onClick={(e: React.MouseEvent) => {
                                e.preventDefault();
                                onEdit && onEdit(link.path);
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
                    <a onClick={link.onClick ? link.onClick : link.children ? () => toggleExpand(link) : undefined}>
                        {children}
                    </a>
                );
            }}
            isActive={(link: any) => isActive(link.path && link.path[0] === '/' ? link.path : `${link.path}`, location)}
        />
    );
}

export default withRouter(AsideMenu);
