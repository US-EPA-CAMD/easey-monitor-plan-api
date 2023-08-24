import { MonitorPlanCommentDTO } from '../dtos/monitor-plan-comment.dto';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { UnitStackConfigurationDTO } from '../dtos/unit-stack-configuration.dto';
import { MonitorAttributeDTO } from '../dtos/monitor-attribute.dto';
import { MonitorFormulaDTO } from '../dtos/monitor-formula.dto';
import { MonitorSpanDTO } from '../dtos/monitor-span.dto';
import { MonitorLoadDTO } from '../dtos/monitor-load.dto';
import { MonitorMethodDTO } from '../dtos/monitor-method.dto';
import { DuctWafDTO } from '../dtos/duct-waf.dto';
import { MonitorDefaultDTO } from '../dtos/monitor-default.dto';
import { ComponentDTO } from '../dtos/component.dto';
import { MonitorQualificationDTO } from '../dtos/monitor-qualification.dto';
import { AnalyzerRangeDTO } from '../dtos/analyzer-range.dto';
import { MonitorSystemDTO } from '../dtos/monitor-system.dto';
import { SystemFuelFlowDTO } from '../dtos/system-fuel-flow.dto';
import { SystemComponentDTO } from '../dtos/system-component.dto';
import { PCTQualificationDTO } from '../dtos/pct-qualification.dto';
import { LMEQualificationDTO } from '../dtos/lme-qualification.dto';
import { LEEQualificationDTO } from '../dtos/lee-qualification.dto';

export async function removeNonReportedValues(dto: MonitorPlanDTO) {
  const promises = [];
  promises.push(removeMonitorPlanComment(dto.comments));
  promises.push(removeUnitStackConfiguration(dto.unitStackConfigurations));
  promises.push(removeMonitorLocationReportedValues(dto.locations));

  await Promise.all(promises);
}

