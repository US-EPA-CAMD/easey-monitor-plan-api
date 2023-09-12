import { MonitorPlan } from '../entities/monitor-plan.entity';
import { MonitorPlanMap } from './monitor-plan.map';
import { MonitorLocationMap } from './monitor-location.map';
import { Test, TestingModule } from '@nestjs/testing';
import { MonitorMethodMap } from './monitor-method.map';
import { MatsMethodMap } from './mats-method.map';
import { MonitorFormulaMap } from './monitor-formula.map';
import { MonitorDefaultMap } from './monitor-default.map';
import { MonitorSpanMap } from './monitor-span.map';
import { DuctWafMap } from './duct-waf.map';
import { MonitorLoadMap } from './monitor-load.map';
import { ComponentMap } from './component.map';
import { MonitorSystemMap } from './monitor-system.map';
import { MonitorQualificationMap } from './monitor-qualification.map';
import { MonitorAttributeMap } from './monitor-attribute.map';
import { AnalyzerRangeMap } from './analyzer-range.map';
import { SystemFuelFlowMap } from './system-fuel-flow.map';
import { SystemComponentMap } from './system-component.map';
import { LEEQualificationMap } from './lee-qualification.map';
import { LMEQualificationMap } from './lme-qualification.map';
import { PCTQualificationMap } from './pct-qualification.map';
import { Plant } from '../entities/plant.entity';
import { MonitorPlanCommentMap } from './monitor-plan-comment.map';
import { UnitCapacityMap } from './unit-capacity.map';
import { UnitControlMap } from './unit-control.map';
import { UnitFuelMap } from './unit-fuel.map';
import { UnitStackConfigurationMap } from './unit-stack-configuration.map';
import { MonitorPlanReportingFrequencyMap } from './monitor-plan-reporting-freq.map';
import { CPMSQualificationMap } from './cpms-qualification.map';

const id = '';
const facId = 0;
const orisCode = 0;
const name = '';
const endReportPeriodId = 0;
const beginReportPeriodId = 1;
const active = false;
const monitoringPlanCommentData = [];
const unitStackConfigurations = [];
const locations = [];
const userId = '';
const addDate = new Date(Date.now());
const updateDate = new Date(Date.now());

const entity = new MonitorPlan();
const plant = new Plant();

plant.orisCode = orisCode;

entity.id = id;
entity.facId = facId;
entity.beginReportPeriodId = beginReportPeriodId;
entity.endReportPeriodId = endReportPeriodId;
entity.comments = monitoringPlanCommentData;
entity.locations = locations;
entity.userId = userId;
entity.addDate = addDate;
entity.updateDate = updateDate;
entity.plant = plant;

describe('MonitorPlanMap', () => {
  let map: MonitorPlanMap;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        MonitorPlanMap,
        MonitorLocationMap,
        MonitorMethodMap,
        MatsMethodMap,
        MonitorFormulaMap,
        MonitorDefaultMap,
        MonitorSpanMap,
        DuctWafMap,
        MonitorLoadMap,
        ComponentMap,
        MonitorSystemMap,
        MonitorPlanCommentMap,
        MonitorQualificationMap,
        MonitorAttributeMap,
        AnalyzerRangeMap,
        SystemFuelFlowMap,
        SystemComponentMap,
        LEEQualificationMap,
        LMEQualificationMap,
        PCTQualificationMap,
        CPMSQualificationMap,
        UnitCapacityMap,
        UnitControlMap,
        UnitFuelMap,
        UnitStackConfigurationMap,
        MonitorPlanReportingFrequencyMap,
      ],
    }).compile();

    map = module.get(MonitorPlanMap);
  });

  it('maps a monitor plan entity to its dto', async () => {
    const result = await map.one(entity);
    expect(result.id).toEqual(id);
    expect(result.facId).toEqual(facId);
    expect(result.orisCode).toEqual(orisCode);
    expect(result.name).toEqual(name);
    expect(result.beginReportPeriodId).toEqual(beginReportPeriodId);
    expect(result.endReportPeriodId).toEqual(endReportPeriodId);
    expect(result.active).toEqual(active);
    expect(result.monitoringPlanCommentData).toEqual(monitoringPlanCommentData);
    expect(result.unitStackConfigurationData).toEqual(unitStackConfigurations);
    expect(result.monitoringLocationData).toEqual(locations);
    expect(result.evalStatusCode).toEqual(null);
    expect(result.userId).toEqual(userId);
    expect(result.addDate).toEqual(addDate.toISOString());
    expect(result.updateDate).toEqual(updateDate.toISOString());
  });
});
