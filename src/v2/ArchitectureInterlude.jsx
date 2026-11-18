import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * The architecture interlude: a scroll-linked, accessible narrative.
 * All copy remains readable without JavaScript animation; transforms never
 * affect the layout of essential content.
 */
export default function ArchitectureInterlude() {
  const container = useRef(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });
  const rotation = useTransform(scrollYProgress, [0, 1], [-75, 75]);
  const drift = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const lineScale = useTransform(scrollYProgress, [0.1, 0.86], [0.05, 1]);
  return <section aria-label="Engineering philosophy" ref={container} className="v2-method">
    <div className="v2-method-sticky">
      <div className="v2-container v2-method-layout">
        <div className="v2-method-copy">
          <div className="v2-method-number">THE APPROACH / 001 <span>✳</span></div>
          <h2>Think in<br/>systems<span>.</span></h2>
          <p>Every pixel is a decision. Every interaction is a contract. And every clean abstraction makes the next good idea easier to build.</p>
          <div className="v2-method-steps">
            <div><span>01 / UNDERSTAND</span><strong>Start with the real problem.</strong></div>
            <div><span>02 / DESIGN</span><strong>Make the complicated feel intentional.</strong></div>
            <div><span>03 / SHIP</span><strong>Keep it fast, resilient and usable.</strong></div>
          </div>
        </div>
        <div className="v2-method-visual" aria-hidden="true">
          <div className="v2-method-grid"/>
          <motion.div className="v2-method-diagram" style={reducedMotion ? undefined : { rotate: rotation, y: drift }}>
            <div className="v2-method-ring ring-one"/>
            <div className="v2-method-ring ring-two"/>
            <div className="v2-method-ring ring-three"/>
            <div className="v2-method-core">✳</div>
            <div className="v2-method-node node-a">01</div>
            <div className="v2-method-node node-b">02</div>
            <div className="v2-method-node node-c">03</div>
          </motion.div>
          <motion.div className="v2-method-line" style={reducedMotion ? undefined : { scaleX: lineScale }}/>
          <span className="v2-method-signature">SIMPLICITY IS HARD-WON.</span>
        </div>
      </div>
    </div>
  </section>;
}
