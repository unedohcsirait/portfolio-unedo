"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";

function StarBackground(props: any) {
  const ref = useRef<any>(null);
  
  // Generate random points in a sphere without relying on external maath library
  const sphere = useMemo(() => {
    const points = new Float32Array(5001); // Size must be a multiple of 3!
    for (let i = 0; i < 5001; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = Math.cbrt(Math.random()) * 1.2;
      
      points[i] = r * Math.sin(phi) * Math.cos(theta);
      points[i+1] = r * Math.sin(phi) * Math.sin(theta);
      points[i+2] = r * Math.cos(phi);
    }
    return points;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere as Float32Array} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function Background3D() {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none" }}>
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]} gl={{ powerPreference: "high-performance", antialias: false }}>
        <StarBackground />
      </Canvas>
    </div>
  );
}
