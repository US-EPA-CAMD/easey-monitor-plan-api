import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsAtMostDigits(
  maxNumber: number,
  validationOptions?: ValidationOptions,
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsAtMostDigits',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value) {
            if (typeof value === 'number') {
              value = Math.abs(value);

              let strVersion: string = value.toString();
              let len = strVersion.length;

              if ('.'.includes(strVersion)) {
                len--;
              }

              if (len > maxNumber) {
                return false;
              }
            }
          }
          return true;
        },
      },
    });
  };
}
