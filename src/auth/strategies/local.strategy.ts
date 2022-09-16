import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import {V1AuthService} from "../v1/v1.auth.service";
import {UserEntity} from "../../entities";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: V1AuthService) {
        super();
    }

    async validate(appId: string, apiKey: string): Promise<any> {
        const user = await this.authService.validateUser(appId, apiKey);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}