import { registerDecorator, ValidationOptions } from 'class-validator';
import { IfIsActiveValidator } from '../../utilities/if-is-active.validator';

export function IfIsActive(
  validateFunction: (value: unknown) => boolean,
  isInactiveOtions: unknown,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IfIsActive",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [{ validateFunction, isInactiveOtions }],
      validator: IfIsActiveValidator,
    });
  };
}

