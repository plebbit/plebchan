import en from 'javascript-time-ago/locale/en'
import TimeAgo from 'javascript-time-ago'

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

const getFormattedTime = (timestamp) => {
  try {
    return timeAgo.format(timestamp * 1000)
  }
  catch (e) {}
};

export default getFormattedTime;