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
import { UnitCapacityDTO } from '../dtos/unit-capacity.dto';
import { UnitControlDTO } from '../dtos/unit-control.dto';
import { UnitFuelDTO } from '../dtos/unit-fuel.dto';
import { CPMSQualificationDTO } from '../dtos/cpms-qualification.dto';
import { MatsMethodDTO } from '../dtos/mats-method.dto';

export async function removeNonReportedValues(dto: MonitorPlanDTO) {
  const promises = [];
  delete dto.id;
  delete dto.facId;
  delete dto.facilityName;
  delete dto.configTypeCode;
  delete dto.lastUpdated;
  delete dto.updatedStatusFlag;
  delete dto.needsEvalFlag;
  delete dto.checkSessionId;
  delete dto.name;
  delete dto.beginReportPeriodId;
  delete dto.endReportPeriodId;
  delete dto.active;
  delete dto.pendingStatusCode;
  delete dto.evalStatusCode;
  delete dto.evalStatusCodeDescription;
  delete dto.userId;
  delete dto.addDate;
  delete dto.updateDate;
  delete dto.submissionId;
  delete dto.submissionAvailabilityCode;
  delete dto.submissionAvailabilityCodeDescription;
  delete dto.lastEvaluatedDate;
  delete dto.reportingFrequencies;

  promises.push(removeMonitorPlanComment(dto.monitoringPlanCommentData));
  promises.push(removeUnitStackConfiguration(dto.unitStackConfigurationData));
  promises.push(
    removeMonitorLocationReportedValues(dto.monitoringLocationData),
  );

  await Promise.all(promises);
}

async function removeMonitorPlanComment(comments: MonitorPlanCommentDTO[]) {
  comments?.forEach(dto => {
    delete dto.id;
    delete dto.planId;
    delete dto.userId;
    delete dto.addDate;
    delete dto.updateDate;
    delete dto.active;
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
    delete dto.active;
  });
}
// LOCATIONS
async function removeMonitorLocationReportedValues(
  locations: MonitorLocationDTO[],
) {
  const promises = [];
  locations?.forEach(location => {
    delete location.id;
    delete location.unitRecordId;
    delete location.stackPipeRecordId;
    delete location.name;
    delete location.type;
    delete location.active;

    promises.push(
      monitorLocationAttribute(location.monitoringLocationAttribData),
    );
    promises.push(monitorMethod(location.monitoringMethodData));
    promises.push(monitorFormula(location.monitoringFormulaData));
    promises.push(monitorSpan(location.monitoringSpanData));
    promises.push(monitorDefault(location.monitoringDefaultData));
    promises.push(monitorLoad(location.monitoringLoadData));
    promises.push(rectangularDuctWaf(location.rectangularDuctWAFData));
    promises.push(component(location.componentData));
    promises.push(monitorQualification(location.monitoringQualificationData));
    promises.push(monitorSystem(location.monitoringSystemData));
    promises.push(unitCapacity(location.unitCapacityData));
    promises.push(unitControl(location.unitControlData));
    promises.push(unitFuel(location.unitFuelData))
    promises.push(suppMatsMonitorMethod(location.supplementalMATSMonitoringMethodData))
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
    delete attribute.active;
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
    delete method.active;
  });
}

async function monitorFormula(formulas: MonitorFormulaDTO[]) {
  formulas?.forEach(formula => {
    delete formula.id;
    delete formula.locationId;
    delete formula.userId;
    delete formula.addDate;
    delete formula.updateDate;
    delete formula.active;
  });
}

async function monitorDefault(defaults: MonitorDefaultDTO[]) {
  defaults?.forEach(defaults => {
    delete defaults.id;
    delete defaults.locationId;
    delete defaults.userId;
    delete defaults.addDate;
    delete defaults.updateDate;
    delete defaults.active;
  });
}

async function monitorSpan(spans: MonitorSpanDTO[]) {
  spans?.forEach(span => {
    delete span.id;
    delete span.locationId;
    delete span.userid;
    delete span.addDate;
    delete span.updateDate;
    delete span.active;
  });
}

async function monitorLoad(loads: MonitorLoadDTO[]) {
  loads?.forEach(load => {
    delete load.id;
    delete load.locationId;
    delete load.userId;
    delete load.addDate;
    delete load.updateDate;
    delete load.active;
  });
}

