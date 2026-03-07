import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import {
  useAddWishlist,
  useGetWishlistCount,
  useIsProjectRevealed,
  useIsWishlisted,
  useRemoveWishlist,
} from "../../hooks/useQueries";

const DECRYPT_THRESHOLD = 200;

// Characters for encrypted display
const ENCRYPT_CHARS = "0123456789ABCDEF";
const HEX_NOISE = () =>
  ENCRYPT_CHARS[Math.floor(Math.random() * ENCRYPT_CHARS.length)];
const BINARY_NOISE = () => (Math.random() > 0.5 ? "1" : "0");

function generateEncryptedBlock(rows = 12, cols = 60): string[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => {
      const r = Math.random();
      if (r < 0.3) return HEX_NOISE();
      if (r < 0.5) return BINARY_NOISE();
      if (r < 0.55) return " ";
      return HEX_NOISE();
    }),
  );
}

// "PRAGATI" hidden in the noise at certain positions
const HIDDEN_WORD = "PRAGATI";

function useEncryptedDisplay(revealed: boolean) {
  const [grid, setGrid] = useState(() => generateEncryptedBlock());
  const [flashIndex, setFlashIndex] = useState(0);

  useEffect(() => {
    if (revealed) return;
    const interval = setInterval(() => {
      setGrid((prev) => {
        const next = prev.map((row) =>
          row.map((char) => {
            if (Math.random() < 0.15) return HEX_NOISE();
            if (Math.random() < 0.05) return BINARY_NOISE();
            return char;
          }),
        );
        // Occasionally reveal parts of PRAGATI
        const row = Math.floor(Math.random() * 12);
        const col = Math.floor(Math.random() * (60 - HIDDEN_WORD.length));
        if (Math.random() < 0.08) {
          const chars = [...next[row]];
          for (let i = 0; i < HIDDEN_WORD.length; i++) {
            chars[col + i] = HIDDEN_WORD[i];
          }
          next[row] = chars;
        }
        return next;
      });
      setFlashIndex((f) => (f + 1) % 60);
    }, 80);
    return () => clearInterval(interval);
  }, [revealed]);

  return { grid, flashIndex };
}

function renderEncryptedRow(row: string[]): string {
  return row.join("");
}

function EncryptedBlock({
  wishlistCount,
  revealed,
}: { wishlistCount: number; revealed: boolean }) {
  const { grid } = useEncryptedDisplay(revealed);
  const decryptProgress = Math.min(1, wishlistCount / DECRYPT_THRESHOLD);

  if (revealed) return null;

  return (
    <div
      className="terminal-border p-3 overflow-hidden"
      style={{
        background: "oklch(0.06 0.03 28 / 0.3)",
        borderColor: "oklch(0.45 0.18 28)",
        fontFamily: "monospace",
        fontSize: "10px",
        lineHeight: "1.4",
        userSelect: "none",
        color: "oklch(0.45 0.18 28)",
        textShadow: "0 0 3px oklch(0.45 0.18 28 / 0.4)",
      }}
    >
      {grid.map((row, ri) => {
        const lineText = renderEncryptedRow(row);
        const isDecrypting = ri / 12 < decryptProgress * 0.8;
        return (
          <div
            key={`enc-row-${ri}-${lineText.slice(0, 4)}`}
            className="whitespace-pre"
            style={{
              color: isDecrypting
                ? "oklch(0.55 0.12 142)"
                : "oklch(0.45 0.18 28)",
              transition: "color 0.3s",
            }}
          >
            {lineText}
          </div>
        );
      })}
    </div>
  );
}

