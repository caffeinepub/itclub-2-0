import { useEffect, useRef, useState } from "react";
import { useGetClubInfo } from "../../hooks/useQueries";

const CHANGELOG = [
  { ver: "v2.0", type: "NEW", text: "PRAGATI 2.0 -- secret project initiated" },
  { ver: "v2.0", type: "NEW", text: "50+ members and growing" },
  { ver: "v2.0", type: "UPD", text: "Skills matrix upgraded for Year 2" },
  { ver: "v2.0", type: "FIX", text: "Motivation levels normalized (↑200%)" },
  {
    ver: "v1.0",
    type: "ADD",
    text: "Suttradhara Mini Tech Fest -- Aug 01, 2025",
  },
  { ver: "v1.0", type: "ADD", text: "Robotics Workshop -- Dec 04-05, 2025" },
  { ver: "v1.0", type: "ADD", text: "Pragati Techfest -- Dec 06, 2025" },
  { ver: "v1.0", type: "ADD", text: "Annual Day Background Presentation" },
  {
    ver: "v1.0",
    type: "ADD",
    text: "Scoreboard: Cultural Fest, Sports Fest, Math Quiz",
  },
  {
    ver: "v1.0",
    type: "INIT",
    text: "ITCLUB @ BVB KDLR -- system initialized (2025)",
  },
];

const MARQUEE_MESSAGES = [
  "[ kernel: itclub.exe launched ]",
  "[ sys: year2.module loaded -- BVB KDLR ]",
  "[ net: team.sync() complete -- 50+ nodes ]",
  "[ itclub: 1.0 -> 2.0 upgrade successful ]",
  "[ event: PRAGATI_TECHFEST dec-06 executed OK ]",
  "[ event: SUTTRADHARA mini-tech-fest aug-01 OK ]",
  "[ event: robotics_workshop dec-04 dec-05 OK ]",
  "[ kernel: innovation.ko inserted ]",
  "[ sys: coffee.levels: CRITICAL ]",
  "[ net: github.push() OK ]",
  "[ itclub: PRAGATI_2.0.decrypt: PENDING ]",
];

function VersionAnimation() {
  const [display, setDisplay] = useState("v1.0");
  const [phase, setPhase] = useState<"show1" | "delete" | "type2" | "done">(
    "show1",
  );
  const [charIndex, setCharIndex] = useState(4);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "show1") {
      timer = setTimeout(() => setPhase("delete"), 2000);
    } else if (phase === "delete") {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setCharIndex((c) => c - 1);
          setDisplay((d) => d.slice(0, -1));
        }, 120);
      } else {
        timer = setTimeout(() => {
          setPhase("type2");
          setCharIndex(0);
        }, 300);
      }
    } else if (phase === "type2") {
      const target = "v2.0";
      if (charIndex < target.length) {
        timer = setTimeout(() => {
          setDisplay(target.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        }, 100);
      } else {
        setPhase("done");
      }
    }

    return () => clearTimeout(timer);
  }, [phase, charIndex]);

  return (
    <div className="flex items-center gap-4 text-4xl md:text-6xl font-bold">
      <span className="phosphor-dim text-2xl md:text-4xl">ITCLUB</span>
      <span
        className={phase === "done" ? "phosphor-bright" : "amber-bright"}
        style={{ minWidth: "3em", display: "inline-block" }}
      >
        {display}
        {phase !== "done" && <span className="cursor-blink" />}
      </span>
    </div>
  );
}

function TypewriterText({
  text,
  delay = 0,
  className = "",
}: { text: string; delay?: number; className?: string }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length < text.length) {
      const t = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, 40);
      return () => clearTimeout(t);
    }
  }, [started, displayed, text]);

  return (
    <span className={className}>
      {displayed}
      {displayed.length < text.length && <span className="cursor-blink" />}
    </span>
  );
}