async function rectangularDuctWaf(ductWafs: DuctWafDTO[]) {
  ductWafs?.forEach(ductWaf => {
    delete ductWaf.id;
    delete ductWaf.locationId;
    delete ductWaf.userId;
    delete ductWaf.addDate;
    delete ductWaf.updateDate;
    delete ductWaf.active;
  });
}

async function component(components: ComponentDTO[]) {
  const promises = [];

  components?.forEach(component => {
    promises.push(analyzerRange(component.analyzerRangeData));
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
    delete analyzerRange.active;
  });
}

async function monitorQualification(qualifications: MonitorQualificationDTO[]) {
  const promises = [];
  qualifications?.forEach(qualification => {
    promises.push(
      qualificationPCT(qualification.monitoringQualificationPercentData),
    );
    promises.push(
      qualificationLME(qualification.monitoringQualificationLMEData),
    );
    promises.push(
      qualificationLEE(qualification.monitoringQualificationLEEData),
    );
    promises.push(
      qualificationCPMS(qualification.monitoringQualificationCPMSData),
    );

    delete qualification.id;
    delete qualification.locationId;
    delete qualification.userId;
    delete qualification.addDate;
    delete qualification.updateDate;
    delete qualification.active;
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

async function qualificationCPMS(qualificationCPMS: CPMSQualificationDTO[]) {
  qualificationCPMS.forEach(cpms => {
    delete cpms.id;
    delete cpms.qualificationId;
    delete cpms.userId;
    delete cpms.addDate;
    delete cpms.updateDate;
  })
}

async function monitorSystem(systems: MonitorSystemDTO[]) {
  const promises = [];
  systems?.forEach(system => {
    promises.push(monitorSystemFuel(system.monitoringSystemFuelFlowData));
    promises.push(monitorSystemComponent(system.monitoringSystemComponentData));
    delete system.id;
    delete system.locationId;
    delete system.userId;
    delete system.addDate;
    delete system.updateDate;
    delete system.active;
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
    delete fuel.active;
  });
}

async function monitorSystemComponent(systemComponents: SystemComponentDTO[]) {
  systemComponents?.forEach(component => {
    delete component.id;
    delete component.locationId;
    delete component.monitoringSystemRecordId;
    delete component.componentId;
    delete component.userId;
    delete component.addDate;
    delete component.updateDate;
    delete component.active;
  });
}

async function monitoringLocation(monitorLocations: MonitorLocationDTO[]) {
  monitorLocations?.forEach(location => {
    delete location.unitRecordId;
    delete location.stackPipeRecordId;
    delete location.stackPipeId;
    delete location.name;
    delete location.type;
    delete location.activeDate;
    delete location.retireDate;
    delete location.nonLoadBasedIndicator;
    delete location.id;
    delete location.active;

    unitCapacity(location.unitCapacityData);
  });
}

async function unitCapacity(unitCapacities: UnitCapacityDTO[]) {
  unitCapacities.forEach(capacity => {
    delete capacity.unitRecordId;
    delete capacity.commercialOperationDate;
    delete capacity.operationDate;
    delete capacity.boilerTurbineType;
    delete capacity.boilerTurbineBeginDate;
    delete capacity.boilerTurbineEndDate;
    delete capacity.id;
    delete capacity.userId;
    delete capacity.addDate;
    delete capacity.updateDate;
    delete capacity.active;
  })
}

async function unitControl(unitControls: UnitControlDTO[]) {
  unitControls.forEach(control => {
    delete control.unitRecordId;
    delete control.id;
    delete control.userId;
    delete control.addDate;
    delete control.updateDate;
    delete control.active;

  })
}

async function unitFuel(unitFuels: UnitFuelDTO[]) {
  unitFuels.forEach(fuel => {
    delete fuel.unitRecordId;
    delete fuel.actualOrProjectCode;
    delete fuel.sulfurContent;
    delete fuel.id;
    delete fuel.userId;
    delete fuel.addDate;
    delete fuel.updateDate;
    delete fuel.active;

  })
}

async function suppMatsMonitorMethod(matsMethods: MatsMethodDTO[]) {
  matsMethods.forEach(method => {
    delete method.id;
    delete method.locationId;
    delete method.userId;
    delete method.addDate;
    delete method.updateDate;
    delete method.active;
  })
}
