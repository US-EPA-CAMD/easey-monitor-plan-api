import { HttpStatus, Injectable } from "@nestjs/common";
import { LoggingException } from "@us-epa-camd/easey-common/exceptions";
import { Logger } from "@us-epa-camd/easey-common/logger";
import { MonitorSpanBaseDTO } from "src/dtos/monitor-span.dto";


@Injectable()
export class MonitorSpanChecksService {

    constructor(
        private readonly logger: Logger,
    ) {}

    public throwIfErrors(errorList: string[]) {
        if (errorList.length > 0) {
          throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
        }
      }

      async runChecks( payload: MonitorSpanBaseDTO): Promise<string[]> {
        this.logger.info('Running Emmissions Import Checks')
      }
}