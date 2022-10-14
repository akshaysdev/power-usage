const moment = require('moment');

/**
 * It returns true if the date is valid, and false if it's not
 * @param date - The date to be validated.
 * @returns A boolean value
 */
const isValidDate = (date = undefined) => {
  const currentDate = new Date(date);
  return currentDate == 'Invalid Date' ? false : true;
};

/**
 * It compares two times and returns true if the from-time is less than the to-time
 * @param fromTime - The start date of the range.
 * @param toTime - The end date of the range.
 * @returns A boolean value.
 */
const compareTime = (fromTime, toTime) => {
  const startDate = new Date(fromTime);
  const endDate = new Date(toTime);
  return startDate < endDate;
};

/**
 * It takes an array of objects and returns an object with the same keys as the array, but with the
 * values grouped by the day
 * @param array - The array of objects that you want to group.
 * @returns object grouped by day wise data
 */
const groupByDayWisePowerConsumed = (array) => {
  const group = {};

  array.forEach((data) => {
    const startOfDay = moment(data.fromTime).utc().startOf('day');

    if (!group[startOfDay]) {
      group[startOfDay] = { unitConsumed: 0, duration: 0 };
    }
    group[startOfDay].unitConsumed += data.unitConsumed;
    group[startOfDay].duration += data.duration;
  });

  return group;
};

module.exports = { isValidDate, compareTime, groupByDayWisePowerConsumed };
