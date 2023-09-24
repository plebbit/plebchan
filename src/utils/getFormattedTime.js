const pluralize = (unit, value) => {
  return `${value} ${unit}${value > 1 ? 's' : ''}`;
};

const getFormattedTime = (timestamp) => {
  try {
    const currentTime = new Date().getTime();
    const differenceInMilliseconds = currentTime - timestamp * 1000;

    const years = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor((differenceInMilliseconds % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((differenceInMilliseconds % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((differenceInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((differenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((differenceInMilliseconds % (1000 * 60)) / 1000);

    if (years > 0) {
      return months > 0 ? `${pluralize('year', years)} and ${pluralize('month', months)} ago` : `${pluralize('year', years)} ago`;
    } else if (months > 0) {
      return days > 0 ? `${pluralize('month', months)} and ${pluralize('day', days)} ago` : `${pluralize('month', months)} ago`;
    } else if (days > 0) {
      if (hours > 0) {
        return `${pluralize('day', days)} and ${pluralize('hour', hours)} ago`;
      } else if (minutes > 0) {
        return `${pluralize('day', days)} and ${pluralize('minute', minutes)} ago`;
      } else {
        return `${pluralize('day', days)} ago`;
      }
    } else if (hours > 0) {
      return minutes > 0 ? `${pluralize('hour', hours)} and ${pluralize('minute', minutes)} ago` : `${pluralize('hour', hours)} ago`;
    } else if (minutes > 0) {
      return seconds > 0 ? `${pluralize('minute', minutes)} and ${pluralize('second', seconds)} ago` : `${pluralize('minute', minutes)} ago`;
    } else if (seconds > 30) {
      return `${pluralize('second', seconds)} ago`;
    } else {
      return 'just now';
    }
  } catch (e) {
    console.error('Error in getFormattedTime:', e);
    return '[error]';
  }
};

export default getFormattedTime;
