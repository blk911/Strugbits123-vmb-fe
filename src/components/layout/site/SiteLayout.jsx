import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function SiteLayout() {
  return (
    <div className="min-h-screen">
      <header
        className="border-b"
        style={{ borderColor: "var(--vmb-border)" }}
      >
        <div className="vmb-container py-4 flex items-center justify-between">
          <Header />
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t" style={{ borderColor: "var(--vmb-border)" }}>
        <div className="vmb-container py-6 vmb-muted">
          <Footer />
        </div>
      </footer>
    </div>
  );
}