function DecryptionReveal() {
  const [showContent, setShowContent] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => {
      setPhase(3);
      setShowContent(true);
    }, 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className={`space-y-6 ${phase >= 1 ? "decrypt-reveal" : ""}`}>
      {/* Dramatic header */}
      <div
        className="terminal-border p-4 text-center space-y-2"
        style={{
          background: "oklch(0.08 0.04 142 / 0.5)",
          borderColor: "oklch(0.78 0.22 142)",
          boxShadow:
            "0 0 30px oklch(0.78 0.22 142 / 0.3), inset 0 0 30px oklch(0.78 0.22 142 / 0.05)",
        }}
      >
        <div className="phosphor-bright text-xl font-bold tracking-[0.3em]">
          ████ DECRYPTION COMPLETE ████
        </div>
        <div className="amber-text text-sm">
          ALL 200 NODES CONNECTED -- ENCRYPTION BROKEN
        </div>
        <div className="phosphor-dim text-xs">
          [SUCCESS] Project PRAGATI declassified at{" "}
          {new Date().toLocaleString("en-US", { hour12: false })}
        </div>
      </div>

      {showContent && (
        <div
          className="terminal-border p-6 space-y-4 log-appear"
          style={{
            background: "oklch(0.08 0.03 142 / 0.6)",
            borderColor: "oklch(0.6 0.15 142)",
          }}
        >
          <div className="phosphor-dim text-xs">
            cat /secret/PRAGATI_2.0.txt
          </div>
          <div
            className="h-px w-full"
            style={{ background: "oklch(0.4 0.1 142 / 0.4)" }}
          />

          <div className="space-y-3 text-sm">
            <div className="flex gap-4">
              <span className="phosphor-dim w-28 flex-none">PROJECT:</span>
              <span className="phosphor-bright font-bold text-lg tracking-widest">
                PRAGATI 2.0
              </span>
            </div>
            <div className="flex gap-4">
              <span className="phosphor-dim w-28 flex-none">
                CLASSIFICATION:
              </span>
              <span
                className="font-bold"
                style={{
                  color: "oklch(0.78 0.22 142)",
                  textShadow: "0 0 6px oklch(0.78 0.22 142 / 0.5)",
                }}
              >
                DECLASSIFIED
              </span>
            </div>
            <div className="flex gap-4">
              <span className="phosphor-dim w-28 flex-none">TYPE:</span>
              <span className="phosphor-text">Annual Tech Festival</span>
            </div>
            <div className="flex gap-4 items-start">
              <span className="phosphor-dim w-28 flex-none">DESCRIPTION:</span>
              <span className="phosphor-text leading-relaxed">
                ITCLUB's biggest event yet. A full-scale annual tech festival
                featuring hackathons, workshops, speaker sessions, and project
                showcases. Open to all students.
              </span>
            </div>
            <div className="flex gap-4">
              <span className="phosphor-dim w-28 flex-none">LAUNCH:</span>
              <span className="amber-text font-bold">2026</span>
            </div>
            <div className="flex gap-4">
              <span className="phosphor-dim w-28 flex-none">STATUS:</span>
              <span
                className="font-bold"
                style={{
                  color: "oklch(0.76 0.16 75)",
                  textShadow: "0 0 6px oklch(0.76 0.16 75 / 0.5)",
                }}
              >
                IN DEVELOPMENT ████████░░░░
              </span>
            </div>
          </div>

          <div
            className="h-px w-full mt-4"
            style={{ background: "oklch(0.3 0.07 142 / 0.4)" }}
          />
          <div className="phosphor-dim text-xs">
            {
              "// Stay tuned. ITCLUB is building the future, one event at a time."
            }
          </div>
        </div>
      )}
    </div>
  );
}

