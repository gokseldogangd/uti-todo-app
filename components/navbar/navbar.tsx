import { Button } from "@/components/ui/button";
import { Logo } from "../logo";
import Link from "next/link";

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-white flex items-center">
      <div className="flex items-center gap-x-4">
        <div className="flex">
          <Logo />
        </div>
      </div>
      <div className="ml-auto flex items-center gap-x-2">
        <Link href="/todos">
          <Button size="sm" className="rounded-sm h-auto py-1.5 px-2">
            To-Do List
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
