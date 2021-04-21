// local
export const APP_NAME = '根联家居';
export const TOKEN_KEY = '_access_token';
export const USERINFO_KEY = '_user_info';
export const DEFAULT_AVATAR = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif';
// request
export const REQ_RESEND_MAX_COUNT = 1;
export const REQ_RESEND_COUNT_EXCEED_CODE = 4000001;
export const REQ_RESEND_COUNT_EXCEED_MSG = '重发次数超出上限';
export const REQ_OVERTIME_DURATION = 20 * 1000; // 2分钟超时
export const RES_SUCCESS_DEFAULT_CODE = 2000; // 处理成功
export const RES_NOT_FOUND_CODE = 3000; // 处理失败
export const RES_UNAUTHORIZED_CODE = 4010; // token过期
export const RES_PERMISSION_DENIED_CODE = 4100; // 权限不足
export const RES_INVALID_PARAMS_CODE = 4000; // 参数错误
export const RES_SECRET_INCORRECT_CODE = 4200; // 秘钥错误
export const RES_SERVER_EXCEPTION_CODE = 5000; // 服务器异常

// 基座路由
export const BASE_ROUTER = 'BASE_ROUTER';

// notification

export const ERR_MESSAGE_SHOW_DURATION = 3;
