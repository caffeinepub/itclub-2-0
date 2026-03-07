import type { Section } from "../App";

interface SidebarProps {
  activeSection: Section;
  onNavigate: (section: Section) => void;
}

interface NavItem {
  id: Section;
  label: string;
  icon: string;
  ocid: string;
  danger?: boolean;
}

const navItems: NavItem[] = [
  { id: "home", label: "HOME", icon: "~", ocid: "nav.home.link" },
  { id: "about", label: "ABOUT_US", icon: "/team", ocid: "nav.about.link" },
  {
    id: "projects",
    label: "PROJECTS",
    icon: "/work",
    ocid: "nav.projects.link",
  },
  {
    id: "upcoming",
    label: "UPCOMING",
    icon: "/queue",
    ocid: "nav.upcoming.link",
  },
  {
    id: "restricted",
    label: "RESTRICTED",
    icon: "/secret",
    ocid: "nav.restricted.link",
    danger: true,
  },
];

export default function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  return (
    <nav className="flex flex-col h-full py-4 select-none">
      {/* Directory header */}
      <div
        className="px-3 pb-3 mb-3 border-b"
        style={{ borderColor: "oklch(0.25 0.06 142)" }}
      >
        <div className="phosphor-dim text-xs mb-1">root@itclub:~$</div>
        <div className="phosphor-text text-xs">ls /directories</div>
      </div>

      {/* Nav items */}
      <div className="flex-1 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              type="button"
              key={item.id}
              data-ocid={item.ocid}
              onClick={() => onNavigate(item.id)}
              className={`
                w-full text-left text-xs px-2 py-2 transition-all duration-100 flex items-center gap-2
                ${isActive ? "nav-active" : "hover:bg-phosphor/5"}
              `}
              style={{
                borderLeft: isActive
                  ? "2px solid oklch(0.78 0.22 142)"
                  : "2px solid transparent",
              }}
            >
              {/* Blinking cursor for active item */}
              {isActive ? (
                <span className="amber-bright font-bold">▶</span>
              ) : (
                <span className="phosphor-dim">&nbsp;</span>
              )}
              <span
                className={
                  item.danger
                    ? "red-alert"
                    : isActive
                      ? "phosphor-bright"
                      : "phosphor-text"
                }
                style={
                  item.danger && !isActive
                    ? {
                        color: "oklch(0.65 0.22 28)",
                        textShadow: "0 0 6px oklch(0.65 0.22 28 / 0.5)",
                      }
                    : undefined
                }
              >
                [{item.label}]
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom info */}
      <div
        className="px-3 pt-3 mt-3 border-t space-y-1"
        style={{ borderColor: "oklch(0.2 0.05 142)" }}
      >
        <div className="phosphor-dim text-xs">── SYSTEM ──</div>
        <div className="phosphor-dim text-xs">ver: 2.0.0</div>
        <div className="phosphor-dim text-xs">
          build: <span className="amber-text">STABLE</span>
        </div>
        <div className="phosphor-dim text-xs">arch: ITCLUB-x86</div>
        <div className="phosphor-dim text-xs mt-2">
          Year II Online <span className="cursor-underscore amber-text">_</span>
        </div>
      </div>
    </nav>
  );
}
