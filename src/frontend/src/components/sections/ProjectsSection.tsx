import { useEffect, useState } from "react";
import type { Project } from "../../backend.d";
import { useAdmin } from "../../context/AdminContext";
import { useGetAllProjects } from "../../hooks/useQueries";

const SAMPLE_PROJECTS: Project[] = [
  {
    id: BigInt(1),
    name: "Suttradhara_MiniTechFest",
    description:
      "ITCLUB's debut mini tech fest at BVB KDLR. Exhibits, demos, and student-led workshops showcasing tech to the school.",
    year: BigInt(2025),
    status: "200",
  },
  {
    id: BigInt(2),
    name: "Robotics_Workshop",
    description:
      "Two-day hands-on robotics workshop for students. Covered hardware assembly, basic programming, and bot demonstrations.",
    year: BigInt(2025),
    status: "200",
  },
  {
    id: BigInt(3),
    name: "Pragati_Techfest",
    description:
      "Full-scale annual tech fest. Competitions, technical events, and showcases across disciplines.",
    year: BigInt(2025),
    status: "200",
  },
  {
    id: BigInt(4),
    name: "AnnualDay_Presentation",
    description:
      "Designed and delivered the background presentation for school Annual Day ceremony.",
    year: BigInt(2025),
    status: "200",
  },
  {
    id: BigInt(5),
    name: "Scoreboard_System",
    description:
      "Live scoreboard support for Cultural Fest, Sports Fest, and inter-school Math Quiz. Real-time score display and management.",
    year: BigInt(2025),
    status: "200",
  },
];

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; msg: string }
> = {
  "200": {
    label: "200 OK",
    color: "oklch(0.78 0.22 142)",
    msg: "REQUEST_FULFILLED",
  },
  "201": {
    label: "201 CREATED",
    color: "oklch(0.72 0.18 75)",
    msg: "RESOURCE_CREATED",
  },
  "202": {
    label: "202 ACCEPTED",
    color: "oklch(0.68 0.16 200)",
    msg: "ACCEPTED",
  },
};

function getStatusConfig(status: string) {
  return (
    STATUS_CONFIG[status] ?? {
      label: `${status}`,
      color: "oklch(0.55 0.12 142)",
      msg: "COMPLETED",
    }
  );
}

const EDIT_STORAGE_KEY = "itclub_project_edits";

interface ProjectEdits {
  [id: string]: { name: string; description: string };
}

