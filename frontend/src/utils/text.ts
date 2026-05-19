/**
 * Calculates reading time in minutes based on text length.
 */
export const calculateReadingTime = (text?: string): string => {
  if (!text) return "1 min read";
  const wordsPerMinute = 200;
  const noOfWords = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(noOfWords / wordsPerMinute);
  return `${minutes} min read`;
};
