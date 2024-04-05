import { FC } from "react";

interface IWrite {
  width?: any;
  height?: any;
  color?: string;
  className?: string;
}

const Write: FC<IWrite> = ({ width, height, color, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 48 48"
    >
      <path
        fill="#e7e9e9"
        d="M33 48H4a4 4 0 01-4-4V20L13 9h20a4 4 0 014 4v31a4 4 0 01-4 4z"
      ></path>
      <path
        fill="#8DB9EA"
        d="M47.2 7.32L40.66.78a2.81 2.81 0 00-3.89 0l-18 18a2 2 0 000 2.8l7.62 7.63a2 2 0 001.4.58 2 2 0 001.4-.58l18-18a2.76 2.76 0 00.01-3.89z"
      ></path>
      <path
        fill="#ec5044"
        d="M36.12 2.31H40.37V17.15H36.12z"
        transform="rotate(-44.98 38.258 9.728)"
      ></path>
      <path
        fill="#edcabb"
        d="M29.26 26.4l-7.67-7.68a2 2 0 00-3.35 1.06L16.6 29.1a2 2 0 002.29 2.29l9.32-1.65a2 2 0 001.05-3.34z"
      ></path>
      <path
        fill="#4d4d4d"
        d="M20.56 30.14l-2.71-2.72a.57.57 0 00-.58-.14.58.58 0 00-.4.45l-.31 1.75a1.68 1.68 0 001.65 2h.29l1.75-.31a.58.58 0 00.31-1.03z"
      ></path>
      <path fill="#a1a3a4" d="M0 20h11a2 2 0 002-2V9z"></path>
    </svg>
  );
};

export default Write;