export default function RestrictedSection() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const { data: wishlistCount = BigInt(0), isLoading: countLoading } =
    useGetWishlistCount();
  const { data: isWishlisted = false } = useIsWishlisted();
  const { data: isRevealed = false } = useIsProjectRevealed();

  const addWishlist = useAddWishlist();
  const removeWishlist = useRemoveWishlist();

  const count = Number(wishlistCount);
  const progressPct = Math.min(100, (count / DECRYPT_THRESHOLD) * 100);
  const remaining = Math.max(0, DECRYPT_THRESHOLD - count);

  const [showRevealAnimation, setShowRevealAnimation] = useState(false);
  const [prevRevealed, setPrevRevealed] = useState(false);

  useEffect(() => {
    if (isRevealed && !prevRevealed) {
      setShowRevealAnimation(true);
    }
    setPrevRevealed(isRevealed);
  }, [isRevealed, prevRevealed]);

  const handleWishlist = useCallback(async () => {
    if (!isLoggedIn) {
      login();
      return;
    }
    try {
      if (isWishlisted) {
        await removeWishlist.mutateAsync();
        toast.success("NODE DISCONNECTED. Support withdrawn.");
      } else {
        await addWishlist.mutateAsync();
        toast.success("NODE REGISTERED. Decryption progress updated.");
      }
    } catch {
      toast.error("CONNECTION FAILED. Try again.");
    }
  }, [isLoggedIn, login, isWishlisted, addWishlist, removeWishlist]);

  const isMutating = addWishlist.isPending || removeWishlist.isPending;

  if (isRevealed || showRevealAnimation) {
    return (
      <div data-ocid="restricted.section" className="max-w-4xl">
        <DecryptionReveal />
      </div>
    );
  }

  return (
    <div data-ocid="restricted.section" className="max-w-4xl space-y-6">
      {/* Terminal prompt */}
      <div className="section-prompt">
        <span className="phosphor-dim">root@itclub:~$</span>{" "}
        <span className="red-alert">cd /restricted</span>
      </div>

      {/* Access denied header */}
      <div
        className="border p-4 text-center space-y-2"
        style={{
          borderColor: "oklch(0.55 0.2 28)",
          background: "oklch(0.08 0.04 28 / 0.2)",
          boxShadow: "0 0 20px oklch(0.55 0.2 28 / 0.15)",
        }}
      >
        <div
          className="text-xl font-bold tracking-widest"
          style={{
            color: "oklch(0.7 0.22 28)",
            textShadow: "0 0 10px oklch(0.7 0.22 28 / 0.6)",
          }}
        >
          ▓▓ ACCESS RESTRICTED ▓▓
        </div>
        <div
          className="text-xs font-bold"
          style={{ color: "oklch(0.6 0.18 28)" }}
        >
          ■ ENCRYPTION ACTIVE ■ CLEARANCE REQUIRED ■ PUBLIC SUPPORT NEEDED ■
        </div>
      </div>

      {/* Warning messages */}
      <div
        className="border p-3 text-xs space-y-1"
        style={{
          borderColor: "oklch(0.4 0.14 28)",
          background: "oklch(0.07 0.02 28 / 0.2)",
        }}
      >
        <div style={{ color: "oklch(0.6 0.18 28)" }}>
          [ERROR 403] FORBIDDEN -- This directory is encrypted.
        </div>
        <div style={{ color: "oklch(0.55 0.15 28)" }}>
          [INFO] Collective decryption protocol initiated.
        </div>
        <div style={{ color: "oklch(0.5 0.12 28)" }}>
          [INFO] {DECRYPT_THRESHOLD} node connections required to decrypt
          payload.
        </div>
        <div className="phosphor-dim">
          [INFO] Current connections: {countLoading ? "..." : count} /{" "}
          {DECRYPT_THRESHOLD}
        </div>
      </div>

      {/* Encrypted data block */}
      <EncryptedBlock wishlistCount={count} revealed={false} />

      {/* Decryption progress */}
      <div
        data-ocid="secret.progress.panel"
        className="terminal-border p-4 space-y-3"
        style={{
          background: "oklch(0.08 0.02 142 / 0.4)",
          borderColor: "oklch(0.4 0.1 142)",
        }}
      >
        <div className="flex items-center justify-between text-xs">
          <span className="amber-text font-bold">DECRYPTION PROGRESS</span>
          <span className="phosphor-bright font-bold">
            {count} / {DECRYPT_THRESHOLD} NODES
          </span>
        </div>

        {/* Custom progress bar */}
        <div
          className="relative h-6 border overflow-hidden"
          style={{
            borderColor: "oklch(0.4 0.1 142)",
            background: "oklch(0.07 0.01 142)",
          }}
        >
          <div
            className="h-full transition-all duration-500 progress-glow"
            style={{
              width: `${progressPct}%`,
              background:
                "linear-gradient(90deg, oklch(0.5 0.12 142), oklch(0.85 0.22 142))",
              boxShadow: "0 0 10px oklch(0.78 0.22 142 / 0.6)",
            }}
          />
          <div
            className="absolute inset-0 flex items-center justify-center text-xs font-bold"
            style={{
              color:
                progressPct > 50 ? "oklch(0.07 0 0)" : "oklch(0.78 0.22 142)",
              textShadow:
                progressPct > 50
                  ? "none"
                  : "0 0 6px oklch(0.78 0.22 142 / 0.7)",
            }}
          >
            {progressPct.toFixed(1)}% DECRYPTED
          </div>
        </div>

        <div className="text-xs phosphor-dim">
          {remaining > 0
            ? `${remaining} more nodes needed to complete decryption`
            : "Decryption threshold reached!"}
        </div>

        {/* Block character progress visual */}
        <div className="text-xs phosphor-dim overflow-x-auto whitespace-nowrap">
          [
          <span className="phosphor-bright">
            {"█".repeat(Math.floor(progressPct / 5))}
          </span>
          <span className="phosphor-dim">
            {"░".repeat(20 - Math.floor(progressPct / 5))}
          </span>
          ] {count}/{DECRYPT_THRESHOLD}
        </div>
      </div>

      {/* Action area */}
      <div
        className="terminal-border p-6 space-y-4 text-center"
        style={{
          background: "oklch(0.08 0.02 142 / 0.3)",
        }}
      >
        {!isLoggedIn ? (
          <div className="space-y-3">
            <div className="phosphor-text text-sm">
              AUTHENTICATION REQUIRED TO CONTRIBUTE TO DECRYPTION
            </div>
            <div className="phosphor-dim text-xs">
              Connect your identity to register as a decryption node
            </div>
            <button
              type="button"
              className="btn-terminal btn-amber text-sm px-6 py-2"
              onClick={login}
              disabled={loginStatus === "logging-in"}
            >
              {loginStatus === "logging-in"
                ? "[ AUTHENTICATING... ]"
                : "[ CONNECT IDENTITY ]"}
            </button>
          </div>
        ) : isWishlisted ? (
          <div className="space-y-3">
            <div
              className="font-bold text-sm tracking-wider"
              style={{
                color: "oklch(0.78 0.22 142)",
                textShadow: "0 0 8px oklch(0.78 0.22 142 / 0.7)",
              }}
            >
              ✓ NODE REGISTERED
            </div>
            <div className="phosphor-text text-xs">
              Your node is connected. Awaiting {remaining} more peers.
            </div>
            <div className="phosphor-dim text-xs">
              IDENTITY: {identity?.getPrincipal().toString().slice(0, 16)}...
            </div>
            <div className="phosphor-dim text-xs">AWAITING PEERS...</div>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                type="button"
                data-ocid="secret.wishlist.button"
                className="btn-terminal text-xs px-4 py-1.5 opacity-70 cursor-default"
                disabled
              >
                [ NODE REGISTERED. AWAITING PEERS. ]
              </button>
              <button
                type="button"
                className="btn-terminal text-xs px-4 py-1.5"
                style={{
                  borderColor: "oklch(0.55 0.2 28)",
                  color: "oklch(0.65 0.2 28)",
                }}
                onClick={handleWishlist}
                disabled={isMutating}
              >
                {isMutating ? "[ DISCONNECTING... ]" : "[ DISCONNECT NODE ]"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="amber-text text-sm font-bold">
              ⚡ CONTRIBUTE TO DECRYPTION
            </div>
            <div className="phosphor-text text-xs leading-relaxed">
              This project is encrypted. {DECRYPT_THRESHOLD} nodes must connect
              to unlock the secret. Be part of the decryption collective.
            </div>
            <div className="phosphor-dim text-xs">
              IDENTITY: {identity?.getPrincipal().toString().slice(0, 16)}...
            </div>
            <button
              type="button"
              data-ocid="secret.wishlist.button"
              className="btn-terminal btn-amber text-sm px-8 py-3 font-bold tracking-wider"
              onClick={handleWishlist}
              disabled={isMutating}
            >
              {isMutating
                ? "[ CONNECTING NODE... ]"
                : "[ ADD TO DECRYPTION QUEUE ]"}
            </button>
            <div className="phosphor-dim text-xs">
              ↑ CLICK TO REGISTER YOUR NODE AND HELP DECRYPT THIS PROJECT
            </div>
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="text-xs phosphor-dim text-center">
        <span style={{ color: "oklch(0.5 0.15 28)" }}>⚠ WARNING:</span>{" "}
        Unauthorized access attempts are logged and monitored.
        <br />
        This is a collective decryption effort. Support public interest. Vote to
        reveal.
      </div>
    </div>
  );
}
