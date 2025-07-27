import { type HeadlineConfig, getHeadlineColorClass } from "~/lib/config";

interface HeadlineProps {
  config: HeadlineConfig;
  className?: string;
}

export function Headline({ config, className }: HeadlineProps) {
  return (
    <>
      {config.parts.map((part, idx) => {
        const colorClass = getHeadlineColorClass(part.color);
        const fontClass = part.italic ? "font-playfair italic" : "";
        const weightClass = part.bold ? "font-bold" : "";
        
        return (
          <span key={idx} className={`${fontClass} ${weightClass} ${colorClass}`.trim()}>
            {part.text}
          </span>
        );
      })}
    </>
  );
}