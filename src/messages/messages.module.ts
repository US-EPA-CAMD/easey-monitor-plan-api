import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { MessagesGateway } from './messages.gateway';
import { UserCheckOutModule } from '../user-check-out/user-check-out.module';

@Module({
  imports: [HttpModule, UserCheckOutModule],
  providers: [MessagesGateway],
})
export class MessagesModule {}