async function removeMonitorPlanComment(comments: MonitorPlanCommentDTO[]) {
  comments?.forEach(dto => {
    delete dto.id;
    delete dto.planId;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
}

async function removeUnitStackConfiguration(
  unitStackConfigurations: UnitStackConfigurationDTO[],
) {
  unitStackConfigurations?.forEach(dto => {
    delete dto.id;
    delete dto.unitRecordId;
    delete dto.stackPipeRecordId;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
  });
}
// LOCATIONS
async function removeMonitorLocationReportedValues(
  locations: MonitorLocationDTO[],
) {
  const promises = [];
  locations?.forEach(location => {
    promises.push(monitorLocationAttribute(location.attributes));
    promises.push(monitorMethod(location.methods));
    promises.push(monitorFormula(location.formulas));
    promises.push(monitorSpan(location.spans));
    promises.push(monitorDefault(location.defaults));
    promises.push(monitorLoad(location.loads));
    promises.push(rectangularDuctWaf(location.ductWafs));
    promises.push(component(location.components));
    promises.push(monitorQualification(location.qualifications));
    promises.push(monitorSystem(location.systems));
  });
}

async function monitorLocationAttribute(attributes: MonitorAttributeDTO[]) {
  attributes?.forEach(attribute => {
    delete attribute.id;
    delete attribute.locationId;
    delete attribute.userId;
    delete attribute.userId;
    delete attribute.addDate;
    delete attribute.updateDate;
  });
}

async function monitorMethod(methods: MonitorMethodDTO[]) {
  const promises = [];

  methods?.forEach(method => {
    delete method.id;
    delete method.locationId;
    delete method.userId;
    delete method.addDate;
    delete method.updateDate;
  });
}

async function monitorFormula(formulas: MonitorFormulaDTO[]) {
  formulas?.forEach(formula => {
    delete formula.id;
    delete formula.locationId;
    delete formula.userId;
    delete formula.addDate;
    delete formula.updateDate;
  });
}

async function monitorDefault(defaults: MonitorDefaultDTO[]) {
  defaults?.forEach(defaults => {
    delete defaults.id;
    delete defaults.locationId;
    delete defaults.userId;
    delete defaults.addDate;
    delete defaults.updateDate;
  });
}

async function monitorSpan(spans: MonitorSpanDTO[]) {
  spans?.forEach(span => {
    delete span.id;
    delete span.locationId;
    delete span.userid;
    delete span.addDate;
    delete span.updateDate;
  });
}

async function monitorLoad(loads: MonitorLoadDTO[]) {
  loads?.forEach(load => {
    delete load.id;
    delete load.locationId;
    delete load.userId;
    delete load.addDate;
    delete load.updateDate;
  });
}

async function rectangularDuctWaf(ductWafs: DuctWafDTO[]) {
  ductWafs?.forEach(ductWaf => {
    delete ductWaf.id;
    delete ductWaf.locationId;
    delete ductWaf.userId;
    delete ductWaf.addDate;
    delete ductWaf.updateDate;
  });
}

async function component(components: ComponentDTO[]) {
  const promises = [];

  components?.forEach(component => {
    promises.push(analyzerRange(component.analyzerRanges));
    delete component.id;
    delete component.locationId;
    delete component.userId;
    delete component.addDate;
    delete component.updateDate;
  });
}

async function analyzerRange(analyzerRanges: AnalyzerRangeDTO[]) {
  analyzerRanges?.forEach(analyzerRange => {
    delete analyzerRange.id;
    delete analyzerRange.componentRecordId;
    delete analyzerRange.userId;
    delete analyzerRange.addDate;
    delete analyzerRange.updateDate;
  });
}

async function monitorQualification(qualifications: MonitorQualificationDTO[]) {
  const promises = [];
  qualifications?.forEach(qualification => {
    promises.push(qualificationPCT(qualification.pctQualifications));
    promises.push(qualificationLME(qualification.lmeQualifications));
    promises.push(qualificationLEE(qualification.leeQualifications));
    delete qualification.id;
    delete qualification.locationId;
    delete qualification.userId;
    delete qualification.addDate;
    delete qualification.updateDate;
  });
}

async function qualificationPCT(qualificationPercents: PCTQualificationDTO[]) {
  qualificationPercents?.forEach(qualificationPercent => {
    delete qualificationPercent.id;
    delete qualificationPercent.qualificationId;
    delete qualificationPercent.userId;
    delete qualificationPercent.addDate;
    delete qualificationPercent.updateDate;
  });
}

async function qualificationLME(qualificationLMEs: LMEQualificationDTO[]) {
  qualificationLMEs?.forEach(qualificationLME => {
    delete qualificationLME.id;
    delete qualificationLME.qualificationId;
    delete qualificationLME.userId;
    delete qualificationLME.addDate;
    delete qualificationLME.updateDate;
  });
}

async function qualificationLEE(qualificationLEEs: LEEQualificationDTO[]) {
  qualificationLEEs?.forEach(qualificationLEE => {
    delete qualificationLEE.id;
    delete qualificationLEE.qualificationId;
    delete qualificationLEE.userId;
    delete qualificationLEE.addDate;
    delete qualificationLEE.updateDate;
  });
}

async function monitorSystem(systems: MonitorSystemDTO[]) {
  const promises = [];
  systems?.forEach(system => {
    promises.push(monitorSystemFuel(system.fuelFlows));
    promises.push(monitorSystemComponent(system.components));
    delete system.id;
    delete system.locationId;
    delete system.userId;
    delete system.addDate;
    delete system.updateDate;
  });
}

async function monitorSystemFuel(fuels: SystemFuelFlowDTO[]) {
  fuels?.forEach(fuel => {
    delete fuel.id;
    delete fuel.monitoringSystemRecordId;
    delete fuel.fuelCode;
    delete fuel.systemTypeCode;
    delete fuel.userId;
    delete fuel.addDate;
    delete fuel.updateDate;
  });
}

async function monitorSystemComponent(systemComponents: SystemComponentDTO[]) {
  systemComponents?.forEach(component => {
    delete component.id;
    delete component.locationId;
    delete component.monitoringSystemRecordId;
    delete component.componentRecordId;
    delete component.userId;
    delete component.addDate;
    delete component.updateDate;
  });
}
