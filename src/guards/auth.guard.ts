import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { UserSession } from '../entities/user-session.entity';
import { createClientAsync } from 'soap';
import { ConfigService } from '@nestjs/config';
import { getManager } from 'typeorm';
import { parseToken } from '../utils';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async validateToken(token: string, clientIp: string): Promise<any> {
    const url = this.configService.get<string>('app.naasSvcs');

    return createClientAsync(url)
      .then(client => {
        return client.ValidateAsync({
          userId: this.configService.get<string>('app.naasAppId'),
          credential: this.configService.get<string>('app.nassAppPwd'),
          domain: 'default',
          securityToken: token,
          clientIp: clientIp,
          resourceURI: null,
        });
      })
      .then(async res => {
        return res[0].return;
      })
      .catch(err => {
        throw new InternalServerErrorException(
          err.root.Envelope.Body.Fault.detail.faultdetails,
          'Security token validation failed!',
        );
      });
  }

  async validateRequest(request): Promise<boolean> {
    if (request.headers.authorization === undefined)
      throw new BadRequestException('Prior Authorization token is required.');

    const splitString = request.headers.authorization.split(' ');
    if (splitString.lenth !== 2 && splitString[0] !== 'Bearer')
      throw new BadRequestException('Prior Authorization token is required.');

    const validatedToken = await this.validateToken(splitString[1], request.ip);
    const parsedToken = parseToken(validatedToken);

    const manager = getManager();

    // Logic to determine if session exists and is valid
    const sessionRecord = await manager.findOne(UserSession, {
      sessionId: parsedToken.sessionId,
    });
    if (sessionRecord) {
      if (new Date(Date.now()) > new Date(sessionRecord.tokenExpiration)) {
        throw new BadRequestException('User session has expired.');
      }
    } else {
      throw new BadRequestException('No session with token exists.');
    }

    request.userId = parsedToken.userId; // Attach userId to request body
    return true;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.validateRequest(request);
  }
}
