
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppService } from './app.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly appService: AppService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'SUPER_SECRET_KEY_123', // In production, use env variable
        });
    }

    async validate(payload: any) {
        const user = await this.appService.findOne(payload.username);
        if (!user) {
            throw new UnauthorizedException();
        }
        // Return user with userId property for controllers
        return { ...user, userId: user.id };
    }
}
