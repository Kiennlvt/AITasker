import { useEffect, useState } from "react";

function formatRemaining(ms) {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (days > 0 || hours > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  return parts.join(" ");
}

/** Live "time remaining until <deadline>" label, ticking once a minute. */
export default function MilestoneCountdown({ deadline, className = "" }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  if (!deadline) return null;
  const remaining = new Date(deadline).getTime() - now;

  if (remaining <= 0) {
    return <span className={className}>awaiting next automatic check</span>;
  }
  return <span className={className}>{formatRemaining(remaining)} remaining</span>;
}
