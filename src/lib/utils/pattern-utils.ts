import { Comment } from '@plebbit/plebbit-react-hooks';

/**
 * Checks if a text matches a pattern according to various pattern matching rules:
 * - Whole word matching: 'feel' matches 'feel' but not 'feeling'
 * - AND operator: 'feel girlfriend' matches both words in any order
 * - OR operator: 'feel|girlfriend' matches either word
 * - Mixed operators: 'girlfriend|boyfriend feel' matches complex logic
 * - Exact match: "that feel when" matches the exact phrase
 * - Wildcards: 'feel*' matches 'feel', 'feels', 'feeling', etc.
 * - Regex: /pattern/flags for regular expressions
 *
 * @param text The text to check against the pattern
 * @param pattern The pattern to match
 * @returns True if the text matches the pattern, false otherwise
 */
export const matchesPattern = (text: string, pattern: string): boolean => {
  if (!pattern || !text) return false;

  const textLower = text.toLowerCase();

  try {
    // Check if it's a regex pattern (starts and ends with /)
    if (pattern.startsWith('/') && pattern.length > 2 && /\/[gimsuy]*$/.test(pattern)) {
      const lastSlashIndex = pattern.lastIndexOf('/');
      const regexPattern = pattern.substring(1, lastSlashIndex);
      const flags = pattern.substring(lastSlashIndex + 1);
      const regex = new RegExp(regexPattern, flags);
      return regex.test(textLower);
    }
    // Check if it's an exact match pattern (surrounded by quotes)
    else if (pattern.startsWith('"') && pattern.endsWith('"') && pattern.length > 2) {
      const exactPattern = pattern.substring(1, pattern.length - 1).toLowerCase();
      return textLower.includes(exactPattern);
    }
    // Check for OR patterns (contains |)
    else if (pattern.includes('|')) {
      const orGroups = pattern.split(' ').filter(Boolean);

      // Process each group (which might contain OR operators)
      return orGroups.every((group) => {
        const orTerms = group.split('|').map((term) => term.toLowerCase());
        return orTerms.some((term) => {
          // Handle wildcards in OR terms
          if (term.includes('*')) {
            const regexPattern = term.replace(/\*/g, '.*').toLowerCase();
            const regex = new RegExp(`\\b${regexPattern}\\b`, 'i');
            return regex.test(textLower);
          } else {
            // Match whole word only
            const regex = new RegExp(`\\b${term}\\b`, 'i');
            return regex.test(textLower);
          }
        });
      });
    }
    // Check for AND patterns (space-separated words)
    else if (pattern.includes(' ')) {
      const andTerms = pattern
        .split(' ')
        .filter(Boolean)
        .map((term) => term.toLowerCase());
      return andTerms.every((term) => {
        // Handle wildcards in AND terms
        if (term.includes('*')) {
          const regexPattern = term.replace(/\*/g, '.*').toLowerCase();
          const regex = new RegExp(`\\b${regexPattern}\\b`, 'i');
          return regex.test(textLower);
        } else {
          // Match whole word only
          const regex = new RegExp(`\\b${term}\\b`, 'i');
          return regex.test(textLower);
        }
      });
    }
    // Handle wildcard patterns
    else if (pattern.includes('*')) {
      const regexPattern = pattern.replace(/\*/g, '.*').toLowerCase();
      const regex = new RegExp(`\\b${regexPattern}\\b`, 'i');
      return regex.test(textLower);
    }
    // Simple whole word match
    else {
      const regex = new RegExp(`\\b${pattern.toLowerCase()}\\b`, 'i');
      return regex.test(textLower);
    }
  } catch (error) {
    // If regex parsing fails, fall back to simple includes
    console.error('Pattern matching error:', error);
    const simplifiedPattern = pattern.toLowerCase();
    return textLower.includes(simplifiedPattern);
  }
};

/**
 * Checks if a comment matches a pattern in its title or content
 *
 * @param comment The comment to check
 * @param pattern The pattern to match
 * @returns True if the comment matches the pattern, false otherwise
 */
export const commentMatchesPattern = (comment: Comment, pattern: string): boolean => {
  if (!pattern || !comment) return false;

  const titleLower = comment?.title?.toLowerCase() || '';
  const contentLower = comment?.content?.toLowerCase() || '';
  const textToMatch = titleLower + ' ' + contentLower;

  return matchesPattern(textToMatch, pattern);
};