function loadEdits(): ProjectEdits {
  try {
    const raw = localStorage.getItem(EDIT_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ProjectEdits;
  } catch {
    // ignore
  }
  return {};
}

function saveEdits(edits: ProjectEdits) {
  try {
    localStorage.setItem(EDIT_STORAGE_KEY, JSON.stringify(edits));
  } catch {
    // ignore
  }
}

export default function ProjectsSection() {
  const { isAdmin } = useAdmin();
  const { data: backendProjects, isLoading } = useGetAllProjects();
  const baseProjects =
    backendProjects && backendProjects.length > 0
      ? backendProjects
      : SAMPLE_PROJECTS;

  const [edits, setEdits] = useState<ProjectEdits>(() => loadEdits());
  const [savedFlash, setSavedFlash] = useState<string | null>(null);

  // Merge edits with base projects
  const projects = baseProjects.map((p) => {
    const e = edits[p.id.toString()];
    if (e) {
      return { ...p, name: e.name, description: e.description };
    }
    return p;
  });

  // Sync edits to localStorage whenever they change
  useEffect(() => {
    saveEdits(edits);
  }, [edits]);

  const handleNameChange = (id: string, value: string) => {
    setEdits((prev) => ({
      ...prev,
      [id]: {
        name: value,
        description:
          prev[id]?.description ??
          baseProjects.find((p) => p.id.toString() === id)?.description ??
          "",
      },
    }));
  };

  const handleDescriptionChange = (id: string, value: string) => {
    setEdits((prev) => ({
      ...prev,
      [id]: {
        name:
          prev[id]?.name ??
          baseProjects.find((p) => p.id.toString() === id)?.name ??
          "",
        description: value,
      },
    }));
  };

  const handleSave = (id: string) => {
    setSavedFlash(id);
    setTimeout(() => setSavedFlash(null), 1500);
  };

  const editInputStyle: React.CSSProperties = {
    background: "transparent",
    border: "1px solid oklch(0.4 0.1 142)",
    color: "inherit",
    fontFamily: "inherit",
    fontSize: "inherit",
    outline: "none",
    width: "100%",
    padding: "2px 4px",
    caretColor: "oklch(0.85 0.22 142)",
  };

  return (
    <div data-ocid="projects.section" className="max-w-4xl space-y-6">
      {/* Terminal prompt */}
      <div className="section-prompt">
        <span className="phosphor-dim">root@itclub:~$</span>{" "}
        <span className="phosphor-text">history --executed</span>
        {isAdmin && (
          <span
            className="ml-3 text-xs font-bold px-2 py-0.5 border"
            style={{
              color: "oklch(0.76 0.16 75)",
              borderColor: "oklch(0.55 0.14 75)",
              background: "oklch(0.1 0.04 75 / 0.3)",
              textShadow: "0 0 6px oklch(0.76 0.16 75 / 0.8)",
              boxShadow: "0 0 8px oklch(0.55 0.14 75 / 0.3)",
            }}
          >
            [EDIT MODE ACTIVE]
          </span>
        )}
      </div>

      <div className="phosphor-dim text-xs">
        {projects.length} programs found in execution log
      </div>

      {/* Projects list */}
      <div className="space-y-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
              <div key={i} className="terminal-border p-4 text-xs phosphor-dim">
                Loading program {i + 1}... <span className="cursor-blink" />
              </div>
            ))
          : projects.map((project, i) => {
              const cfg = getStatusConfig(project.status);
              const cmdName = project.name.toLowerCase().replace(/\s+/g, "_");
              const idStr = project.id.toString();
              const isSaved = savedFlash === idStr;

              return (
                <div
                  key={project.id.toString()}
                  data-ocid={`projects.item.${i + 1}`}
                  className="terminal-border p-4 space-y-3"
                  style={{
                    background: "oklch(0.09 0.02 142 / 0.3)",
                    borderColor: isAdmin ? "oklch(0.45 0.12 75)" : undefined,
                  }}
                >
                  {/* Command header */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="px-2 py-0.5 text-xs font-bold border"
                      style={{
                        color: cfg.color,
                        borderColor: cfg.color,
                        background: `${cfg.color}15`,
                        textShadow: `0 0 6px ${cfg.color}`,
                        boxShadow: `0 0 8px ${cfg.color}20`,
                      }}
                    >
                      [{cfg.label}]
                    </span>

                    {isAdmin ? (
                      <input
                        data-ocid={`projects.edit.input.${i + 1}`}
                        type="text"
                        value={project.name}
                        onChange={(e) =>
                          handleNameChange(idStr, e.target.value)
                        }
                        onBlur={() => handleSave(idStr)}
                        style={{
                          ...editInputStyle,
                          fontSize: "0.875rem",
                          fontWeight: "bold",
                          color: "oklch(0.92 0.24 142)",
                          textShadow: "0 0 6px oklch(0.92 0.24 142 / 0.5)",
                          maxWidth: "260px",
                        }}
                      />
                    ) : (
                      <span className="phosphor-bright font-bold text-sm">
                        {project.name}
                      </span>
                    )}

                    <span className="phosphor-dim text-xs">
                      {"// "}
                      {cfg.msg}
                    </span>

                    {isAdmin && isSaved && (
                      <span
                        className="text-xs font-bold"
                        style={{
                          color: "oklch(0.76 0.16 75)",
                          textShadow: "0 0 6px oklch(0.76 0.16 75 / 0.7)",
                          animation: "fade-out 1.5s ease-out forwards",
                        }}
                      >
                        [SAVED]
                      </span>
                    )}
                  </div>

                  {/* Fake terminal command */}
                  <div
                    className="text-xs px-3 py-2 border-l-2"
                    style={{
                      borderColor: cfg.color,
                      background: "oklch(0.07 0.01 142)",
                      color: "oklch(0.5 0.1 142)",
                    }}
                  >
                    <span style={{ color: cfg.color }}>$</span>{" "}
                    <span className="phosphor-dim">
                      ./{cmdName} --execute --year={project.year.toString()}
                    </span>
                  </div>

                  {/* Description */}
                  {isAdmin ? (
                    <textarea
                      data-ocid={`projects.edit.textarea.${i + 1}`}
                      value={project.description}
                      onChange={(e) =>
                        handleDescriptionChange(idStr, e.target.value)
                      }
                      onBlur={() => handleSave(idStr)}
                      rows={2}
                      style={{
                        ...editInputStyle,
                        resize: "vertical",
                        lineHeight: "1.5",
                      }}
                    />
                  ) : (
                    <div className="text-xs phosphor-text">
                      {">"} {project.description}
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs phosphor-dim">
                    <span>YEAR: {project.year.toString()}</span>
                    <span>ID: {project.id.toString().padStart(4, "0")}</span>
                    <span style={{ color: cfg.color }}>STATUS: {cfg.msg}</span>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Summary */}
      <div
        className="border p-4 text-xs"
        style={{
          borderColor: "oklch(0.25 0.06 142)",
          background: "oklch(0.08 0.01 142)",
        }}
      >
        <div className="phosphor-dim mb-2">
          cat /var/log/project-summary.txt
        </div>
        <div className="space-y-1">
          <div>
            <span className="phosphor-dim">Total executed: </span>
            <span className="phosphor-bright">{projects.length}</span>
          </div>
          <div>
            <span className="phosphor-dim">Success rate: </span>
            <span className="phosphor-bright">100%</span>
          </div>
          <div>
            <span className="phosphor-dim">School: </span>
            <span className="phosphor-text">BVB KDLR</span>
          </div>
          <div>
            <span className="phosphor-dim">Year: </span>
            <span className="amber-text">2025 (Year 1)</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-out {
          0% { opacity: 1; }
          60% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
