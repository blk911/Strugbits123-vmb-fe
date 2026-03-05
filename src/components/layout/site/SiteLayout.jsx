import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-[100px]">
        <Outlet />
      </main>

      <footer className="border-t" style={{ borderColor: "var(--vmb-border)" }}>
        <Footer />
      </footer>
    </div>
  );
}
