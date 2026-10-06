import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { BaseEntity, PrimaryColumn, Column, Entity } from 'typeorm';

@Entity({ name: 'camdecmpswks.vw_mp_locations_and_unit_stack_configurations' })
export class VwMPLocationsAndUnitStackConfigurations extends BaseEntity {
    @PrimaryColumn({
      type: 'varchar',
      length: 45,
      name: 'mon_plan_id', 
    })
    id: string;
    
    @Column({
      type: 'numeric',
      name: 'oris_code', 
    })
    orisCode: number;
    
    @Column({
      type: 'numeric',
      precision: 38,
      scale: 0,
      name: 'fac_id', 
      transformer: new NumericColumnTransformer(),
    })
    facId: number;
    
    @Column({
      type: 'varchar',
      name: 'facility_name', 
    })
    facilityName: string;
    
    @Column({
      type: 'varchar',
      name: 'frs_id', 
    })
    facilityRegistrySystemId: string;
    
    @Column({
      type: 'varchar',
      length: 7,
      name: 'config_type_cd', 
    })
    configTypeCode: string;
    
    @Column({
      type: 'timestamp',
      name: 'last_updated', 
    })
    lastUpdated: Date;
    
    @Column({
      type: 'varchar',
      length: 1,
      name: 'updated_status_flg', 
    })
    updatedStatusFlag: string;
    
    @Column({
      type: 'varchar',
      length: 1,
      name: 'needs_eval_flg', 
    })
    needsEvalFlag: string;
    
    @Column({
      type: 'varchar',
      length: 45,
      name: 'chk_session_id', 
    })
    checkSessionId: string;
    
    @Column({
      type: 'text',
      name: 'locations', 
    })
    name: string;

    @Column({
      type: 'varchar',
      length: 25,
      name: 'userid', 
    })
    userId: string;
    
    @Column({
      type: 'timestamp', 
      nullable: false,
      name: 'add_date', 
    })
    addDate: Date;
    
    @Column({
      type: 'timestamp',
      name: 'update_date', 
    })
    updateDate: Date;

    @Column({
      type: 'numeric',
      precision: 38,
      scale: 0,
      name: 'submission_id', 
      transformer: new NumericColumnTransformer(),
    })
    submissionId: number;

    @Column({
      type: 'varchar',
      length: 7,
      name: 'submission_availability_cd', 
    })
    submissionAvailabilityCode: string;

    @Column({
      type: 'varchar',
      length: 7,
      name: 'pending_status_cd', 
    })
    pendingStatusCode: string;

    @Column({
      type: 'numeric',
      precision: 38,
      scale: 0,
      name: 'begin_rpt_period_id', 
      transformer: new NumericColumnTransformer(),
    })
    beginReportPeriodId: number;
    
    @Column({
      type: 'varchar',
      name: 'begin_period_abbreviation', 
    })
    beginReportPeriodDescription: string;
    
    @Column({
      type: 'numeric',
      precision: 38,
      scale: 0,
      name: 'end_rpt_period_id', 
      transformer: new NumericColumnTransformer(),
    })
    endReportPeriodId: number;

    @Column({
      type: 'varchar',
      name: 'end_period_abbreviation', 
    })
    endReportPeriodDescription: string;

    @Column({
      type: 'timestamp',
      name: 'last_evaluated_date', 
    })
    lastEvaluatedDate: Date;

    @Column({
      type: 'varchar',
      length: 7,
      name: 'eval_status_cd', 
    })
    evalStatusCode: string;
    
    @Column({
      type: 'varchar',
      name: 'eval_status_cd_description', 
    })
    evalStatusCodeDescription: string;
    
    @Column({
      type: 'varchar',
      name: 'sub_avail_cd_description', 
    })
    submissionAvailabilityCodeDescription: string;
    
    @Column({
      type: 'varchar',
      name: 'severity_cd_description', 
    })
    severityCode: string;
    
    @Column({
      type: 'varchar',
      name: 'severity_cd', 
    })
    severityDescription: string;
    
}
