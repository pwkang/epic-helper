import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import updateLocale from 'dayjs/plugin/updateLocale';

// dayjs.extend(utc);
// dayjs.extend(updateLocale);

// dayjs.updateLocale('en', {
//   weekStart: 1,
// });

export const getStartOfToday = () => dayjs.utc().startOf('day').toDate();

export const getStartOfYesterday = () => dayjs.utc().startOf('day').subtract(1, 'day').toDate();

export const getStartOfThisWeek = () => dayjs.utc().startOf('week').toDate();

export const getStartOfLastWeek = () => dayjs.utc().startOf('week').subtract(1, 'week').toDate();

export const getDayOfWeek = () => (dayjs.utc().day() === 0 ? 7 : dayjs.utc().day());
