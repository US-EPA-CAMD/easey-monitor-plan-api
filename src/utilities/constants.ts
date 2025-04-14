import moment from 'moment';

export const getMaximumFutureDate = (): string =>
  moment().add(90, 'days').format('YYYY-MM-DD');
export const MAXIMUM_FUTURE_DATE = getMaximumFutureDate();
export const MINIMUM_DATE = '1993-01-01';
export const MIN_HOUR = 0;
export const MAX_HOUR = 23;
export const DATE_FORMAT = 'YYYY-MM-DD';
