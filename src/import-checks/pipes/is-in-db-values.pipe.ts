import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { DataSource } from 'typeorm';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsInDbValuesConstraint implements ValidatorConstraintInterface {
  constructor(private readonly connection: DataSource) {}

  validate(sql: string, args: ValidationArguments) {
    return this.connection.query(args.constraints[0]).then(data => {
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
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [sql],
      validator: IsInDbValuesConstraint,
    });
  };
}
