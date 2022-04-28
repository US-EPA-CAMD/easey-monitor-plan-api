import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanComment } from 'src/entities/workspace/monitor-plan-comment.entity';
import { Plant } from 'src/entities/workspace/plant.entity';
import { StackPipe } from 'src/entities/workspace/stack-pipe.entity';
import { MonitorPlan } from 'src/entities/workspace/monitor-plan.entity';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { Check32, Check6, Check7 } from './mp-file-checks/component';
import { Check3, Check4, Check8 } from './mp-file-checks/facility-unit';
import { Check9 } from './mp-file-checks/formula';
import { Check11, Check12 } from './mp-file-checks/qual';
import { Check10 } from './mp-file-checks/span';
import { Check31, Check5 } from './mp-file-checks/system';
import { Check1, Check2 } from './mp-file-checks/unit-stack-config';
import { Check, CheckResult } from './utilities/check';
import { getEntityManager } from './utilities/utils';


@Injectable()
export class ImportChecksService {
  constructor(private readonly logger: Logger) {}

  private runCheckQueue = async (
    checkQueue: Check[],
    monPlan: UpdateMonitorPlanDTO,
  ): Promise<CheckResult[]> => {
    const checkListResults = [];

    for (const check of checkQueue) {
      const checkRun = await check.executeCheck(monPlan);

      if (checkRun.checkResult === false) {
        checkListResults.push(checkRun);
      }
    }

    if (checkListResults.length > 0) {
      const ErrorList = [];
      checkListResults.forEach(checkListResult => {
        ErrorList.push(...checkListResult.checkErrorMessages);
      });
      throw new BadRequestException(ErrorList, 'Validation Failure');
    }

    return checkListResults;
  };

  mpFileChecks = async (monPlan: UpdateMonitorPlanDTO) => {
    console.log(monPlan);
    const entityManager = getEntityManager();

    const fac = await entityManager.findOne(Plant, {
      orisCode: monPlan.orisCode
    })
    // console.log(fac.id)

    const monPlanIds = await entityManager.find(MonitorPlan, {
      facId: fac.id
    })
    // console.log(monPlanIds)
    // console.log(monPlanIds.length)

    const getMonPlanComment = async (monPlanId: string, monPlanComment: string, beginDate: Date) => {
      const monPlanCommentsInDb = await entityManager.find(MonitorPlanComment, {
        monitorPlanId: monPlanId, 
        monitorPlanComment: monPlanComment, 
        beginDate: beginDate
      });
      if (monPlanCommentsInDb.length == 0) {
        return 'No monitor plan comment found'
      }
      return monPlanCommentsInDb;
    } 

    const getStackPipe = async (stackPipeId: string, stackName: string) => {
      const stackPipes = await entityManager.findOne(StackPipe, {
        id: stackPipeId, 
        name: stackName
      });
      return stackPipes;
    }

    const createMonPlanComment = async (monPlanId: string, monPlanComment: string, beginDate: Date, endDate: Date, userId: string) => {
      return await entityManager.create(MonitorPlanComment, {
        monitorPlanId: monPlanId, 
        monitorPlanComment: monPlanComment, 
        beginDate: beginDate,
        endDate: endDate,
        userId: userId
      });
    } 

    /* const updateMonPlanComment = async (monPlanId: string, endDate: Date, userId: string) => {
      return await entityManager.create(MonitorPlanComment, {
        monitorPlanId: monPlanId, 
        monitorPlanComment: monPlanComment, 
        beginDate: beginDate,
        endDate: endDate,
        userId: userId
      });
    }  */

    monPlanIds.forEach( async (eachMonPlan) => {
      console.log(eachMonPlan.id)

      const monPlanComment = await getMonPlanComment(eachMonPlan.id, monPlan.comments[0].monitoringPlanComment, monPlan.comments[0].beginDate);
      console.log(monPlanComment)

      if(typeof monPlanComment === 'string') {
        console.log('Create Monitor Plan Comment')
        // createMonPlanComment(eachMonPlan.id, monPlan.comments[0].monitoringPlanComment, monPlan.comments[0].beginDate, null, null)
      }
      if ( typeof monPlanComment !== 'string' && monPlanComment.length > 0) {
        monPlanComment.forEach(async (planComment: MonitorPlanComment) => {
          /* const monPlanCommentInDb = await entityManager.findOne(MonitorPlanComment, {
            id: planComment.id,
            monitorPlanId: planComment.monitorPlanId, 
            monitorPlanComment: planComment.monitorPlanComment, 
            beginDate: planComment.beginDate
          }); */

          if (planComment.endDate !== monPlan.comments[0].endDate) { // userId
            planComment.endDate = monPlan.comments[0].endDate
            planComment.userId = 'userId' // NEED TO GET USER ID
          }

          // update monitor plan
          // await entityManager.update(MonitorPlanComment, planComment);
        })
      }
     })

    monPlan.locations.forEach( async (eachStackPipe) => {
      const statckPipe = await entityManager.findOne(StackPipe, {
        id: eachStackPipe.stackPipeId
      });
      console.log(eachStackPipe)
      if (statckPipe) {
        if(statckPipe.activeDate !== eachStackPipe.activeDate) {
          statckPipe.activeDate = eachStackPipe.activeDate;
          // statckPipe.userId = 'USER ID';
          // statckPipe.activeDate = eachStackPipe.active;
        }
        if(statckPipe.retireDate !== eachStackPipe.retireDate) statckPipe.retireDate = eachStackPipe.retireDate;
        console.log(statckPipe)
        // update Stsck Pipe
        // await entityManager.update(StackPipe, statckPipe);
      }

    })


    this.logger.info('Running monitoring plan import file checks...', {
      orisCode: monPlan.orisCode,
    });
    const LocationChecks = [
      Check1,
      Check2,
      Check5,
      Check6,
      Check7,
      Check9,
      Check10,
      Check11,
      Check12,
      Check31,
      Check32,
    ];

    const UnitStackChecks1 = [Check3];
    const UnitStackChecks2 = [Check4, Check8]; //Depends on UnitStackChecks1 Passing

    await this.runCheckQueue(LocationChecks, monPlan);
    if (monPlan.unitStackConfiguration !== undefined) {
      await this.runCheckQueue(UnitStackChecks1, monPlan);
      await this.runCheckQueue(UnitStackChecks2, monPlan);
    }

    this.logger.info(
      'Successfully completed monitor plan import with no errors',
      {
        orisCode: monPlan.orisCode,
      },
    );
  };
}
