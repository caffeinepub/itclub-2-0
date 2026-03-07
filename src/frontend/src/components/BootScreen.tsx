import { useEffect, useState } from "react";

interface BootScreenProps {
  onComplete: () => void;
  exiting: boolean;
}

const BOOT_MESSAGES = [
  { text: "BIOS v4.2.1 -- ITCLUB SYSTEMS", delay: 0, color: "amber" },
  {
    text: "Copyright (C) 2024-2026 ITCLUB. All rights reserved.",
    delay: 300,
    color: "dim",
  },
  { text: "", delay: 400, color: "dim" },
  {
    text: "Checking CPU... Pentium ITCLUB-9000 @ 3.14 GHz",
    delay: 600,
    color: "normal",
  },
  { text: "Checking Memory... 1337 MB OK", delay: 900, color: "normal" },
  {
    text: "Checking Storage... /dev/club/projects: 4 items",
    delay: 1100,
    color: "normal",
  },
  {
    text: "Checking Network... eth0: CONNECTED [192.168.1.42]",
    delay: 1300,
    color: "normal",
  },
  { text: "", delay: 1500, color: "dim" },
  { text: "Loading ITCLUB_OS v2.0...", delay: 1600, color: "bright" },
  { text: "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ [ 25% ]", delay: 1800, color: "dim" },
  {
    text: "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ [ 50% ]",
    delay: 2100,
    color: "dim",
  },
  {
    text: "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ [ 75% ]",
    delay: 2400,
    color: "dim",
  },
  {
    text: "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ [ 100% ]",
    delay: 2700,
    color: "dim",
  },
  { text: "", delay: 2900, color: "dim" },
  { text: "Mounting filesystem... OK", delay: 3000, color: "normal" },
  {
    text: "Loading kernel modules: creativity.ko, teamwork.ko, code.ko",
    delay: 3200,
    color: "normal",
  },
  {
    text: "Starting services: nginx, postgres, dream-engine...",
    delay: 3400,
    color: "normal",
  },
  { text: "", delay: 3600, color: "dim" },
  { text: "** ITCLUB YEAR 2 INITIALIZED **", delay: 3700, color: "bright" },
  {
    text: "** UPGRADE FROM v1.0 -> v2.0 COMPLETE **",
    delay: 3900,
    color: "bright",
  },
  { text: "", delay: 4100, color: "dim" },
  { text: "Welcome to ITCLUB_OS v2.0", delay: 4200, color: "amber" },
  { text: "Type 'help' for available commands.", delay: 4400, color: "amber" },
];

export default function BootScreen({ onComplete, exiting }: BootScreenProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_MESSAGES.forEach((msg, index) => {
      const t = setTimeout(() => {
        setVisibleLines(index + 1);
      }, msg.delay);
      timers.push(t);
    });

    const finalTimer = setTimeout(() => {
      setReady(true);
      setTimeout(onComplete, 800);
    }, 5200);
    timers.push(finalTimer);

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const getColor = (color: string) => {
    switch (color) {
      case "bright":
        return "phosphor-bright";
      case "amber":
        return "amber-text";
      case "dim":
        return "phosphor-dim";
      default:
        return "phosphor-text";
    }
  };

  return (
    <div
      data-ocid="boot.screen"
      className={`fixed inset-0 z-50 flex flex-col items-start justify-center p-8 md:p-16 font-mono ${exiting ? "boot-exit" : ""}`}
      style={{ background: "oklch(0.04 0 0)" }}
    >
      <div className="w-full max-w-3xl">
        {/* ASCII Art Header */}
        <pre className="phosphor-bright text-xs sm:text-sm mb-6 leading-tight select-none overflow-x-auto">
          {`  ██╗████████╗ ██████╗██╗     ██╗   ██╗██████╗
  ██║╚══██╔══╝██╔════╝██║     ██║   ██║██╔══██╗
  ██║   ██║   ██║     ██║     ██║   ██║██████╔╝
  ██║   ██║   ██║     ██║     ██║   ██║██╔══██╗
  ██║   ██║   ╚██████╗███████╗╚██████╔╝██████╔╝
  ╚═╝   ╚═╝    ╚═════╝╚══════╝ ╚═════╝ ╚═════╝
             OPERATING SYSTEM  v2.0`}
        </pre>

        <div
          className="h-px w-full mb-4"
          style={{ background: "oklch(0.4 0.1 142 / 0.4)" }}
        />

        {/* Boot messages */}
        <div className="space-y-0.5">
          {BOOT_MESSAGES.slice(0, visibleLines).map((msg) => (
            <div
              key={msg.delay}
              className={`text-xs sm:text-sm leading-relaxed log-appear ${getColor(msg.color)}`}
            >
              {msg.text === "" ? "\u00a0" : msg.text}
            </div>
          ))}
        </div>

        {ready && (
          <div className="mt-6 flex items-center gap-2">
            <span className="amber-bright text-sm">SYSTEM READY</span>
            <span className="cursor-blink" />
          </div>
        )}
      </div>
    </div>
  );
}
