import { Task, ViewMode } from '../types/public-types';

type DateHelperScales =
  | 'year'
  | 'month'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond';

export const addToDate = (
  date: Date,
  quantity: number,
  scale: DateHelperScales
) => {
  let newDate = new Date(
    date.getFullYear() + (scale === 'year' ? quantity : 0),
    date.getMonth() + (scale === 'month' ? quantity : 0),
    date.getDate() + (scale === 'day' ? quantity : 0),
    date.getHours() + (scale === 'hour' ? quantity : 0),
    date.getMinutes() + (scale === 'minute' ? quantity : 0),
    date.getSeconds() + (scale === 'second' ? quantity : 0),
    date.getMilliseconds() + (scale === 'millisecond' ? quantity : 0)
  );
  return newDate;
};

export const startOfDate = (date: Date, scale: DateHelperScales) => {
  const scores = [
    'millisecond',
    'second',
    'minute',
    'hour',
    'day',
    'month',
    'year',
  ];

  const shouldReset = (_scale: DateHelperScales) => {
    const max_score = scores.indexOf(scale);
    return scores.indexOf(_scale) <= max_score;
  };
  let newDate = new Date(
    date.getFullYear(),
    shouldReset('year') ? 0 : date.getMonth(),
    shouldReset('month') ? 1 : date.getDate(),
    shouldReset('day') ? 0 : date.getHours(),
    shouldReset('hour') ? 0 : date.getMinutes(),
    shouldReset('minute') ? 0 : date.getSeconds(),
    shouldReset('second') ? 0 : date.getMilliseconds()
  );
  return newDate;
};

export const ganttDateRange = (tasks: Task[], viewMode: ViewMode) => {
  let newStartDate: Date = tasks[0].start;
  let newEndDate: Date = tasks[0].end;
  for (let task of tasks) {
    if (task.start < newStartDate) {
      newStartDate = task.start;
    }
    if (task.end > newEndDate) {
      newEndDate = task.end;
    }
  }

  if (viewMode === ViewMode.Month) {
    newStartDate = addToDate(newStartDate, -1, 'month');
    newEndDate = addToDate(newEndDate, 1, 'year');
    newEndDate = startOfDate(newEndDate, 'year');
  } else if (viewMode === ViewMode.Week) {
    newStartDate = startOfDate(newStartDate, 'day');
    newEndDate = startOfDate(newEndDate, 'day');

    newStartDate = addToDate(getMonday(newStartDate), -7, 'day');
    newEndDate = addToDate(newEndDate, 1.5, 'month');
  } else {
    newStartDate = startOfDate(newStartDate, 'day');
    newEndDate = startOfDate(newEndDate, 'day');
    newStartDate = addToDate(newStartDate, -1, 'day');
    newEndDate = addToDate(newEndDate, 19, 'day');
  }
  return [newStartDate, newEndDate];
};

export const seedDates = (
  startDate: Date,
  endDate: Date,
  viewMode: ViewMode
) => {
  let currentDate: Date = new Date(startDate);
  let dates: Date[] = [currentDate];
  while (currentDate < endDate) {
    if (viewMode === ViewMode.Month) {
      currentDate = addToDate(currentDate, 1, 'month');
    } else if (viewMode === ViewMode.Week) {
      currentDate = addToDate(currentDate, 7, 'day');
    } else if (viewMode === ViewMode.Day) {
      currentDate = addToDate(currentDate, 1, 'day');
    } else if (viewMode === ViewMode.HalfDay) {
      currentDate = addToDate(currentDate, 12, 'hour');
    } else if (viewMode === ViewMode.QuarterDay) {
      currentDate = addToDate(currentDate, 6, 'hour');
    }
    dates.push(currentDate);
  }
  return dates;
};

export const getLocaleMonth = (date: Date, locale: string) => {
  let bottomValue = new Intl.DateTimeFormat(locale, {
    month: 'long',
  }).format(date);
  bottomValue = bottomValue.replace(
    bottomValue[0],
    bottomValue[0].toLocaleUpperCase()
  );
  return bottomValue;
};

/**
 * Returns monday of current week
 * @param date date for modify
 */
const getMonday = (date: Date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(date.setDate(diff));
};

export const getWeekNumberISO8601 = (date: Date) => {
  let tmpDate = new Date(date.valueOf());
  const dayNumber = (tmpDate.getDay() + 6) % 7;
  tmpDate.setDate(tmpDate.getDate() - dayNumber + 3);
  const firstThursday = tmpDate.valueOf();
  tmpDate.setMonth(0, 1);
  if (tmpDate.getDay() !== 4) {
    tmpDate.setMonth(0, 1 + ((4 - tmpDate.getDay() + 7) % 7));
  }
  const weekNumber = (
    1 + Math.ceil((firstThursday - tmpDate.valueOf()) / 604800000)
  ).toString();

  if (weekNumber.length === 1) {
    return `0${weekNumber}`;
  } else {
    return weekNumber;
  }
};
