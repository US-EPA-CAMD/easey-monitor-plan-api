import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MonitorLocationService {
  constructor(private configService: ConfigService) {}

  getMonitorLocations(): string {
    console.log(`${this.configService.get('app.uri')}/monitor-locations`);
    return 'Hello getMonitorLocations!';
  }
}
