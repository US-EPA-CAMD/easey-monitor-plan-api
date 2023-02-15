import {
  UseGuards,
} from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { AuthGuard } from "@us-epa-camd/easey-common/guards";

import { Server } from 'socket.io';
import { UserCheckOutService } from '../user-check-out/user-check-out.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class MessagesGateway {

  @WebSocketServer()
  server: Server

  constructor(
    private readonly service: UserCheckOutService
  ) {}

  @SubscribeMessage('getCheckedOutConfigurations')
  getCheckedOutConfigurations() {
    return this.service.getCheckedOutConfigurations();
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('checkOutConfiguration')
  async checkOutConfiguration(
    @User() user: CurrentUser,
    @MessageBody('monPlanId') monPlanId: string,
  ) {
    const config = await this.service.checkOutConfiguration(
      monPlanId,
      user.userId,
    );
    this.server.emit('checkOutConfiguration', config);
    return config;
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('checkInConfiguration')
  async checkInConfiguration(
    @User() user: CurrentUser,
    @MessageBody('monPlanId') monPlanId: string,
  ) {
    const config = await this.service.getCheckedOutConfiguration(monPlanId);
    if (config && await this.service.checkInConfiguration(monPlanId)) {
      this.server.emit('checkInConfiguration', config);
      //await this.mpWksService.updateDateAndUserId(monPlanId, user.userId);
    }
    return config;
  }
}