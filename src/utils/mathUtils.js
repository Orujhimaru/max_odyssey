/**
 * Formats LaTeX expressions for proper rendering with KaTeX
 */
export const formatMathExpression = (text) => {
  if (!text) return text;

  return (
    text
      // Fix common LaTeX formatting issues
      .replace(/\\frac{([^}]+)}{([^}]+)}/g, "\\frac{$1}{$2}")
      .replace(/xOver/g, "\\frac{x}{")
      .replace(/Over/g, "}{")
      .replace(/=/g, "=")

      // Fix delimiter issues
      .replace(/\$\(([^)]+)\$\)/g, "$$$1$$")

      // Replace text with symbols
      .replace(/greaterthan/g, ">")
      .replace(/lessthan/g, "<")
      .replace(/dollarsign/g, "\\$")
  );
};