export default function HomeSection() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showChangelog, setShowChangelog] = useState(false);
  const { data: clubInfo } = useGetClubInfo();
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowChangelog(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const marqueeText = `${MARQUEE_MESSAGES.join("  ●  ")}  ●  ${MARQUEE_MESSAGES.join("  ●  ")}`;

  return (
    <div data-ocid="home.section" className="max-w-4xl space-y-8">
      {/* Terminal prompt */}
      <div className="section-prompt">
        <span className="phosphor-dim">root@itclub:~$</span>{" "}
        <span className="phosphor-text">./launch_year2.sh</span>
      </div>

      {/* ASCII Logo + Version */}
      <div className="terminal-border p-4 md:p-6 space-y-4">
        <pre className="phosphor-bright text-xs leading-tight overflow-x-auto select-none hidden sm:block">
          {`  ██╗████████╗ ██████╗██╗     ██╗   ██╗██████╗ 
  ██║╚══██╔══╝██╔════╝██║     ██║   ██║██╔══██╗
  ██║   ██║   ██║     ██║     ██║   ██║██████╔╝
  ██║   ██║   ██║     ██║     ██║   ██║██╔══██╗
  ██║   ██║   ╚██████╗███████╗╚██████╔╝██████╔╝
  ╚═╝   ╚═╝    ╚═════╝╚══════╝ ╚═════╝ ╚═════╝`}
        </pre>
        <pre className="phosphor-bright text-xs leading-tight overflow-x-auto select-none sm:hidden">
          {"  ITCLUB"}
        </pre>

        <div className="mt-4">
          <VersionAnimation />
        </div>

        <div className="mt-2 space-y-1">
          <div className="amber-text text-sm md:text-base font-bold tracking-widest">
            <TypewriterText
              text="YEAR 2 ONLINE. SYSTEM UPGRADED."
              delay={300}
            />
          </div>
          <div className="phosphor-dim text-xs">
            SCHOOL: BVB KDLR | FOUNDED:{" "}
            {clubInfo?.foundingYear?.toString() ?? "2025"} | VERSION:{" "}
            {clubInfo?.version ?? "2.0"} | STATUS: OPERATIONAL
          </div>
        </div>
      </div>

      {/* System Time */}
      <div
        className="flex items-center gap-3 text-xs border-b pb-2"
        style={{ borderColor: "oklch(0.2 0.05 142)" }}
      >
        <span className="phosphor-dim">SYSTEM TIME:</span>
        <span className="amber-text font-bold">
          {currentTime.toLocaleString("en-US", {
            hour12: false,
            weekday: "short",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "MEMBERS", value: "50+" },
          { label: "EVENTS", value: "06" },
          { label: "YEAR", value: "02" },
          { label: "STATUS", value: "ACTIVE" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="terminal-border p-3 text-center"
            style={{ background: "oklch(0.09 0.02 142 / 0.5)" }}
          >
            <div className="phosphor-dim text-xs">{stat.label}</div>
            <div className="phosphor-bright text-xl md:text-2xl font-bold mt-1">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Changelog */}
      {showChangelog && (
        <div className="terminal-border p-4 space-y-2">
          <div className="amber-text text-xs font-bold mb-3">
            ╔══ CHANGELOG ════════════════════════════════════╗
          </div>
          {CHANGELOG.map((entry) => (
            <div
              key={`${entry.ver}-${entry.type}-${entry.text}`}
              className="flex items-start gap-2 text-xs log-appear"
            >
              <span
                className="font-bold flex-none"
                style={{
                  color:
                    entry.ver === "v1.0"
                      ? "oklch(0.5 0.12 142)"
                      : entry.type === "FIX"
                        ? "oklch(0.65 0.22 28)"
                        : "oklch(0.76 0.16 75)",
                  textShadow: "0 0 4px currentColor",
                }}
              >
                [{entry.ver}]
              </span>
              <span
                className="font-bold flex-none"
                style={{
                  color:
                    entry.type === "INIT"
                      ? "oklch(0.5 0.12 142)"
                      : entry.type === "FIX"
                        ? "oklch(0.65 0.22 28)"
                        : entry.type === "NEW"
                          ? "oklch(0.78 0.22 142)"
                          : "oklch(0.72 0.18 75)",
                  minWidth: "4rem",
                  textShadow: "0 0 4px currentColor",
                }}
              >
                {entry.type}:
              </span>
              <span className="phosphor-text">{entry.text}</span>
            </div>
          ))}
          <div className="amber-text text-xs mt-2">
            ╚══════════════════════════════════════════════════╝
          </div>
        </div>
      )}

      {/* Marquee */}
      <div
        className="overflow-hidden border py-1.5 text-xs"
        style={{
          borderColor: "oklch(0.25 0.06 142)",
          background: "oklch(0.08 0.02 142)",
        }}
      >
        <div ref={marqueeRef} className="marquee-track phosphor-dim">
          {marqueeText}
        </div>
      </div>

      {/* Footer attribution */}
      <div className="text-xs phosphor-dim text-center py-2">
        © {new Date().getFullYear()}. Built with{" "}
        <span className="amber-text">♥</span> using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="phosphor-text hover:phosphor-bright transition-colors"
        >
          caffeine.ai
        </a>
      </div>
    </div>
  );
}
