import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsInDateRange(
  minDate: string | (() => string),
  maxDate: string | (() => string),
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string): void {
    registerDecorator({
      name: 'isInDateRange',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments): boolean {
          // Resolve min/max values if functions
          const min = typeof minDate === 'function' ? minDate() : minDate;
          const max = typeof maxDate === 'function' ? maxDate() : maxDate;

          // Parse to Date objects
          const minDateObj = min ? new Date(min) : null;
          const maxDateObj = max ? new Date(max) : null;
          const inputDate = value ? new Date(value) : null;

          // Allow empty/null values to pass
          if (!inputDate || isNaN(inputDate.getTime())) return true;

          const isAfterMin = !minDateObj || inputDate >= minDateObj;
          const isBeforeMax = !maxDateObj || inputDate <= maxDateObj;

          return isAfterMin && isBeforeMax;
        },
      },
    });
  };
}
