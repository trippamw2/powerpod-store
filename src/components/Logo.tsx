import logo from "@/assets/powerpod-logo.png";
import { Link } from "react-router-dom";

export const Logo = ({ className = "h-10 w-auto max-w-[140px] md:max-w-[180px] lg:max-w-[200px]" }: { className?: string }) => (
  <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="PowerPod home">
    <img src={logo} alt="PowerPod" className={`${className} object-contain`} />
  </Link>
);
