import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 1 0-2.82l2.83-2.83a2 2 0 0 1 2.82 0Z" />
        <path d="m19 5 3-3" />
    </svg>
  ),
  cup: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 12h16" />
      <path d="M4 12a8 8 0 0 1 8-8 8 8 0 0 1 8 8" />
      <path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
    </svg>
  ),
  cheers: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
      viewBox="0 0 100 100"
      {...props}
    >
      <g className="glass-left">
        <path d="M 25,95 L 25,50" stroke="currentColor" strokeWidth="2" />
        <path d="M 15,95 L 35,95" stroke="currentColor" strokeWidth="2" />
        <path d="M 10,50 C 10,30 40,30 40,50 Z" stroke="currentColor" strokeWidth="2" fill="none" />
      </g>
      <g className="glass-right">
         <path d="M 75,95 L 75,50" stroke="currentColor" strokeWidth="2" />
         <path d="M 65,95 L 85,95" stroke="currentColor" strokeWidth="2" />
         <path d="M 60,50 C 60,30 90,30 90,50 Z" stroke="currentColor" strokeWidth="2" fill="none" />
      </g>
      <path
        className="spark"
        d="M50 35 L 52 30 L 54 35 L 60 37 L 54 39 L 52 44 L 50 39 L 44 37 Z"
        fill="hsl(var(--primary))"
      />
    </svg>
  ),
};
