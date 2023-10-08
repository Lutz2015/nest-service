import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { INestApplication } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '@app/routers/auth';
import { RedisService } from '@app/shared/redis';
import { formatAuthorization } from '@app/helpers/utils.helper';
import { IUserLoginCache, userLoginCachePrefix } from '@app/routers/user';
import { IsPublicInterface } from '@app/helpers/reflector-validate.helper';

export class JwtAuthGuard extends AuthGuard('jwt') {
    private configService: ConfigService;
    private authService: AuthService;
    private redisService: RedisService;

    public constructor(app: INestApplication) {
        super();
        this.configService = app.get(ConfigService);
        this.authService = app.get(AuthService);
        this.redisService = app.get(RedisService);
    }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        // 如果是非验证的接口，则直接访问
        if (IsPublicInterface(context.getHandler())) return true;

        // 如果jwt的token验证失败，则直接抛错, canActivate调用的是jwt.strategy.ts中的validate方法
        if (!(await super.canActivate(context))) throw new UnauthorizedException();

        const request: Request = context.switchToHttp().getRequest();
        const jwtToken = formatAuthorization(request.get('Authorization'));

        // 如果jwt的token无法解码或者redis中不存在该用户信息，那么则为
        const userInfo = this.authService.verifyToken(jwtToken);
        const redisHandle = userLoginCachePrefix(userInfo!.id, userInfo!.email);
        const redisStore = await this.redisService.get<IUserLoginCache>(redisHandle);
        if (!redisStore || redisStore.token !== jwtToken) throw new UnauthorizedException();

        // 如果不配置，那么则不设置过期时间
        const expireTime = this.configService.get<number>('app.loginExpiresIn');
        if (expireTime) await this.redisService.expire(redisHandle, expireTime);

        return true;
    }
}