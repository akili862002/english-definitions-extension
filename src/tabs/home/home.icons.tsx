import { SVGProps } from "react";

export const SettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    className="size-5"
  >
    <path
      fill="currentColor"
      d="M9.954 2.21a9.99 9.99 0 0 1 4.091-.002A3.993 3.993 0 0 0 16 5.07a3.992 3.992 0 0 0 3.457.261A9.99 9.99 0 0 1 21.5 8.876 3.992 3.992 0 0 0 20 12a3.99 3.99 0 0 0 1.502 3.124 10.041 10.041 0 0 1-2.046 3.543 3.993 3.993 0 0 0-3.456.261 3.992 3.992 0 0 0-1.954 2.86 9.99 9.99 0 0 1-4.091.004A3.993 3.993 0 0 0 8 18.927a3.992 3.992 0 0 0-3.457-.26A9.99 9.99 0 0 1 2.5 15.121 3.992 3.992 0 0 0 4 12a3.992 3.992 0 0 0-1.502-3.124 10.043 10.043 0 0 1 2.046-3.543A3.993 3.993 0 0 0 8 5.072a3.993 3.993 0 0 0 1.954-2.86zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
    />
  </svg>
);

export const MagicIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      d="m10 19l-2.5-5.5L2 11l5.5-2.5L10 3l2.5 5.5L18 11l-5.5 2.5L10 19Zm8 2l-1.25-2.75L14 17l2.75-1.25L18 13l1.25 2.75L22 17l-2.75 1.25L18 21Z"
    />
  </svg>
);

export const LoadingIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle cx="4" cy="12" r="3" fill="currentColor">
      <animate
        id="SVGKiXXedfO"
        attributeName="cy"
        begin="0;SVGgLulOGrw.end+0.25s"
        calcMode="spline"
        dur="0.6s"
        keySplines=".33,.66,.66,1;.33,0,.66,.33"
        values="12;6;12"
      />
    </circle>
    <circle cx="12" cy="12" r="3" fill="currentColor">
      <animate
        attributeName="cy"
        begin="SVGKiXXedfO.begin+0.1s"
        calcMode="spline"
        dur="0.6s"
        keySplines=".33,.66,.66,1;.33,0,.66,.33"
        values="12;6;12"
      />
    </circle>
    <circle cx="20" cy="12" r="3" fill="currentColor">
      <animate
        id="SVGgLulOGrw"
        attributeName="cy"
        begin="SVGKiXXedfO.begin+0.2s"
        calcMode="spline"
        dur="0.6s"
        keySplines=".33,.66,.66,1;.33,0,.66,.33"
        values="12;6;12"
      />
    </circle>
  </svg>
);
