import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function matchesRegex(value: any, regex: string): boolean {
    if (value) {
      const RegValidator = new RegExp(regex);
      return RegValidator.test(value);
    }
    return true;
  }
  
  export function MatchesRegEx(
    regex: string,
    validationOptions?: ValidationOptions,
  ) {
    return function(object: Object, propertyName: string) {
      registerDecorator({
        name: 'MatchesRegEx',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            return matchesRegex(value, regex);
          },
        },
      });
    };
  }