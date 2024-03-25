import { FC } from "react";

interface IEllipse {
  width?: any;
  height?: any;
  color?: string;
  className?: string;
}

const Ellipse: FC<IEllipse> = ({ width, height, color, className }) => {
  return (
    <svg
      width="365"
      height="388"
      viewBox="0 0 365 388"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="246" cy="142" r="246" fill="url(#paint0_linear_180_951)" />
      <defs>
        <linearGradient
          id="paint0_linear_180_951"
          x1="889"
          y1="536.5"
          x2="224"
          y2="372"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Ellipse;
