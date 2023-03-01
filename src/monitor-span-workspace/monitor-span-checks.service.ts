import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CheckCatalogService } from "@us-epa-camd/easey-common/check-catalog";
import { LoggingException } from "@us-epa-camd/easey-common/exceptions";
import { Logger } from "@us-epa-camd/easey-common/logger";
import { ComponentWorkspaceRepository } from "../component-workspace/component.repository";
import { MonitorSpanBaseDTO } from "../dtos/monitor-span.dto";
import { MonitorSpanWorkspaceRepository } from "./monitor-span.repository";

const KEY = 'Monitor Span';

@Injectable()
export class MonitorSpanChecksService {

    constructor(
        private readonly logger: Logger,
        @InjectRepository(MonitorSpanWorkspaceRepository)
        private readonly repository: MonitorSpanWorkspaceRepository,
        @InjectRepository(ComponentWorkspaceRepository)
        private readonly componentRepository: ComponentWorkspaceRepository,
    ) {}

    public throwIfErrors(errorList: string[]) {
        if (errorList.length > 0) {
          throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
        }
      }

      async runChecks( 
        payload: MonitorSpanBaseDTO,
        locationId: string,
        ) {

            const errorList: string[] = [];
            this.logger.info('Running Test Summary Checks');
      }

      private async flowFullScaleRangeCheck(
        locationId: string,
        payload: MonitorSpanBaseDTO,
      ) {
        let FIELDNAME: string = 'flowFullScaleRange';
        const component = await this.componentRepository.findOne({
            locationId: locationId,
            componentId: payload.componentTypeCode,
          });

          if (component) {
            if (component.componentTypeCode === 'FLOW') {
                if(payload.flowFullScaleRange === null) {
                    return this.getMessage('SPAN-17-A', {
                        fieldname: FIELDNAME,
                        key: KEY,
                      });
                }
            }
          }

      }
      getMessage(messageKey: string, messageArgs: object): string {
        return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
      }
}