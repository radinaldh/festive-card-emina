"use client";

interface IEllipse {
  width?: any;
  height?: any;
  color?: string;
  className?: string;
}

export default function EllipseRevert({
  width,
  height,
  color,
  className,
}: IEllipse) {
  return (
    <svg
      width="353"
      height="487"
      viewBox="0 0 353 487"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="106"
        cy="246.287"
        r="246"
        transform="rotate(-165 106 246.287)"
        fill="url(#paint0_linear_180_1068)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_180_1068"
          x1="749"
          y1="640.787"
          x2="84"
          y2="476.287"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
