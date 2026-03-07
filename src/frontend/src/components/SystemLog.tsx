import { useEffect, useRef, useState } from "react";

const LOG_MESSAGES = [
  "kernel: IRQ handler optimized",
  "net: packet from 192.168.1.42",
  "itclub: creativity.exe running",
  "sys: memory defragmented",
  "itclub: ideas.queue flushed",
  "net: ping 8.8.8.8: 14ms",
  "kernel: scheduler updated",
  "itclub: project.build OK",
  "fs: /dev/dreams mounted",
  "net: 3 new connections",
  "itclub: motivation+=1337",
  "sys: CPU temp nominal",
  "itclub: code.compile(SUCCESS)",
  "net: ssl handshake OK",
  "kernel: watchdog feeding",
  "itclub: coffee.exe started",
  "sys: swap: 0% used",
  "net: DNS resolved OK",
  "itclub: teamwork.sync()",
  "kernel: page fault handled",
  "itclub: design.render() OK",
  "net: uplink 42Mbps",
  "sys: logs rotated",
  "itclub: hackathon.prep()",
  "kernel: entropy pool: 1337",
  "net: firewall rules applied",
  "itclub: innovation.loop(∞)",
  "sys: disk io: normal",
  "itclub: PRAGATI.init()...",
  "kernel: syscall: 0x1337",
];

interface LogEntry {
  id: number;
  text: string;
  timestamp: string;
}

export default function SystemLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [counter, setCounter] = useState(0);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add initial logs
    const initial: LogEntry[] = LOG_MESSAGES.slice(0, 5).map((msg, i) => ({
      id: i,
      text: msg,
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
    }));
    setLogs(initial);
    setCounter(5);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const msg = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
      const entry: LogEntry = {
        id: Date.now(),
        text: msg,
        timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      };
      setLogs((prev) => [...prev.slice(-30), entry]);
      setCounter((c) => c + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional - scroll on log update
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex-none px-3 py-2 border-b"
        style={{ borderColor: "oklch(0.2 0.05 142)" }}
      >
        <div className="phosphor-dim text-xs">── SYSTEM LOG ──</div>
        <div className="phosphor-dim text-xs mt-0.5">entries: {counter}</div>
      </div>

      {/* Log entries */}
      <div ref={logRef} className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {logs.map((log, i) => (
          <div
            key={log.id}
            className={`text-xs log-appear ${i === logs.length - 1 ? "phosphor-text" : "phosphor-dim"}`}
          >
            <span style={{ color: "oklch(0.45 0.1 142)" }}>
              {log.timestamp}
            </span>{" "}
            <span>{log.text}</span>
          </div>
        ))}
        <div className="flex items-center gap-1 text-xs phosphor-dim">
          <span>$</span>
          <span className="cursor-blink" style={{ transform: "scale(0.7)" }} />
        </div>
      </div>
    </div>
  );
}
