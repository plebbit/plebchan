export function hashStringToColor(str: string): string {
  if (!str) {
    return '';
  }

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const r = (hash >> 24) & 0xff;
  const g = (hash >> 16) & 0xff;
  const b = (hash >> 8) & 0xff;

  return `rgb(${r}, ${g}, ${b})`;
}

export function getTextColorForBackground(rgb: string): string {
  const [r, g, b] = rgb.match(/\d+/g)?.map(Number) || [0, 0, 0];
  const brightness = r * 0.299 + g * 0.587 + b * 0.114;
  return brightness > 125 ? 'black' : 'white';
}

export const formatMarkdown = (content: string): string => {
  let md = content;
  if (md) {
    // Check if the content already contains valid Markdown patterns
    const alreadyFormattedPattern = /\n&nbsp;\n/;

    // help the user by formatting the content if it's not already formatted
    if (!alreadyFormattedPattern.test(md)) {
      // Replace single newline with "/n&nbsp;/n" if followed by a newline
      md = md.replace(/\n(?=\n)/g, '\n&nbsp;\n');
      // Replace single newline with double newline if between two characters
      md = md.replace(/\n(?=\S)/g, '\n\n');
    }
  }
  return md;
};
