import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppFab } from "./WhatsAppFab";

export const Layout = () => (
  <div className="min-h-screen flex flex-col overflow-x-hidden">
    <Navbar />
    <main className="flex-1 w-full">
      <Outlet />
    </main>
    <Footer />
    <WhatsAppFab />
  </div>
);
