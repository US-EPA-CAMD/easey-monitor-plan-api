import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

import { isInactiveRecord } from './is-inactive-record';

@Injectable()
@ValidatorConstraint({ name: 'IfIsAtive' })
export class IfIsAtiveValidator implements ValidatorConstraintInterface {
    constructor() { }

    async validate(value: any, args: ValidationArguments) {
        const beginDate = args.object['beginDate'];
        const endDate = args.object['endDate'];
        const { validateFunction } = args.constraints[0];

        if (isInactiveRecord(beginDate, endDate)) {
            return true;
        } else {
            return validateFunction(value);
        }
    }
}
