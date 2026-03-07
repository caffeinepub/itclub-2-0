import type { Member } from "../../backend.d";
import { useGetAllMembers } from "../../hooks/useQueries";

const SAMPLE_MEMBERS: Member[] = [
  {
    id: BigInt(1),
    name: "Suchithra Teacher",
    role: "Root / Faculty Advisor",
    accessLevel: BigInt(0),
    joinYear: BigInt(2025),
  },
  {
    id: BigInt(2),
    name: "Vinayak B Menon",
    role: "Admin",
    accessLevel: BigInt(1),
    joinYear: BigInt(2025),
  },
  {
    id: BigInt(3),
    name: "Niranjan M R",
    role: "Dev Lead",
    accessLevel: BigInt(2),
    joinYear: BigInt(2025),
  },
  {
    id: BigInt(4),
    name: "Member_004",
    role: "Developer",
    accessLevel: BigInt(3),
    joinYear: BigInt(2025),
  },
  {
    id: BigInt(5),
    name: "Member_005",
    role: "Developer",
    accessLevel: BigInt(3),
    joinYear: BigInt(2025),
  },
  {
    id: BigInt(6),
    name: "+ 47 more nodes",
    role: "Active Members",
    accessLevel: BigInt(3),
    joinYear: BigInt(2025),
  },
];

const ACCESS_LEVELS: Record<number, { label: string; color: string }> = {
  0: { label: "ROOT", color: "oklch(0.92 0.24 142)" },
  1: { label: "ADMIN", color: "oklch(0.76 0.16 75)" },
  2: { label: "DEV_LEAD", color: "oklch(0.72 0.2 200)" },
  3: { label: "USER", color: "oklch(0.55 0.12 142)" },
};

function getAccessLabel(level: bigint): { label: string; color: string } {
  const n = Number(level);
  return ACCESS_LEVELS[n] ?? { label: "GUEST", color: "oklch(0.45 0.08 142)" };
}

function getPid(id: bigint): string {
  return (Number(id) + 1000).toString().padStart(5, "0");
}

function progressBar(length = 6): string {
  return "█".repeat(length);
}

export default function AboutSection() {
  const { data: backendMembers, isLoading } = useGetAllMembers();
  const members =
    backendMembers && backendMembers.length > 0
      ? backendMembers
      : SAMPLE_MEMBERS;

  return (
    <div data-ocid="about.section" className="max-w-4xl space-y-6">
      {/* Terminal prompt */}
      <div className="section-prompt">
        <span className="phosphor-dim">root@itclub:~$</span>{" "}
        <span className="phosphor-text">ls -la /team</span>
      </div>

      <div className="amber-text text-xs">
        total 50+ nodes in /team (showing key processes)
      </div>

      {/* Process listing table */}
      <div className="terminal-border overflow-x-auto">
        <table className="terminal-table text-xs">
          <thead>
            <tr>
              <th className="phosphor-dim">PID</th>
              <th className="phosphor-dim">NAME</th>
              <th className="phosphor-dim hidden sm:table-cell">ROLE</th>
              <th className="phosphor-dim">ACCESS</th>
              <th className="phosphor-dim hidden md:table-cell">JOINED</th>
              <th className="phosphor-dim">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                  <tr key={i}>
                    <td className="phosphor-dim" colSpan={6}>
                      Loading process {i + 1}...{" "}
                      <span className="cursor-blink" />
                    </td>
                  </tr>
                ))
              : members.map((m, i) => {
                  const access = getAccessLabel(m.accessLevel);
                  return (
                    <tr
                      key={m.id.toString()}
                      data-ocid={`about.member.item.${i + 1}`}
                    >
                      <td className="phosphor-dim">{getPid(m.id)}</td>
                      <td>
                        <span className="phosphor-bright font-bold">
                          {m.name}
                        </span>
                      </td>
                      <td className="phosphor-text hidden sm:table-cell">
                        {m.role}
                      </td>
                      <td>
                        <span
                          className="font-bold text-xs px-1"
                          style={{
                            color: access.color,
                            textShadow: `0 0 6px ${access.color}`,
                            border: `1px solid ${access.color}`,
                            background: `${access.color}18`,
                          }}
                        >
                          {access.label}
                        </span>
                      </td>
                      <td className="phosphor-dim hidden md:table-cell">
                        {m.joinYear.toString()}
                      </td>
                      <td>
                        <span className="status-active">
                          ACTIVE {progressBar()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {/* Process info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="terminal-border p-4 space-y-2">
          <div className="amber-text text-xs font-bold mb-2">
            ╔══ PROCESS INFO ═══════╗
          </div>
          <div className="text-xs space-y-1">
            <div>
              <span className="phosphor-dim">total nodes: </span>
              <span className="phosphor-bright">50+</span>
            </div>
            <div>
              <span className="phosphor-dim">running: </span>
              <span className="phosphor-bright">50+</span>
            </div>
            <div>
              <span className="phosphor-dim">school: </span>
              <span className="phosphor-bright">BVB KDLR</span>
            </div>
            <div>
              <span className="phosphor-dim">founded: </span>
              <span className="phosphor-bright">2025</span>
            </div>
          </div>
          <div className="amber-text text-xs mt-2">
            ╚═══════════════════════╝
          </div>
        </div>

        <div className="terminal-border p-4 space-y-2">
          <div className="amber-text text-xs font-bold mb-2">
            ╔══ ACCESS LEVELS ═════╗
          </div>
          <div className="text-xs space-y-1">
            {Object.entries(ACCESS_LEVELS).map(([, { label, color }]) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className="px-1 font-bold"
                  style={{
                    color,
                    textShadow: `0 0 4px ${color}`,
                    border: `1px solid ${color}`,
                    background: `${color}18`,
                    minWidth: "6rem",
                    display: "inline-block",
                  }}
                >
                  {label}
                </span>
                <span className="phosphor-dim">
                  {label === "ROOT"
                    ? "full system access"
                    : label === "ADMIN"
                      ? "elevated access"
                      : label === "DEV_LEAD"
                        ? "dev environment"
                        : "standard access"}
                </span>
              </div>
            ))}
          </div>
          <div className="amber-text text-xs mt-2">
            ╚═══════════════════════╝
          </div>
        </div>
      </div>

      {/* Mission statement */}
      <div
        className="border p-4 text-xs space-y-2"
        style={{
          borderColor: "oklch(0.3 0.07 142)",
          background: "oklch(0.09 0.02 142 / 0.4)",
        }}
      >
        <div className="phosphor-dim">cat /etc/itclub/mission.txt</div>
        <div className="phosphor-text leading-relaxed">
          {
            "> ITCLUB @ BVB KDLR -- a student-driven technology club founded in 2025."
          }
          <br />
          {
            "> Led by Suchithra Teacher (ROOT), with a growing team of 50+ active members."
          }
          <br />
          {
            "> In our first year, we ran two major tech fests, a robotics workshop,"
          }
          <br />
          {"> and provided tech support for school events -- all as Year 1."}
          <br />
          {"> "}
          <br />
          {'> "Year 2. Bigger. Bolder. PRAGATI awaits." -- ITCLUB v2.0'}
        </div>
      </div>
    </div>
  );
}
