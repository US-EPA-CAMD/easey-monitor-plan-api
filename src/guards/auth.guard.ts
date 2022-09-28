import { firstValueFrom, Observable } from "rxjs";
import {
  HttpStatus,
  Injectable,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { parseToken } from "@us-epa-camd/easey-common/utilities";
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService
  ) {}

  async validateToken(token: string, ip: string): Promise<any> {
    const apiKey = this.configService.get("app.apiKey");
    const url = this.configService.get("app.authApi").uri + "/tokens/validate";

    try {
      const result = await firstValueFrom(
        this.httpService.post(url, null, {
          headers: {
            authorization: `Bearer ${token}`,
            "x-forwarded-for": ip,
            "x-api-key": apiKey,
          },
        })
      );

      return result.data;
    } catch (error) {
      if (error.response) {
        throw new InternalServerErrorException(
          error.response.data.message,
          "An error occurred in AuthGuard while validating user security token."
        );
      }
    }
  }

  async validateRequest(request): Promise<boolean> {
    const authHeader = request.headers.authorization;
    const forwardedForHeader = request.headers["x-forwarded-for"];
    let errorMsg = "Prior Authorization (User Security Token) required to access this resource.";

    if (authHeader === null || authHeader === undefined) {
      throw new LoggingException(errorMsg, HttpStatus.BAD_REQUEST);
    }

    const splitString = authHeader.split(" ");
    if (splitString.length !== 2 && splitString[0] !== "Bearer") {
      throw new LoggingException(errorMsg, HttpStatus.BAD_REQUEST);
    }

    let ip = request.ip;
    if (forwardedForHeader !== null && forwardedForHeader !== undefined) {
      ip = forwardedForHeader.split(",")[0];
    }

    const validatedToken = await this.validateToken(splitString[1], ip);
    console.log(validatedToken);
    const parsedToken = parseToken(validatedToken);

    request.userId = parsedToken.userId; // Attach userId to request body

    return true;
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (this.configService.get("app.enableAuthToken") === true) {
      return this.validateRequest(request);
    }

    return true;
  }
}