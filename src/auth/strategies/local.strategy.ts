import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthV1Service } from '../v1/auth.v1.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthV1Service) {
    super({
      usernameField: 'id',
      passwordField: 'secretKey',
      passReqToCallback: false,
    });
  }

  async validate(id: string, secretKey: string): Promise<any> {
    const user = await this.authService.validateUser(id, secretKey);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
