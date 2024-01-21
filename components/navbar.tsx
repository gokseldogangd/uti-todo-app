import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";

export const Navbar = () => {
  return (
    <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Logo />
        <div className="flex items-center space-x-4 md:space-x-0 md:w-auto md:ml-auto">
          <Button size="sm" asChild>
            <Link href="/todos">Get Uti-Tracker for free</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
