import { useEffect, useRef, useState } from "react";
import {
  PORTFOLIO_LOADER_STYLES,
  portfolioLoaderConfig,
} from "../config/setenv";
import "./PortfolioLoader.css";

const SEEN_KEY = "jayant.portfolio.intro.seen.v1";
const CYCLE_KEY = "jayant.portfolio.intro.next-style.v1";

function safeStorage(type) {
  try {
    return type === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function prefersLessMotion() {
  return typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function shouldShowIntro() {
  if (typeof window === "undefined") return false;
  if (portfolioLoaderConfig.mode === "off" || prefersLessMotion()) return false;
  if (portfolioLoaderConfig.replay === "always") return true;
  return safeStorage("session")?.getItem(SEEN_KEY) !== "1";
}

function selectStyles() {
  const choice = portfolioLoaderConfig.mode;
  if (choice === "sequence") return [...PORTFOLIO_LOADER_STYLES];
  if (choice === "random") {
    return [PORTFOLIO_LOADER_STYLES[
      Math.floor(Math.random() * PORTFOLIO_LOADER_STYLES.length)
    ]];
  }
  if (choice === "cycle") {
    const raw = safeStorage("local")?.getItem(CYCLE_KEY);
    const last = Number(raw);
    const index = Number.isInteger(last) && last >= 0
      ? last % PORTFOLIO_LOADER_STYLES.length : 0;
    return [PORTFOLIO_LOADER_STYLES[index]];
  }
  return [choice];
}

function SystemBoot() {
  const lines = [
    ["01", "mounting interface", "OK"],
    ["02", "connecting the pieces", "OK"],
    ["03", "preparing interactions", "OK"],
    ["04", "ready to explore", "READY"],
  ];
  return <div className="intro-system intro-panel">
    <div className="intro-panel-head">
      <span><i className="intro-led"/> JAYANT / INTERFACE</span>
      <span>SYS.001</span>
    </div>
    <div className="intro-system-body">
      <div className="intro-system-command"><span>~</span> launching portfolio<span className="intro-caret">_</span></div>
      <div className="intro-system-logs" aria-hidden="true">
        {lines.map(([number, label, status], index) =>
          <div className="intro-system-line" key={number} style={{ "--item": index }}>
            <span>{number}</span><span>{label}</span><b>{status}</b>
          </div>)}
      </div>
      <div className="intro-system-track"><span/></div>
    </div>
    <div className="intro-panel-foot"><span>CREATIVE ENGINEERING</span><span>BOOT SEQUENCE</span></div>
  </div>;
}

function TypeAssembly() {
  const name = "JAYANT";
  return <div className="intro-type">
    <div className="intro-type-eyebrow"><span>PORTFOLIO / SOFTWARE ENGINEER</span><i/></div>
    <div className="intro-type-word" aria-label={name} aria-hidden="true">
      {Array.from(name).map((character, index) =>
        <span key={index} style={{ "--item": index }}>{character}</span>)}
      <i>.</i>
    </div>
    <div className="intro-type-rule"><span/></div>
    <div className="intro-type-sub">
      <span>BUILT WITH PURPOSE.</span><strong>DESIGNED TO BE EXPLORED.</strong>
    </div>
  </div>;
}

function EngineIgnition() {
  return <div className="intro-ignition">
    <div className="intro-ignition-meta">
      <span>CREATIVE SYSTEMS / 001</span>
      <span><i className="intro-led"/> INITIALIZING</span>
    </div>
    <div className="intro-ignition-stage" aria-hidden="true">
      <div className="intro-orbit orbit-outer"/>
      <div className="intro-orbit orbit-mid"/>
      <div className="intro-orbit orbit-inner"/>
      <div className="intro-ignition-core"><span>j<span>.</span></span></div>
      <div className="intro-orbit-satellite sat-a"/>
      <div className="intro-orbit-satellite sat-b"/>
      <div className="intro-ignition-cross cross-a">+</div>
      <div className="intro-ignition-cross cross-b">+</div>
      <div className="intro-ignition-pulse"/>
    </div>
    <div className="intro-ignition-status">
      <span>COMPLEXITY → CLARITY</span>
      <div className="intro-ignition-meter"><i/></div>
      <span>ENGINE ONLINE</span>
    </div>
  </div>;
}

function CommitSequence() {
  const commits = [
    ["01", "idea", "find the problem"],
    ["02", "build", "make it work"],
    ["03", "refine", "make it better"],
    ["04", "ship", "make it real"],
  ];
  return <div className="intro-commit intro-panel">
    <div className="intro-panel-head">
      <span><i className="intro-led"/> DEVELOPMENT LOG</span><span>MAIN / PORTFOLIO</span>
    </div>
    <div className="intro-commit-top">
      <span className="intro-commit-prompt">~/portfolio</span>
      <span>$ git log --oneline</span>
    </div>
    <div className="intro-commit-list" aria-hidden="true">
      {commits.map(([hash, title, detail], index) =>
        <div className="intro-commit-row" key={hash} style={{ "--item": index }}>
          <span className="intro-commit-node"/>
          <code>{hash}</code>
          <strong>{title}</strong>
          <span>{detail}</span>
        </div>)}
    </div>
    <div className="intro-commit-branch"><span>●</span> READY TO EXPLORE <span className="intro-caret">_</span></div>
    <div className="intro-panel-foot"><span>ONE IDEA AT A TIME</span><span>BUILD → REFINE → SHIP</span></div>
  </div>;
}

const VARIANTS = {
  system: SystemBoot,
  type: TypeAssembly,
  ignition: EngineIgnition,
  commit: CommitSequence,
};

/**
 * Four configurable introductory animations. The overlay is deliberately
 * independent from resource fetching: it never displays fake download %
 * progress or waits indefinitely for external assets.
 *
 * The default experience is once per browser tab, with Skip / Escape and
 * no animation for users who prefer reduced motion.
 */
export default function PortfolioLoader() {
  const [initial] = useState(() => ({
    show: shouldShowIntro(),
    styles: selectStyles(),
  }));
  const [isVisible, setIsVisible] = useState(initial.show);
  const [isExiting, setIsExiting] = useState(false);
  const [index, setIndex] = useState(0);
  const skipRef = useRef(null);
  const onExitRef = useRef(false);

  const config = portfolioLoaderConfig;
  const currentStyle = initial.styles[index] || initial.styles[0];
  const CurrentVariant = VARIANTS[currentStyle] || EngineIgnition;

  useEffect(() => {
    if (!isVisible) return undefined;
    const storage = safeStorage("session");
    if (config.replay === "session") {
      storage?.setItem(SEEN_KEY, "1");
    }

    // Keep keyboard focus inside the intro. Restore the untouched content
    // and previous scroll settings as soon as the overlay is removed.
    const app = document.querySelector(".v2-root");
    const overlay = document.querySelector(".v2-intro-overlay");
    const children = [...(app?.children || [])].filter((el) => el !== overlay);
    const oldStates = children.map((el) => [el, el.inert]);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    for (const [child] of oldStates) child.inert = true;
    if (config.skipEnabled) skipRef.current?.focus({ preventScroll: true });

    return () => {
      document.body.style.overflow = previousOverflow;
      for (const [child, inert] of oldStates) child.inert = inert;
    };
  }, [isVisible, config.replay, config.skipEnabled]);

  useEffect(() => {
    if (!isVisible || isExiting) return undefined;
    const timer = window.setTimeout(() => {
      if (index < initial.styles.length - 1) {
        setIndex((prev) => prev + 1);
      } else {
        setIsExiting(true);
      }
    }, config.durationMs);
    return () => clearTimeout(timer);
  }, [index, initial.styles.length, config.durationMs, isVisible, isExiting]);

  useEffect(() => {
    if (!isExiting || !isVisible) return undefined;
    const timer = window.setTimeout(() => setIsVisible(false), config.exitMs);
    return () => clearTimeout(timer);
  }, [config.exitMs, isExiting, isVisible]);

  useEffect(() => {
    if (!isVisible || !config.skipEnabled) return undefined;
    const keydown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsExiting(true);
      }
    };
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, [config.skipEnabled, isVisible]);

  useEffect(() => {
    if (!isVisible || onExitRef.current) return;
    // Cycle advances only after the intro has been seen; StrictMode
    // re-running effects must not consume an extra style.
    if (config.mode === "cycle") {
      onExitRef.current = true;
      const store = safeStorage("local");
      const raw = Number(store?.getItem(CYCLE_KEY) ?? 0);
      store?.setItem(CYCLE_KEY, String((Number.isFinite(raw) ? raw : 0) + 1));
    }
  }, [isVisible, config.mode]);

  if (!isVisible) return null;

  return <div
    className={"v2-intro-overlay" + (isExiting ? " is-exiting" : "")}
    role="dialog"
    aria-modal="true"
    aria-label="Portfolio introduction"
    data-loader-mode={currentStyle}
    data-loader-count={initial.styles.length}
    style={{
      "--intro-duration": config.durationMs + "ms",
      "--intro-exit": config.exitMs + "ms",
    }}
  >
    <div className="v2-intro-backdrop" aria-hidden="true"/>
    <div className="v2-intro-frame" aria-hidden="true">
      <span>J / 26</span><span>BUILDING DIGITAL EXPERIENCES</span>
    </div>
    <div className="v2-intro-content" key={currentStyle}>
      <CurrentVariant/>
    </div>
    <div className="v2-intro-bottom">
      <span>JAYANT SINGH © 2026</span>
      <span aria-live="polite">{currentStyle.toUpperCase()} / {String(index + 1).padStart(2, "0")}</span>
    </div>
    {config.skipEnabled &&
      <button className="v2-intro-skip" type="button" ref={skipRef}
        onClick={() => setIsExiting(true)}>
        SKIP INTRO <span aria-hidden="true">↗</span>
      </button>}
  </div>;
}
