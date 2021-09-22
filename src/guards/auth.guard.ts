import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  InternalServerErrorException,
  HttpService,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { ConfigService } from '@nestjs/config';
import { parseToken } from '../utils';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async validateToken(token: string, ip: string): Promise<any> {
    const url = this.configService.get('app.authApi').uri + '/tokens/validate';

    return this.httpService
      .post(
        url,
        {
          token: token,
        },
        {
          headers: {
            'x-client-ip': ip,
          },
        },
      )
      .toPromise()
      .then(result => {
        return result.data;
      })
      .catch(error => {
        if (error.response) {
          throw new InternalServerErrorException(error.response.data.message);
        }
      });
  }

  async validateRequest(request): Promise<boolean> {
    if (request.headers.authorization === undefined) {
      throw new BadRequestException('Prior Authorization token is required.');
    }

    const splitString = request.headers.authorization.split(' ');
    if (splitString.lenth !== 2 && splitString[0] !== 'Bearer') {
      throw new BadRequestException('Prior Authorization token is required.');
    }

    const validatedToken = await this.validateToken(splitString[1], request.ip);
    const parsedToken = parseToken(validatedToken);

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
