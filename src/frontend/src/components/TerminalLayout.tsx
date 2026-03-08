import { useEffect, useState } from "react";
import type { Section } from "../App";
import { useAdmin } from "../context/AdminContext";
import { useGetVisitorCount } from "../hooks/useQueries";
import AdminAuthPage from "./AdminAuthPage";
import Sidebar from "./Sidebar";
import SystemLog from "./SystemLog";
import AboutSection from "./sections/AboutSection";
import HomeSection from "./sections/HomeSection";
import ProjectsSection from "./sections/ProjectsSection";
import RestrictedSection from "./sections/RestrictedSection";
import UpcomingSection from "./sections/UpcomingSection";

interface TerminalLayoutProps {
  activeSection: Section;
  onNavigate: (section: Section) => void;
}

export default function TerminalLayout({
  activeSection,
  onNavigate,
}: TerminalLayoutProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: visitorCount } = useGetVisitorCount();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleString("en-US", {
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const uptime = Math.floor(Date.now() / 1000) % 86400;
  const uptimeHours = Math.floor(uptime / 3600);
  const uptimeMinutes = Math.floor((uptime % 3600) / 60);

  const { isAdmin } = useAdmin();

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <HomeSection />;
      case "about":
        return <AboutSection onNavigate={onNavigate} />;
      case "projects":
        return <ProjectsSection />;
      case "upcoming":
        return <UpcomingSection />;
      case "restricted":
        return <RestrictedSection />;
      case "admin-auth":
        return (
          <AdminAuthPage
            onSuccess={() => onNavigate("about")}
            onCancel={() => onNavigate("about")}
          />
        );
      default:
        return <HomeSection />;
    }
  };

  return (
    <div
      className="fixed inset-0 flex flex-col font-mono"
      style={{ background: "oklch(0.06 0 0)" }}
    >
      {/* Title Bar */}
      <header
        className="flex-none flex items-center justify-between px-3 py-1.5 border-b"
        style={{
          background: "oklch(0.1 0.03 142)",
          borderColor: "oklch(0.4 0.1 142)",
          boxShadow: "0 2px 10px oklch(0.4 0.1 142 / 0.3)",
        }}
      >
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden phosphor-text text-xs border border-current px-2 py-0.5 hover:bg-phosphor/10"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "[X]" : "[≡]"}
          </button>
          <span className="phosphor-bright text-xs sm:text-sm font-bold tracking-widest">
            ╔══ ITCLUB_OS v2.0 ══╗
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="phosphor-dim hidden sm:block">
            SYS: {formatTime(currentTime)}
          </span>
          <span
            className="text-xs px-2 py-0.5 border"
            style={{
              color: "oklch(0.75 0.18 142)",
              borderColor: "oklch(0.4 0.1 142)",
              background: "oklch(0.08 0.02 142)",
              boxShadow: "0 0 8px oklch(0.5 0.12 142 / 0.3)",
            }}
          >
            ● CONNECTED
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Desktop always visible, mobile overlay */}
        <div
          className={`
            flex-none w-52 border-r flex flex-col
            ${sidebarOpen ? "block" : "hidden"} md:flex
            absolute md:relative z-40 md:z-auto top-0 bottom-0 left-0
          `}
          style={{
            background: "oklch(0.07 0.01 142)",
            borderColor: "oklch(0.25 0.06 142)",
          }}
        >
          <Sidebar
            activeSection={activeSection}
            onNavigate={(s) => {
              onNavigate(s);
              setSidebarOpen(false);
            }}
          />
        </div>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            role="button"
            tabIndex={0}
            aria-label="Close sidebar"
            className="md:hidden fixed inset-0 z-30 bg-black/60"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setSidebarOpen(false);
            }}
          />
        )}

        {/* Main terminal content */}
        <main
          className="flex-1 overflow-y-auto p-4 md:p-6 relative"
          style={{ background: "oklch(0.065 0.005 142)" }}
        >
          {renderSection()}
        </main>

        {/* System Log - right panel, hidden on small screens */}
        <div
          className="hidden lg:flex flex-none w-56 border-l flex-col"
          style={{
            background: "oklch(0.07 0.01 142)",
            borderColor: "oklch(0.2 0.05 142)",
          }}
        >
          <SystemLog />
        </div>
      </div>

      {/* Footer Status Bar */}
      <footer
        className="flex-none flex items-center justify-between px-3 py-1 border-t text-xs"
        style={{
          background: "oklch(0.09 0.02 142)",
          borderColor: "oklch(0.3 0.07 142)",
        }}
      >
        <div className="flex items-center gap-4">
          <span className="phosphor-dim">
            UPTIME: {uptimeHours.toString().padStart(2, "0")}:
            {uptimeMinutes.toString().padStart(2, "0")}
          </span>
          <span className="phosphor-dim hidden sm:block">
            MEM: {(Math.random() * 20 + 40).toFixed(1)}%
          </span>
          <span className="phosphor-dim hidden sm:block">
            CPU: {(Math.random() * 15 + 5).toFixed(1)}%
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="phosphor-dim">
            VISITORS: {visitorCount?.toString() ?? "..."}
          </span>
          {isAdmin && (
            <span
              className="text-xs font-bold px-2 py-0.5 border hidden sm:block"
              style={{
                color: "oklch(0.76 0.16 75)",
                borderColor: "oklch(0.55 0.14 75)",
                background: "oklch(0.12 0.04 75 / 0.4)",
                textShadow: "0 0 8px oklch(0.76 0.16 75 / 0.8)",
                boxShadow: "0 0 8px oklch(0.55 0.14 75 / 0.3)",
              }}
            >
              ★ ADMIN
            </span>
          )}
          <span className="amber-text hidden sm:block">ITCLUB_OS v2.0</span>
          <span className="cursor-blink" />
        </div>
      </footer>
    </div>
  );
}
