const moment = require('moment');

export const MAXIMUM_FUTURE_DATE = moment()
  .add(30, 'days')
  .format('YYYY-MM-DD');
export const MINIMUM_DATE = '1993-01-01';
export const MIN_HOUR = 0;
export const MAX_HOUR = 23;
export const DATE_FORMAT = 'YYYY-MM-DD';
