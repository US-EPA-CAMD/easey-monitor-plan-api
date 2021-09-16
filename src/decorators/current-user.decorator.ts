import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().userId;
  },
);

export default CurrentUser;
