import React from 'react';

export default (props: {onRefresh: () => void}) => {
    const {onRefresh} = props;
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
            <div style={{width: '200px', height: '200px', textAlign: 'center', lineHeight: '200px'}}>
                <span style={{fontSize: '18px'}}>暂无数据</span>
                <i className="fa fa-refresh mx-5" style={{cursor: 'pointer'}} onClick={onRefresh} />
            </div>
        </div>
    );
};
