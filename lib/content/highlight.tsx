/** Gradient-highlights the last word of a plain-text heading so CMS-edited titles keep the brand's gradient accent. */
export function highlightLastWord(text: string) {
  const words = text.trim().split(/\s+/);
  if (words.length < 2) return text;
  const last = words.pop();
  return (
    <>
      {words.join(" ")} <span className="text-gradient">{last}</span>
    </>
  );
}
