import { Toaster } from "@/components/ui/sonner";
import { useCallback, useEffect, useState } from "react";
import BootScreen from "./components/BootScreen";
import TerminalLayout from "./components/TerminalLayout";
import { AdminProvider } from "./context/AdminContext";
import { useIncrementVisitor } from "./hooks/useQueries";

export type Section =
  | "home"
  | "about"
  | "projects"
  | "upcoming"
  | "restricted"
  | "admin-auth";

export default function App() {
  const [bootComplete, setBootComplete] = useState(false);
  const [exitingBoot, setExitingBoot] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("home");
  const incrementVisitor = useIncrementVisitor();

  const handleBootComplete = useCallback(() => {
    setExitingBoot(true);
    setTimeout(() => {
      setBootComplete(true);
      incrementVisitor.mutate();
    }, 800);
  }, [incrementVisitor]);

  // Update page title
  useEffect(() => {
    document.title = "ITCLUB_OS v2.0 -- CONNECTED";
  }, []);

  return (
    <AdminProvider>
      <div className="font-mono crt-flicker">
        {/* CRT overlay effects */}
        <div className="crt-scanlines" aria-hidden="true" />
        <div className="screen-vignette" aria-hidden="true" />

        {!bootComplete && (
          <BootScreen onComplete={handleBootComplete} exiting={exitingBoot} />
        )}
        {bootComplete && (
          <TerminalLayout
            activeSection={activeSection}
            onNavigate={setActiveSection}
          />
        )}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "oklch(0.08 0 0)",
              border: "1px solid oklch(0.4 0.1 142)",
              color: "oklch(0.85 0.18 142)",
              fontFamily: "inherit",
              fontSize: "12px",
              boxShadow: "0 0 15px oklch(0.5 0.12 142 / 0.3)",
            },
          }}
        />
      </div>
    </AdminProvider>
  );
}
