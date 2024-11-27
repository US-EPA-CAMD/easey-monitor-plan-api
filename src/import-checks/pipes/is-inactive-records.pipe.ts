import { applyDecorators } from '@nestjs/common';
import { ValidateIf } from 'class-validator';
import { isInactiveRecord } from '../../utilities/is-inactive-record';

interface ActiveRecord {
  fieldname: string;
  beginDate?: string;
  endDate?: string;
}

export function IsActiveRecord(params: ActiveRecord) {
  const { fieldname, beginDate, endDate } = params;
  const beginDateKey = beginDate || 'beginDate';
  const endDateKey = endDate || 'endDate';

  return applyDecorators(
    ValidateIf(
      o =>
        (o[fieldname] && !isInactiveRecord(o[beginDateKey], o[endDateKey]))
    ),
  );
}
