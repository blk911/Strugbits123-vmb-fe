import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1  mt-[60px] sm:mt-[70px] md:mt-[79px] overflow-hidden">
        <Outlet />
      </main>

      <footer className="border-t" style={{ borderColor: "var(--vmb-border)" }}>
        <Footer />
      </footer>
    </div>
  );
}
