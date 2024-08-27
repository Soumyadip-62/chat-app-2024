import React from "react";

const BackArrowIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="24"
      height="24"
      x="0"
      y="0"
      viewBox="0 0 20 20"
     
    >
      <g>
        <linearGradient
          id="a"
          x1="10"
          x2="10"
          y1="0"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stop-color="#ee9ae5"></stop>
          <stop offset="1" stop-color="#5961f9"></stop>
        </linearGradient>
        <path
          fill="url(#a)"
          fill-rule="evenodd"
          d="M0 10C0 4.486 4.486 0 10 0s10 4.486 10 10-4.486 10-10 10S0 15.514 0 10zm8.414-1 1.293-1.293a1 1 0 0 0-1.414-1.414l-3 3a.997.997 0 0 0 0 1.414l3 3a1 1 0 0 0 1.414-1.414L8.414 11H14a1 1 0 0 0 0-2z"
          clip-rule="evenodd"
          opacity="1"
          data-original="url(#a)"
         
        ></path>
      </g>
    </svg>
  );
};

export default BackArrowIcon;
