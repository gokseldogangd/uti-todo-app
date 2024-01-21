import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <Image src="/logo.svg" alt="Logo" height={100} width={100} />
          </div>
          <h1 className="text-4xl font-bold my-6 text-gray-800">Uti-Tracker</h1>
          <p className="text-lg mb-4 text-gray-700">
            Welcome to our Dynamic To-Do List application. Here, you can easily
            manage your daily tasks.
          </p>
          <Button className="mt-6" size="lg" asChild>
            <Link href="/todos">Go to To-Do List</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
