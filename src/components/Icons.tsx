import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export function DumbbellIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6.5 6.5v11M3.5 9v5M17.5 6.5v11M20.5 9v5M6.5 12h11" />
    </svg>
  );
}

export function RunIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="14.5" cy="4.5" r="1.9" />
      <path d="M12.7 9 9 11.4l1.9 3.1L9.4 20M12.7 9l3.4 1.4 1.1 3.3 2.6.6M12.7 9 9.3 8 6.6 10.2M10.9 14.5l-3.3.7-2.9 3" />
    </svg>
  );
}

export function TableIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="4.5" width="18" height="15" rx="2.2" />
      <path d="M3 9.6h18M9.2 9.6V19.5M3 14.6h18" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  );
}

export function CrossIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m14.5 5-7 7 7 7" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m9.5 5 7 7-7 7" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 12h15M13 5.5l6.5 6.5-6.5 6.5" />
    </svg>
  );
}

export function TrophyIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 5.5H4.5v1.2A3.3 3.3 0 0 0 7.8 10M17 5.5h2.5v1.2A3.3 3.3 0 0 1 16.2 10" />
      <path d="M12 14v3.5M8.5 20.5h7l-.8-3h-5.4l-.8 3Z" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.4" />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
    </svg>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14.5 8.5V6a1.8 1.8 0 0 0-1.8-1.8H6.3A1.8 1.8 0 0 0 4.5 6v12a1.8 1.8 0 0 0 1.8 1.8h6.4a1.8 1.8 0 0 0 1.8-1.8v-2.5" />
      <path d="M9.5 12h10M16.5 8.5 20 12l-3.5 3.5" />
    </svg>
  );
}

export function SpinnerIcon(props: IconProps) {
  return (
    <svg {...base(props)} className={`animate-spin ${props.className ?? ""}`}>
      <path d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5" />
    </svg>
  );
}

/** Filled four-point sparkle — used for the completion celebration. */
export function SparkleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 0c1 8.2 3.8 11 12 12-8.2 1-11 3.8-12 12-1-8.2-3.8-11-12-12C8.2 11 11 8.2 12 0Z" />
    </svg>
  );
}
