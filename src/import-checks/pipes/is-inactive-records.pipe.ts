import { applyDecorators } from '@nestjs/common';
import { ValidateIf } from 'class-validator';
import { isInactiveRecord } from '../../utilities/is-inactive-record';

interface ActiveRecord {
  fieldname: string;
  beginDate?: string;
  endDate?: string;
  conditions?: object;
}

const conditionValidator = (o: any, conditions: object) => {
  if (conditions) {
    const set = new Set();
    for (const [key, value] of Object.entries(conditions)) {
      if (value === true) {
        set.add(o[key] !== null);
      }
      set.add(o[key] === value);
    }
    return set.has(true);
  }
  return false;
};

export function IsActiveRecord(params: ActiveRecord) {
  const { fieldname, beginDate, endDate, conditions } = params;
  const beginDateKey = beginDate || 'beginDate';
  const endDateKey = endDate || 'endDate';

  return applyDecorators(
    ValidateIf(
      o =>
        (o[fieldname] && !isInactiveRecord(o[beginDateKey], o[endDateKey])) ||
        conditionValidator(o, conditions),
    ),
  );
}
