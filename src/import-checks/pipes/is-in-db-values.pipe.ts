import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { isInactiveRecord } from '../../utilities/is-inactive-record';
import { DataSource } from 'typeorm';

interface ignoreOptions {
  ignoreEmptyIfInactive?: boolean;
}

@ValidatorConstraint({ async: true })
@Injectable()
export class IsInDbValuesConstraint implements ValidatorConstraintInterface {
  constructor(private readonly connection: DataSource) { }

  validate(sql: string, args: ValidationArguments) {
    const options = args.constraints[0].options;
    if (options && options.ignoreEmptyIfInactive) {
      const beginDate = args.object['beginDate'];
      const endDate = args.object['endDate'];

      if (!args.value && isInactiveRecord(beginDate, endDate)) {
        return true;
      }
    }

    return this.connection.query(args.constraints[0].sql).then(data => {
      let found = false;

      for (const entry of data) {
        if (entry.value === args.value) {
          found = true;
        }
      }

      return found;
    });
  }
}

export function IsInDbValues(
  sql: string,
  validationOptions?: ValidationOptions,
  options?: ignoreOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [{ sql, options }],
      validator: IsInDbValuesConstraint,
    });
  };
}
