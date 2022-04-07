import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsAtMostDigitsWithDecimals(
  maxNumber: number,
  validationOptions?: ValidationOptions,
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsAtMostDigitsWithDecimals',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value) {
            if (typeof value === 'number') {
              value = Math.abs(value);

              let strVersion: string = String(value);
              let len = strVersion.length;

              if (len > maxNumber) {
                return false;
              }

              if (strVersion.includes('.')) {
                let arrVersion = strVersion.split('.');
                if (
                  arrVersion[0].length < maxNumber - 1 &&
                  Number(arrVersion[0]) < 9999 &&
                  arrVersion[1].length === 1 &&
                  Number(arrVersion[1]) < 9
                ) {
                  return true;
                }
              } else if (len <= maxNumber - 1 && value < 9999) {
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
