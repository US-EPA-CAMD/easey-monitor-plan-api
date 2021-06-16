export class SystemFuelFlowDTO {
    id: string;
    monSysId: string;
    fuelCode: string;
    systemTypeCode: string;
    maxRate: number;
    maxRateSourceCode: string;
    sysFuelUomCode: string;
    beginDate: Date;
    endDate: Date;
    beginHour: number;
    endHour: number;
   }