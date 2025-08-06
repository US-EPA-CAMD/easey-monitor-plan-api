import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'IsValidDateWithinLastYear', async: false })
@Injectable()
export class IsValidDateWithinLastYearConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {

    const inputDate = new Date(value);
    
    // Security: Reject any potentially malicious patterns
    // Strict ISO date format (YYYY-MM-DD)
    if (typeof value !== 'string' || /[;&|$`<>]/.test(value) || !/^\d{4}-\d{2}-\d{2}$/.test(value) || isNaN(inputDate.getTime())) {
      args.constraints[0] = args.constraints[0] = `${args.property} must be in YYYY-MM-DD format`;
      return false;
    }

    // Explicit 1-year range check
    const currentDate = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

    if (inputDate > currentDate) {
      args.constraints[0] = `${args.property} cannot be in the future`;
      return false;
    }

    if (inputDate < oneYearAgo) {
      args.constraints[0] = `${args.property} must be within the last year`;
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return args.constraints[0] || `Ensure ${args.property} is a valid date format of YYYY-MM-DD and within the last year`;
  }
}

export function IsValidDateWithinLastYear(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidDateWithinLastYear',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidDateWithinLastYearConstraint,
    });
  };
}