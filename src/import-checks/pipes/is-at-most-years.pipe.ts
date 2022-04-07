import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsAtMostYears(
  minYear: number,
  maxYear: number,
  validationOptions?: ValidationOptions,
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsAtMostYears',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value) {
            if (typeof value === 'number') {
              if (value < 0) {
                return false;
              }

              if (value >= minYear && value <= maxYear) {
                return true;
              }
            }
          }
          return false;
        },
      },
    });
  };
}
