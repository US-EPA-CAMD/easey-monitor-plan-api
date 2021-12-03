interface MPReportResults {
  unitStackInformation: string;
  severityCode: string;
  categoryCodeDescription: string;
  checkCode: string;
  resultMessage: string;
}

export class MPEvaluationReportDTO {
  facilityName: string;
  facilityId: number;
  state: string;
  county: string;
  mpReportResults: MPReportResults[];
}
