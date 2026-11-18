import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

// Procedural complexity engine: deconstruct the form into six smaller modules.
// No external 3D files and no decorative globe textures are downloaded.
function Engine({ expanded }) {
  const group = useRef();
  const core = useRef();
  const hoops = useRef();
  const pieces = useRef([]);
  useFrame(({ pointer }, delta) => {
    if (!group.current || !core.current || !hoops.current) return;
    group.current.rotation.y += delta * 0.12;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, 0.2 + pointer.y * 0.15, 2, delta);
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, pointer.x * -0.08, 2, delta);
    const scale = THREE.MathUtils.damp(core.current.scale.x, expanded ? 0.49 : 1, 4, delta);
    core.current.scale.setScalar(scale);
    const ringScale = THREE.MathUtils.damp(hoops.current.scale.x, expanded ? 1.18 : 1, 4, delta);
    hoops.current.scale.setScalar(ringScale);
    pieces.current.forEach((mesh, index) => {
      if (!mesh) return;
      const angle = Math.PI * 2 * index / 6;
      const r = expanded ? 2.42 : 1.23;
      mesh.position.x = THREE.MathUtils.damp(mesh.position.x, Math.cos(angle) * r, 4, delta);
      mesh.position.y = THREE.MathUtils.damp(mesh.position.y, Math.sin(angle) * r * 0.6, 4, delta);
      mesh.position.z = THREE.MathUtils.damp(mesh.position.z, expanded ? (index % 2 ? -0.5 : 0.5) : 0, 4, delta);
      mesh.rotation.y += delta * 0.14;
    });
  });
  return <group ref={group} rotation={[0.25, -0.5, 0]}>
    <Float speed={1.25} rotationIntensity={0.08} floatIntensity={0.08}>
      <mesh ref={core}>
        <torusKnotGeometry args={[1.1, 0.25, 112, 12, 2, 5]} />
        <meshPhysicalMaterial color="#d4f98d" roughness={0.23} metalness={0.4} clearcoat={0.85} />
      </mesh>
    </Float>
    <group ref={hoops}>
      <mesh rotation={[1.12, 0.2, 0.1]}><torusGeometry args={[1.6, 0.008, 5, 100]} /><meshBasicMaterial color="#d4eac0" transparent opacity={0.72} /></mesh>
      <mesh rotation={[0.36, -0.52, -0.63]}><torusGeometry args={[1.86, 0.012, 5, 120]} /><meshBasicMaterial color="#b9cfae" transparent opacity={0.55} /></mesh>
      <mesh rotation={[1.65, 0, 0.2]}><torusGeometry args={[2.03, 0.004, 5, 120]} /><meshBasicMaterial color="#ecfbdc" transparent opacity={0.32} /></mesh>
    </group>
    {Array.from({ length: 6 }, (_, i) => {
      const a = i * Math.PI * 2 / 6;
      return <group key={i} ref={(node) => { pieces.current[i] = node; }} position={[Math.cos(a) * 1.23, Math.sin(a) * 0.74, 0]}>
        <mesh rotation={[i * 0.3, i * 0.4, i * 0.25]}>
          <octahedronGeometry args={[0.14, 0]} />
          <meshStandardMaterial color={i % 2 ? "#c0cee4" : "#ecffbd"} roughness={0.25} metalness={0.4} />
        </mesh>
      </group>;
    })}
  </group>;
}

export default function PortfolioScene({ expanded, active = true }) {
  return <Canvas aria-hidden="true" dpr={[1, 1.25]} frameloop={active ? "always" : "never"}
    camera={{ fov: 38, near: 0.1, far: 100, position: [0, 0, 8.2] }}
    gl={{ alpha: true, antialias: true, powerPreference: "default" }}>
    <ambientLight intensity={1.5} />
    <directionalLight color="#eaf9d9" position={[3, 5, 4]} intensity={2.3} />
    <pointLight color="#9fbbff" position={[-4, -2, 3]} intensity={20} distance={11} />
    <Engine expanded={expanded} />
  </Canvas>;
}
