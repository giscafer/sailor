import * as React from 'react';

interface UserInfoProps {
    user: any;
    onLogout: Function;
}
interface UserInfoState {
    open?: boolean;
}
export default class UserInfo extends React.Component<UserInfoProps, UserInfoState> {
    constructor(props: UserInfoProps) {
        super(props);
        this.state = {
            open: false
        };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.logout = this.logout.bind(this);
    }

    static defaultProps = {};
    open() {
        this.setState({
            open: true
        });
    }
    close() {
        this.setState({
            open: false
        });
    }
    handleClickOutside() {
        this.close();
    }

    logout() {
        this.props.onLogout && this.props.onLogout();
    }

    render() {
        const user = this.props.user;
        const open = this.state.open;
        return (
            <div
                className="a-DropDown pull-right"
                style={{position: 'absolute', right: '10px'}}
                onMouseLeave={this.close}
            >
                <span onMouseOver={this.open}>
                    <span className="pull-right m-b-n-sm m-l-sm">
                        <span>
                            <i className="iconfont icon-admin" />
                        </span>
                        <i className="on md b-white bottom" />
                    </span>
                    <span className="hidden-md">{user.name || '未登录'}</span>
                    <b className="caret" />
                </span>
                <ul className={open ? 'a-DropDown-menu' : 'a-DropDown-menu hidden'} style={{left: -100}}>
                    <li className="is-disabled">
                        <a className="is-disabled">个人信息</a>
                    </li>
                    <li className="">
                        <a className="" onClick={this.logout}>
                            退出
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
}
