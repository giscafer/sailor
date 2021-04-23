import React from 'react';
import {defaultProjectCoverImg} from '../../config';
export default (props: any) => {
    const {name, path, createTime, description, coverImg, onDelete = () => {}, onEdit = () => {}} = props;
    return (
        <div className="a-Card">
            <div className="a-Card-heading">
                <span className="a-Card-avtar pull-left b-3x m-r">
                    <img
                        className="a-Card-img"
                        style={{borderRadius: '6px', width: '160px'}}
                        src={coverImg || defaultProjectCoverImg}
                    />
                </span>
                <div className="a-Card-meta" style={{width: '130px'}}>
                    <div className="a-Card-title">
                        <span className="a-TplField">
                            <span>{name}</span>
                        </span>
                    </div>
                    <div className="a-Card-subTitle">
                        <span className="a-TplField">
                            <span style={{fontSize: '12px'}}>{path}</span>
                        </span>
                    </div>
                    <div className="a-Card-desc" style={{width: '130px', fontSize: '12px'}}>
                        <span className="a-TplField">
                            <span>{createTime}</span>
                        </span>
                    </div>
                </div>
            </div>
            <div className="a-Card-body" style={{minHeight: '50px'}}>
                <span className="a-TplField">
                    <span>{description}</span>
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
