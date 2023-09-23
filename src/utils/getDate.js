const getDate = (commentTimestamp) => {
  if (commentTimestamp === undefined || isNaN(commentTimestamp)) {
    return '';
  }
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  const string = new Intl.DateTimeFormat(locale, {
    hour12: false,
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(commentTimestamp * 1000));
  if (locale.startsWith('ar')) {
    return string;
  }
  const items = string.split(/,* /);
  if (items.length === 3) {
    const itemIsNumber = [items[0][0].match(/[0-9]/), items[1][0].match(/[0-9]/)];
    if (itemIsNumber[0] && itemIsNumber[1]) {
      return `${items[0]}(${items[2]})${items[1]}`;
    }
    if (itemIsNumber[0] && !itemIsNumber[1]) {
      return `${items[0]}(${items[1]})${items[2]}`;
    }
    if (!itemIsNumber[0] && itemIsNumber[1]) {
      return `${items[1]}(${items[0]})${items[2]}`;
    }
  }
  return string;
};

export default getDate;
