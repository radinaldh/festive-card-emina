import { FC } from "react";

interface IChoose {
  width?: any;
  height?: any;
  color?: string;
  className?: string;
}

const Choose: FC<IChoose> = ({ width, height, color, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      version="1.1"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
    >
      <g fill="#FFDBCC">
        <path d="M111.31 310.777v50.306l55.895 22.358-22.358-106.201c-18.523 0-33.537 15.016-33.537 33.537zM346.069 260.472v50.306h44.716l-11.179-83.843c-18.522-.001-33.537 15.015-33.537 33.537z"></path>
      </g>
      <path
        fill="#FFC1A6"
        d="M413.144 260.472c0-18.521-15.015-33.537-33.537-33.537v83.843l33.537-33.537v-16.769z"
      ></path>
      <path
        fill="#FFDBCC"
        d="M245.458 193.397c-18.523 0-33.537 15.015-33.537 33.537l-22.358 83.843h111.79l-22.358-83.843c0-18.522-15.016-33.537-33.537-33.537z"
      ></path>
      <g fill="#FEA680">
        <path d="M312.532 210.166c-18.523 0-33.537 15.016-33.537 33.537v67.074h67.074v-67.074c0-18.521-15.015-33.537-33.537-33.537zM178.384 75.459c-18.523 0-33.537 15.015-33.537 33.537v201.782h67.074V108.996c0-18.523-15.016-33.537-33.537-33.537zM381.842 277.24L262.227 512c83.349 0 150.917-67.568 150.917-150.917V277.24h-31.302z"></path>
      </g>
      <path
        fill="#FFC1A6"
        d="M144.847 277.24v83.843H111.31c0 83.35 67.568 150.917 150.917 150.917 64.827 0 117.38-67.567 117.38-150.917V277.24h-234.76z"
      ></path>
      <g fill="#42C8C6">
        <path d="M178.384 50.306A8.384 8.384 0 01170 41.922V8.384C170 3.753 173.753 0 178.384 0s8.384 3.753 8.384 8.384v33.537a8.384 8.384 0 01-8.384 8.385zM130.956 74.249a8.356 8.356 0 01-5.928-2.455l-23.715-23.715a8.385 8.385 0 0111.856-11.858l23.714 23.715a8.386 8.386 0 01-5.927 14.313zM225.812 74.249a8.386 8.386 0 01-5.928-14.313l23.714-23.716a8.385 8.385 0 0111.856 11.858L231.74 71.793a8.351 8.351 0 01-5.928 2.456z"></path>
      </g>
    </svg>
  );
};

export default Choose;
