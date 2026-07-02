// Lightweight renderer for the simple markdown subset produced by the
// job-posting AI flow (# / ## headings, **bold**, - / • bullets, 1. numbered
// lists, --- rules). Falls back gracefully for plain, non-markdown text.

function renderInline(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={`${keyPrefix}-${i}`} className="font-bold text-[#111331]">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={`${keyPrefix}-${i}`}>{part}</span>
    )
  );
}

export default function MarkdownText({ text, className = "" }) {
  if (!text) return null;

  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      i++;
      continue;
    }

    if (trimmed === "---" || trimmed === "***") {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      blocks.push({ type: `h${headingMatch[1].length}`, text: headingMatch[2] });
      i++;
      continue;
    }

    if (/^([-•])\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^([-•])\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^([-•])\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    const paragraphLines = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      lines[i].trim() !== "---" &&
      !/^(#{1,3})\s+/.test(lines[i].trim()) &&
      !/^([-•])\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim())
    ) {
      paragraphLines.push(lines[i].trim());
      i++;
    }
    blocks.push({ type: "p", text: paragraphLines.join(" ") });
  }

  const headingClass = { h1: "text-xl font-black", h2: "text-base font-black", h3: "text-sm font-black" };

  return (
    <div className={className}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "h1":
          case "h2":
          case "h3":
            return (
              <h4 key={idx} className={`${headingClass[block.type]} text-[#111331] mt-5 first:mt-0 mb-2`}>
                {renderInline(block.text, `h-${idx}`)}
              </h4>
            );
          case "hr":
            return <hr key={idx} className="my-5 border-slate-200" />;
          case "ul":
            return (
              <ul key={idx} className="space-y-2 my-2">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                    <span>{renderInline(item, `ul-${idx}-${j}`)}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={idx} className="space-y-2 my-2 list-decimal list-inside marker:text-orange-500 marker:font-bold">
                {block.items.map((item, j) => (
                  <li key={j}>{renderInline(item, `ol-${idx}-${j}`)}</li>
                ))}
              </ol>
            );
          default:
            return (
              <p key={idx} className="my-2">
                {renderInline(block.text, `p-${idx}`)}
              </p>
            );
        }
      })}
    </div>
  );
}
