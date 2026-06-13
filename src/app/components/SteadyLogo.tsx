interface Props {
  size?: number;
  className?: string;
}

export function SteadyLogo({ size = 28, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Left leaf */}
      <path
        d="M15 17 C15 17 9 15 6 8 C6 8 11 5 15 11 L15 17Z"
        fill="var(--primary)"
      />
      {/* Right leaf */}
      <path
        d="M15 17 C15 17 21 15 24 8 C24 8 19 5 15 11 L15 17Z"
        fill="var(--primary)"
        opacity="0.55"
      />
      {/* Stem */}
      <path
        d="M15 17 L15 27"
        stroke="var(--primary)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Small soil arc */}
      <path
        d="M11 27 Q15 25.5 19 27"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}
