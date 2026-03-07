import type { UpcomingProject } from "../../backend.d";
import { useGetAllUpcomingProjects } from "../../hooks/useQueries";

const SAMPLE_UPCOMING: UpcomingProject[] = [
  {
    id: BigInt(1),
    name: "MobileApp_v1",
    description: "Club mobile companion app — native iOS/Android experience.",
    expectedYear: BigInt(2026),
    progress: BigInt(45),
  },
  {
    id: BigInt(2),
    name: "AIStudyBot",
    description: "AI-powered study assistant for students. GPT-backed tutor.",
    expectedYear: BigInt(2026),
    progress: BigInt(20),
  },
  {
    id: BigInt(3),
    name: "PRAGATI_2.0",
    description: "[CLASSIFIED -- DECRYPTION REQUIRED]",
    expectedYear: BigInt(2026),
    progress: BigInt(0),
  },
];

const STATUS_FOR_PROGRESS = (p: number): { label: string; color: string } => {
  if (p === 0) return { label: "RESTRICTED", color: "oklch(0.65 0.22 28)" };
  if (p < 30) return { label: "IN_PROGRESS", color: "oklch(0.76 0.16 75)" };
  if (p < 70) return { label: "IN_PROGRESS", color: "oklch(0.72 0.18 75)" };
  return { label: "QUEUED", color: "oklch(0.78 0.22 142)" };
};

function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(100, Math.max(0, value));
  const filled = Math.round((pct / max) * 20);
  const empty = 20 - filled;

  return (
    <span className="text-xs font-mono">
      [<span className="phosphor-bright">{"█".repeat(filled)}</span>
      <span className="phosphor-dim">{"░".repeat(empty)}</span>] {pct}%
    </span>
  );
}

export default function UpcomingSection() {
  const { data: backendUpcoming, isLoading } = useGetAllUpcomingProjects();
  const projects =
    backendUpcoming && backendUpcoming.length > 0
      ? backendUpcoming
      : SAMPLE_UPCOMING;

  return (
    <div data-ocid="upcoming.section" className="max-w-4xl space-y-6">
      {/* Terminal prompt */}
      <div className="section-prompt">
        <span className="phosphor-dim">root@itclub:~$</span>{" "}
        <span className="phosphor-text">crontab -l</span>
      </div>

      <div className="phosphor-dim text-xs">
        {projects.length} scheduled tasks found
      </div>

      {/* Cron-style header */}
      <div
        className="border px-4 py-2 text-xs"
        style={{
          borderColor: "oklch(0.25 0.06 142)",
          background: "oklch(0.08 0.01 142)",
        }}
      >
        <span className="phosphor-dim"># m h dom mon dow command</span>
        <br />
        <span className="phosphor-dim">
          # (itclub automated task scheduler v2.0)
        </span>
      </div>

      {/* Task list */}
      <div className="space-y-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
              <div key={i} className="terminal-border p-4 text-xs phosphor-dim">
                Loading scheduled task {i + 1}...{" "}
                <span className="cursor-blink" />
              </div>
            ))
          : projects.map((proj, i) => {
              const pct = Number(proj.progress);
              const status = STATUS_FOR_PROGRESS(pct);
              const isRestricted =
                pct === 0 && proj.name.toUpperCase().includes("PRAGATI");
              const cronExpr = isRestricted
                ? "* * * * * [ENCRYPTED]"
                : `0 9 1 1 * ${proj.name.toLowerCase()}`;

              return (
                <div
                  key={proj.id.toString()}
                  data-ocid={`upcoming.item.${i + 1}`}
                  className="terminal-border p-4 space-y-3"
                  style={{
                    background: isRestricted
                      ? "oklch(0.09 0.04 28 / 0.2)"
                      : "oklch(0.09 0.02 142 / 0.3)",
                    borderColor: isRestricted
                      ? "oklch(0.45 0.15 28)"
                      : undefined,
                  }}
                >
                  {/* Cron entry */}
                  <div
                    className="text-xs px-3 py-1.5 border-l-2"
                    style={{
                      borderColor: status.color,
                      background: "oklch(0.07 0.01 142)",
                      color: "oklch(0.45 0.1 142)",
                    }}
                  >
                    <span style={{ color: status.color }}>CRON</span>{" "}
                    <span className="phosphor-dim">{cronExpr}</span>
                  </div>

                  {/* Header */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="px-2 py-0.5 text-xs font-bold border"
                      style={{
                        color: status.color,
                        borderColor: status.color,
                        background: `${status.color}15`,
                        textShadow: `0 0 6px ${status.color}`,
                      }}
                    >
                      {status.label}
                    </span>
                    <span
                      className={`font-bold text-sm ${isRestricted ? "" : "phosphor-bright"}`}
                      style={
                        isRestricted
                          ? {
                              color: "oklch(0.65 0.22 28)",
                              textShadow: "0 0 8px oklch(0.65 0.22 28 / 0.5)",
                            }
                          : undefined
                      }
                    >
                      {proj.name}
                    </span>
                  </div>

                  {/* Description */}
                  <div
                    className="text-xs"
                    style={{
                      color: isRestricted
                        ? "oklch(0.55 0.15 28)"
                        : "oklch(0.8 0.18 142)",
                    }}
                  >
                    {"> "}
                    {proj.description}
                  </div>

                  {/* Progress */}
                  <div className="flex items-center gap-3 flex-wrap text-xs">
                    <span className="phosphor-dim">PROGRESS:</span>
                    <ProgressBar value={pct} />
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs phosphor-dim">
                    <span>ETA: {proj.expectedYear.toString()}</span>
                    <span>ID: {proj.id.toString().padStart(4, "0")}</span>
                    {isRestricted && (
                      <span style={{ color: "oklch(0.65 0.22 28)" }}>
                        ⚠ DECRYPTION REQUIRED
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
      </div>

      {/* Scheduler info */}
      <div
        className="border p-3 text-xs"
        style={{
          borderColor: "oklch(0.2 0.05 142)",
          background: "oklch(0.07 0.01 142)",
        }}
      >
        <div className="phosphor-dim mb-1">itclub-scheduler status:</div>
        <div className="phosphor-text">
          ● Scheduler daemon running (PID: 4242)
        </div>
        <div className="phosphor-dim">Next execution check: in 00:05:00</div>
      </div>
    </div>
  );
}
