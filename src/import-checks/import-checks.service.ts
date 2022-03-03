import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { UpdateMonitorPlanDTO } from 'src/dtos/monitor-plan-update.dto';
import { Check32, Check6, Check7 } from './mp-file-checks/component';
import { Check3, Check4, Check8 } from './mp-file-checks/facility-unit';
import { Check9 } from './mp-file-checks/formula';
import { Check11, Check12 } from './mp-file-checks/qual';
import { Check10 } from './mp-file-checks/span';
import { Check31, Check5 } from './mp-file-checks/system';
import { Check1, Check2 } from './mp-file-checks/unit-stack-config';
import { Check, CheckResult } from './utilities/check';
// import { JSV } from 'jsv';
import * as schema from './utilities/import-schema.json';

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
    this.logger.info('Running monitoring plan import file checks... on ', {
      orisCode: monPlan.orisCode,
    });
    // console.log(schema)

    console.log("test log")

    // var importJson = 
    // {
    //   "orisCode": 3,
    //   "comments": [
    //     {
    //       "monitoringPlanComment": "DAHS was updated for GT-1 on 11/10/2016 by a previous owner, but the component ID was not updated on the gas system. This was corrected on 9/8/2020.",
    //       "beginDate": "2020-09-28",
    //       "endDate": null
    //     }
    //   ],
    //   "unitStackConfiguration": [
    //     {
    //       "unitId": 2,
    //       "stackPipeId": "MDC-CCB8D6D0D4E34D24A99C01DCD14078DF",
    //       "beginDate": "1995-01-01",
    //       "endDate": "2020-12-31"
    //     }
    //   ],
    //   "locations": [
    //     {
    //       "unitId": 123456,
    //       "stackPipeId": "CS0AAN",
    //       "activeDate": "1995-01-01",
    //       "retireDate": "2015-08-24",
    //       "nonLoadBasedIndicator": 1,
    //       "attributes": [
    //         {
    //           "ductIndicator": 1,
    //           "bypassIndicator": 1,
    //           "groundElevation": "40",
    //           "stackHeight": "400",
    //           "materialCode": "OTHER",
    //           "shapeCode": "ROUND",
    //           "crossAreaFlow": 306,
    //           "crossAreaStackExit": "306",
    //           "beginDate": "20080101",
    //           "endDate": null
    //         }
    //       ],
    //       "unitCapacity": [
    //         {
    //           "maximumHourlyHeatInputCapacity": 2322.1,
    //           "beginDate": "2009-01-01",
    //           "endDate": null
    //         }
    //       ],
    //       "unitControls": [
    //         {
    //           "controlEquipParamCode": "PART",
    //           "controlCode": "SNCR",
    //           "originalCode": "0",
    //           "installDate": "2005-01-01",
    //           "optimizationDate": "2006-06-01",
    //           "seasonalControlsIndicator": "0",
    //           "retireDate": null
    //         }
    //       ],
    //       "unitFuels": [
    //         {
    //           "fuelCode": "C",
    //           "indicatorCode": "P",
    //           "ozoneSeasonIndicator": 0,
    //           "demGCV": "GGC",
    //           "demSO2": "SGC",
    //           "beginDate": "1995-01-01",
    //           "endDate": "2015-03-30"
    //         }
    //       ],
    //       "methods": [
    //         {
    //           "parameterCode": "SO2",
    //           "monitoringMethodCode": "CEM",
    //           "substituteDataCode": "SPTS",
    //           "bypassApproachCode": "BYMAX",
    //           "beginDate": "2007-11-27",
    //           "beginHour": 17,
    //           "endDate": null,
    //           "endHour": null
    //         }
    //       ],
    //       "matsMethods": [
    //         {
    //           "supplementalMATSParameterCode": "QST",
    //           "supplementalMATSMonitoringMethodCode": "TNHGM",
    //           "beginDate": "2016-04-28",
    //           "beginHour": 1,
    //           "endDate": "2020-04-28",
    //           "endHour": 23
    //         }
    //       ],
    //       "formulas": [
    //         {
    //           "formulaId": "140",
    //           "parameterCode": "SO2",
    //           "formulaCode": "F-1",
    //           "formulaText": "1.667 * 10**-7 * S#(027-C40) * S#(029-C42)",
    //           "beginDate": "2007-11-08",
    //           "beginHour": 17,
    //           "endDate": null,
    //           "endHour": null
    //         }
    //       ],
    //       "defaults": [
    //         {
    //           "parameterCode": "CO2N",
    //           "defaultValue": 5,
    //           "defaultUnitsOfMeasureCode": "PCT",
    //           "defaultPurposeCode": "DC",
    //           "fuelCode": "NFS",
    //           "operatingConditionCode": "A",
    //           "defaultSourceCode": "DEF",
    //           "groupId": "GP2249",
    //           "beginDate": "2008-01-01",
    //           "beginHour": 1,
    //           "endDate": null,
    //           "endHour": null
    //         }
    //       ],
    //       "spans": [
    //         {
    //           "componentTypeCode": "SO2",
    //           "spanScaleCode": "H",
    //           "spanMethodCode": "HD",
    //           "mecValue": 156.9,
    //           "mpcValue": 177.2,
    //           "mpfValue": 8563000,
    //           "spanValue": 200,
    //           "fullScaleRange": 200,
    //           "spanUnitsOfMeasureCode": "PPM",
    //           "defaultHighRange": null,
    //           "flowSpanValue": null,
    //           "flowFullScaleRange": null,
    //           "beginDate": "2018-05-17",
    //           "beginHour": 14,
    //           "endDate": null,
    //           "endHour": null,
    //           "scaleTransitionPoint": 0
    //         }
    //       ],
    //       "ductWafs": [
    //         {
    //           "wafDeterminationDate": "2020-11-18",
    //           "wafBeginDate": "2020-11-28",
    //           "wafBeginHour": 12,
    //           "wafMethodCode": "FT",
    //           "wafValue": 1.0454,
    //           "numberOfTestRuns": 3,
    //           "numberOfTraversePointsWaf": 48,
    //           "numberOfTestPorts": 4,
    //           "numberOfTraversePointsRef": 48,
    //           "ductWidth": 12,
    //           "ductDepth": 18.5,
    //           "wafEndDate": "2021-09-18",
    //           "wafEndHour": 9,
    //           "active": true
    //         }
    //       ],
    //       "loads": [
    //         {
    //           "maximumLoadValue": 353,
    //           "maximumLoadUnitsOfMeasureCode": "MW",
    //           "lowerOperationBoundary": 145,
    //           "upperOperationBoundary": 301,
    //           "normalLevelCode": "L",
    //           "secondLevelCode": "M",
    //           "secondNormalIndicator": 1,
    //           "loadAnalysisDate": "2018-09-31",
    //           "beginDate": "2018-09-31",
    //           "beginHour": 23,
    //           "endDate": null,
    //           "endHour": null
    //         }
    //       ],
    //       "components": [
    //         {
    //           "componentId": "027",
    //           "componentTypeCode": "SO2",
    //           "sampleAcquisitionMethodCode": "DOU",
    //           "basisCode": "W",
    //           "manufacturer": "TECO",
    //           "modelVersion": "43I",
    //           "serialNumber": "631819420",
    //           "hgConverterIndicator": 1,
    //           "analyzerRanges": [
    //             {
    //               "analyzerRangeCode": "A",
    //               "dualRangeIndicator": 1,
    //               "beginDate": "2008-05-17",
    //               "beginHour": 14,
    //               "endDate": null,
    //               "endHour": null
    //             }
    //           ]
    //         }
    //       ],
    //       "systems": [
    //         {
    //           "monitoringSystemId": "C42",
    //           "systemTypeCode": "FLOW",
    //           "systemDesignationCode": "P",
    //           "fuelCode": "NFS",
    //           "beginDate": "2007-11-28",
    //           "endDate": null,
    //           "beginHour": 17,
    //           "endHour": null,
    //           "components": [
    //             {
    //               "componentId": "027",
    //               "componentTypeCode": "SO2",
    //               "sampleAcquisitionMethodCode": "DOU",
    //               "basisCode": "W",
    //               "manufacturer": "TECO",
    //               "modelVersion": "43I",
    //               "serialNumber": "631819420",
    //               "hgConverterIndicator": 1,
    //               "beginDate": "2008-12-31",
    //               "beginHour": 23,
    //               "endDate": null,
    //               "endHour": null
    //             }
    //           ],
    //           "fuelFlows": [
    //             {
    //               "maximumFuelFlowRate": 30667,
    //               "systemFuelFlowUOMCode": "HSCF",
    //               "maximumFuelFlowRateSourceCode": "URV",
    //               "beginDate": "2010-08-01",
    //               "beginHour": 12,
    //               "endDate": null,
    //               "endHour": null
    //             }
    //           ]
    //         }
    //       ],
    //       "qualifications": [
    //         {
    //           "qualificationTypeCode": "LMES",
    //           "beginDate": "2018-05-01",
    //           "endDate": null,
    //           "leeQualifications": [
    //             {
    //               "qualificationTestDate": "2018-07-15",
    //               "parameterCode": "HG",
    //               "qualificationTestType": "INITIAL",
    //               "potentialAnnualMassEmissions": 10.2,
    //               "applicableEmissionStandard": 29,
    //               "unitsOfStandard": "LBGWH",
    //               "percentageOfEmissionStandard": 72.8
    //             }
    //           ],
    //           "lmeQualifications": [
    //             {
    //               "qualificationDataYear": 2015,
    //               "operatingHours": 105,
    //               "so2Tons": 0.9,
    //               "noxTons": 6.4
    //             }
    //           ],
    //           "pctQualifications": [
    //             {
    //               "year": 2020,
    //               "averagePercentValue": 100,
    //               "yr1QualificationDataYear": 2018,
    //               "yr1QualificationDataTypeCode": "A",
    //               "yr1PercentageValue": 100,
    //               "yr2QualificationDataYear": 2019,
    //               "yr2QualificationDataTypeCode": "A",
    //               "yr2PercentageValue": 100,
    //               "yr3QualificationDataYear": 2020,
    //               "yr3QualificationDataTypeCode": "A",
    //               "yr3PercentageValue": 100
    //             }
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // }


    console.log("\n=======================================\n")

    console.log("JSV test")
    var JSV = require("JSV").JSV;
    var env = JSV.createEnvironment();
    var report = env.validate(monPlan, schema);
    console.log(report)

    console.log("\n=======================================\n")

    console.log("jsonschema test")

    var Validator = require("jsonschema").Validator;
    var v = new Validator();
    var result = v.validate(monPlan, schema)
    console.log(result)
    // console.log(result.instance)
    // console.log(result.instance.definitions.Location)
    // console.log(result.schema.MonitoringPlan.definitions.Location)

    console.log("\n=======================================\n")

    // var Validator = require('jsonschema').Validator;
    // var v = new Validator();
    var instance = {
      "original_image": {
        "temp_id": "this is my id",
        "scale": {
          "new_width": null,
          "new_height": 329
        }
      }
    };
    var schemaTest = {
      title: "Example  Schema",
      type: "object",
      properties: {
        original_image:{
          type: "object",
          properties: {
            temp_id: {type: "string"},
            url: {type: "string"},
            scale:{
              type: "object",
              properties:{
                new_width: {type: "number"},
                new_height: {type: "number"}
              },
              required:["new_width","new_height"]
            }
          },
          required:["url","temp_id","scale"]
        }
      },
      required:["image"]
    };
    // console.log(env.validate(instance, schemaTest))
    // console.log(v.validate(instance, schemaTest));


    console.log("end test log")
    // const LocationChecks = [
    //   Check1,
    //   Check2,
    //   Check5,
    //   Check6,
    //   Check7,
    //   Check9,
    //   Check10,
    //   Check11,
    //   Check12,
    //   Check31,
    //   Check32,
    // ];
    // const UnitStackChecks = [Check3, Check4, Check8];
    // await this.runCheckQueue(LocationChecks, monPlan);
    // if (monPlan.unitStackConfiguration !== undefined) {
    //   await this.runCheckQueue(UnitStackChecks, monPlan);
    // }

    this.logger.info(
      'Successfully completed monitor plan import with no errors',
      {
        orisCode: monPlan.orisCode,
      },
    );
  };
}
