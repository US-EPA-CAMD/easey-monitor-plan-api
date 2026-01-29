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

    // Security: Reject any potentially malicious patterns
    if (typeof value !== 'string' || /[;&|$`<>]/.test(value)) {
      args.constraints[0] = `${args.property} must be a valid date format`;
      return false;
    }

    const inputDate = new Date(value);

    // Validate that the date is parseable
    if (isNaN(inputDate.getTime())) {
      args.constraints[0] = `${args.property} must be a valid date format`;
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
    return args.constraints[0] || `Ensure ${args.property} is a valid date format and within the last year`;
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