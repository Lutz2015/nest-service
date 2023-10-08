// 登录后用返回给前端的token
export interface IUserLoginResponse {
    token: string;
}

// 登录验证码接口返回值
export interface IUserCaptchaResponse {
    hashId: string;

    captcha: string;
}

// 用户的基础信息
export interface IUserInfo {
    id: number;

    username: string;

    email: string;

    avatar: string;
}

// 缓存中用户的信息
export interface IUserLoginCache extends Omit<IUserInfo, 'avatar'> {
    roleIds: number[];

    token: string;
}
