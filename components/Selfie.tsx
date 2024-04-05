import { FC } from "react";

interface ISelfie {
  width?: any;
  height?: any;
  color?: string;
  className?: string;
}

const Selfie: FC<ISelfie> = ({ width, height, color, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className="iconify iconify--twemoji"
      viewBox="0 0 36 36"
    >
      <path
        fill="#D5AB88"
        d="M28.384 6.753s-2.42-.003-2.697 1.999l-1.3 9.659c-.372 2.182 2.133 2.637 3.64 2.668 1.507.031 2.761-1.113 2.801-2.556l.104-3.046.153-4.488.045-1.449c0-1.208-.521-2.498-2.746-2.787z"
      ></path>
      <path
        fill="#B78B60"
        d="M30.146 10.439l-.159-.007a.867.867 0 00-.898.827l-.073 2.506 1.766.328.132-3.103a.867.867 0 00-.768-.551z"
      ></path>
      <path
        fill="#D5AB88"
        d="M29.25 21.906h-3.594l-.5-1.656h4.594zm-8.826-14.4s.144-.764 1.347-.68l-.332 1.051-1.015-.371z"
      ></path>
      <path
        fill="#6D6E71"
        d="M29 2.365C29 1.611 28.389 1 27.635 1h-4.27C22.611 1 22 1.611 22 2.365v15.27C22 18.389 24.611 19 25.365 19h2.27c.754 0 1.365-.611 1.365-1.365V2.365z"
      ></path>
      <path
        fill="#231F20"
        d="M28 2.365C28 1.611 27.389 1 26.635 1h-4.27C21.611 1 21 1.611 21 2.365v15.27c0 .754.611 1.365 1.365 1.365h4.27c.754 0 1.365-.611 1.365-1.365V2.365z"
      ></path>
      <path fill="#88C9F9" d="M22 3h5v13h-5z"></path>
      <path
        fill="#B78B60"
        d="M20.546 14.136l.131.745.537-.045.599-.042c.49-.035.884-.37 1.022-.812l-2.289.154zm0-2.391l.02.73.651-.007a1.331 1.331 0 001.172-.782l-1.843.059zm-.01-2.65l.011.717.223.031a1.33 1.33 0 001.242-.664l-1.476-.084zm9.868 2.763l-.144.067a.865.865 0 01-1.147-.416l-.763-1.631a.865.865 0 01.416-1.147l.144-.067a.865.865 0 011.147.416l.763 1.631a.865.865 0 01-.416 1.147z"
      ></path>
      <path
        fill="#D5AB88"
        d="M29.326 16.167l-.159-.007a.867.867 0 01-.827-.898l.162-3.936a.867.867 0 01.898-.827l.159.007c.474.02.846.424.827.898l-.162 3.936a.864.864 0 01-.898.827z"
      ></path>
      <path
        fill="#D5AB88"
        d="M29.885 11.915l-.144.067a.865.865 0 01-1.147-.416l-.764-1.631a.865.865 0 01.416-1.147l.144-.068a.865.865 0 011.147.416l.763 1.631a.865.865 0 01-.415 1.148zm.933 1.865c-.785-.332-1.639-.124-1.974.114-2.887 2.044-2.462 5.208-.448 5.645 1.63.353 2.182-.789 2.182-.789l.182-3.272.058-1.698zm-10.1-1.878l-.06.002a.329.329 0 01-.337-.319l-.041-1.477a.329.329 0 01.319-.337l.06-.002a.329.329 0 01.337.319l.041 1.477a.329.329 0 01-.319.337z"
      ></path>
      <g fill="#D5AB88">
        <path d="M20.695 14.369l1.486-.105s.378-.029.654-.283c.172-.159.305-.405.277-.79-.071-1.002-1.073-.931-1.073-.931l-.403.029-.599.042-.483.034.141 2.004z"></path>
        <path d="M20.713 14.368l-.037.003a.321.321 0 01-.341-.296l-.097-1.368a.321.321 0 01.296-.341l.037-.003a.321.321 0 01.341.296l.097 1.368a.32.32 0 01-.296.341z"></path>
      </g>
      <g fill="#D5AB88">
        <path d="M20.846 14.79l.187 1.693.571-.049s.291-.037.513-.236c.156-.139.278-.356.24-.704-.094-.846-.94-.753-.94-.753l-.571.049z"></path>
        <path d="M21.049 16.481l-.031.004a.272.272 0 01-.306-.23l-.162-1.151a.272.272 0 01.23-.306l.031-.004a.272.272 0 01.306.23l.162 1.151a.272.272 0 01-.23.306z"></path>
      </g>
      <g fill="#D5AB88">
        <path d="M21.339 9.348s.358.018.673-.169c.228-.135.434-.375.465-.821.074-1.064-.99-1.138-.99-1.138l-.532-.037-.148-.01-.148 2.128.68.047z"></path>
        <path d="M20.689 9.303l-.06-.004a.33.33 0 01-.305-.35l.102-1.474a.33.33 0 01.35-.305l.06.004a.33.33 0 01.305.35l-.102 1.474a.329.329 0 01-.35.305z"></path>
      </g>
      <path
        fill="#D5AB88"
        d="M21.735 11.873s.358-.017.653-.234c.214-.157.396-.415.383-.862-.03-1.066-1.096-1.036-1.096-1.036l-.533.015-.514.014.06 2.133 1.047-.03z"
      ></path>
      <path
        fill="#8DB9EA"
        d="M29.25 21h-3.792c-.411 0-.583.203-1.198 1.211l-4.382 6.699L6.5 25.871V36h16.365c1.333 0 2.533-.307 3.035-1.542l4.633-11.626C30.958 21.5 30.197 21 29.25 21z"
      ></path>
    </svg>
  );
};

export default Selfie;
