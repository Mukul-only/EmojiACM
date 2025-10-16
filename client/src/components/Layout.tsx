import type { ReactNode } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col min-h-screen bg-[#0A0C10]">
    <NavBar />
    <main className="flex-1 w-full">{children}</main>
    <Footer />
  </div>
);

export default Layout;
