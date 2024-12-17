import { registerDecorator, ValidationOptions } from 'class-validator';
import { IfIsAtiveValidator } from '../../utilities/if-is-active.validator';

export function IfIsAtive(
  validateFunction: (value: unknown) => boolean,
  isInactiveOtions: unknown,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IfIsAtive",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [{ validateFunction, isInactiveOtions }],
      validator: IfIsAtiveValidator,
    });
  };
}

