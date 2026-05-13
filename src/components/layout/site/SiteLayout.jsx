import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function SiteLayout() {
  return (
    <div className="site-shell min-h-screen flex flex-col">
      <Header />

      <main className="mt-[76px] flex-1 overflow-hidden">
        <Outlet />
      </main>

      <footer className="border-t" style={{ borderColor: "var(--vmb-border)" }}>
        <Footer />
      </footer>
    </div>
  );
}
