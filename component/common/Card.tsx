import React from 'react';
export default (props: any) => {
    const {name, path, createTime, description, onDelete = () => {}, onEdit = () => {}} = props;
    return (
        <div className="a-Card">
            <div className="a-Card-heading">
                <span className="a-Card-avtar pull-left thumb-md avatar b-3x m-r">
                    <img
                        className="a-Card-img"
                        src="http://hiphotos.baidu.com/fex/%70%69%63/item/c9fcc3cec3fdfc03ccabb38edd3f8794a4c22630.jpg"
                    />
                </span>
                <div className="a-Card-meta">
                    <div className="a-Card-title">
                        <span className="a-TplField">
                            <span>{name}</span>
                        </span>
                    </div>
                    <div className="a-Card-subTitle">
                        <span className="a-TplField">
                            <span>{createTime}</span>
                        </span>
                    </div>
                    <div className="a-Card-desc">
                        <span className="a-TplField">
                            <span>{description}</span>
                        </span>
                    </div>
                </div>
            </div>
            <div className="a-Card-body">
                <span className="a-TplField">
                    <span>{path}</span>
                </span>
            </div>
            <div className="a-Card-actions">
                <a className="a-Card-action a-Card-action--sm" onClick={onEdit}>
                    编辑
                </a>
                <a className="a-Card-action a-Card-action--sm hover:text-red-600" onClick={onDelete}>
                    删除
                </a>
            </div>
        </div>
    );
};
