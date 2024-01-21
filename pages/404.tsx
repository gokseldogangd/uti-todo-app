import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Custom404 = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-gray-600 text-center">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Button size="sm" className="mt-4">
          <Link href="/">Go back to the home page</Link>
        </Button>
      </div>
      <Footer />
    </>
  );
};

export default Custom404;
