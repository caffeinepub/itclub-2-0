import { type FormEvent, useState } from "react";
import { useAdmin } from "../context/AdminContext";

interface AdminAuthPageProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdminAuthPage({
  onSuccess,
  onCancel,
}: AdminAuthPageProps) {
  const { login } = useAdmin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [attempting, setAttempting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(false);
    setAttempting(true);

    // Simulate a brief auth delay for retro feel
    setTimeout(() => {
      const ok = login(username, password);
      setAttempting(false);
      if (ok) {
        onSuccess();
      } else {
        setError(true);
        setShaking(true);
        setTimeout(() => setShaking(false), 600);
      }
    }, 400);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6" style={{ paddingTop: "2rem" }}>
      {/* Sudo prompt lines */}
      <div className="text-xs space-y-1">
        <div>
          <span className="phosphor-dim">root@itclub:~$</span>{" "}
          <span className="phosphor-text">sudo su admin</span>
        </div>
        <div className="phosphor-dim">[sudo] password for admin:</div>
        <div className="phosphor-dim">
          Authenticating... <span className="cursor-blink" />
        </div>
      </div>

      {/* Auth box */}
      <div
        className={`terminal-border p-6 space-y-5 ${shaking ? "auth-shake" : ""}`}
        style={{
          background: "oklch(0.07 0.02 142 / 0.6)",
          borderColor: error ? "oklch(0.55 0.2 28)" : "oklch(0.45 0.1 142)",
          boxShadow: error
            ? "0 0 20px oklch(0.55 0.2 28 / 0.25)"
            : "0 0 20px oklch(0.4 0.1 142 / 0.2)",
          transition: "border-color 0.3s, box-shadow 0.3s",
        }}
      >
        {/* Header */}
        <div className="space-y-1 text-xs">
          <div className="amber-text font-bold tracking-widest">
            ╔══ ADMIN AUTHENTICATION REQUIRED ══╗
          </div>
          <div className="phosphor-dim pl-2">ACCESS LEVEL: RESTRICTED</div>
          <div className="phosphor-dim pl-2">
            CLEARANCE: ROOT / ADMIN / DEV_LEAD ONLY
          </div>
          <div className="amber-text">
            ╚════════════════════════════════════╝
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="space-y-1">
            <label
              htmlFor="admin-username"
              className="phosphor-dim text-xs tracking-widest"
            >
              USERNAME:
            </label>
            <div className="flex items-center gap-2 text-xs">
              <span className="phosphor-dim">&gt;</span>
              <input
                id="admin-username"
                data-ocid="admin.auth.username.input"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(false);
                }}
                autoComplete="off"
                spellCheck={false}
                className="terminal-input flex-1"
                style={{
                  caretColor: "oklch(0.85 0.22 142)",
                  letterSpacing: "0.08em",
                }}
                placeholder="enter username_"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label
              htmlFor="admin-password"
              className="phosphor-dim text-xs tracking-widest"
            >
              PASSWORD:
            </label>
            <div className="flex items-center gap-2 text-xs">
              <span className="phosphor-dim">&gt;</span>
              <input
                id="admin-password"
                data-ocid="admin.auth.password.input"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                autoComplete="off"
                className="terminal-input flex-1"
                style={{
                  caretColor: "oklch(0.85 0.22 142)",
                  letterSpacing: "0.15em",
                }}
                placeholder="••••••••••••"
              />
            </div>
          </div>

          {/* Error state */}
          {error && (
            <div
              data-ocid="admin.auth.error_state"
              className="text-xs font-bold tracking-widest text-center py-2 border"
              style={{
                color: "oklch(0.7 0.22 28)",
                borderColor: "oklch(0.55 0.2 28)",
                background: "oklch(0.08 0.04 28 / 0.3)",
                textShadow: "0 0 8px oklch(0.7 0.22 28 / 0.8)",
                animation: "error-blink 0.8s ease-in-out 3",
              }}
            >
              ⚠ ACCESS DENIED -- WRONG CREDENTIALS ⚠
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              data-ocid="admin.auth.submit_button"
              className="btn-terminal flex-1 py-2 text-xs font-bold tracking-widest"
              disabled={attempting || !username || !password}
              style={{
                borderColor: "oklch(0.6 0.15 142)",
                color: "oklch(0.88 0.22 142)",
              }}
            >
              {attempting ? "[ AUTHENTICATING... ]" : "[ AUTHENTICATE ]"}
            </button>
            <button
              type="button"
              data-ocid="admin.auth.cancel_button"
              className="btn-terminal px-6 py-2 text-xs tracking-widest"
              onClick={onCancel}
              disabled={attempting}
              style={{
                borderColor: "oklch(0.45 0.15 28)",
                color: "oklch(0.65 0.2 28)",
              }}
            >
              [ CANCEL ]
            </button>
          </div>
        </form>
      </div>

      {/* Security notice */}
      <div className="text-xs phosphor-dim text-center space-y-1">
        <div>
          ── <span className="amber-text">SECURE TERMINAL</span> ──
        </div>
        <div>All authentication attempts are logged and time-stamped.</div>
        <div>
          Session: {new Date().toLocaleString("en-US", { hour12: false })}
        </div>
      </div>

      <style>{`
        @keyframes error-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes auth-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .auth-shake {
          animation: auth-shake 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
