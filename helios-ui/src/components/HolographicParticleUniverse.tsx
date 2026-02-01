/**
 * 🌠 HOLOGRAPHIC PARTICLE UNIVERSE
 * 
 * A stunning Three.js powered background effect that creates
 * an immersive holographic particle universe with:
 * - Dynamic particle systems
 * - Nebula-like clouds
 * - Neural network connections
 * - Reactive to system state
 */

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';

// Configuration constants
const UNIVERSE_CONFIG = {
  FOG_COLOR: '#020205',
  FOG_NEAR: 15,
  FOG_FAR: 35,
  AMBIENT_LIGHT_INTENSITY: 0.5,
  CAMERA_POSITION: [0, 0, 20] as [number, number, number],
  CAMERA_FOV: 60,
  PRIMARY_COLOR: '#00f5ff',
  SECONDARY_COLOR: '#9d50bb',
  TERTIARY_COLOR: '#ff00ff',
};

// Particle Universe Core
const ParticleField: React.FC<{ count?: number; color?: string }> = ({ 
  count = 5000, 
  color = UNIVERSE_CONFIG.PRIMARY_COLOR 
}) => {
  const ref = useRef<THREE.Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorObj = new THREE.Color(color);
    
    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 5 + Math.random() * 15;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Gradient colors
      const t = i / count;
      colors[i * 3] = colorObj.r * (0.5 + t * 0.5);
      colors[i * 3 + 1] = colorObj.g * (0.5 + t * 0.5);
      colors[i * 3 + 2] = colorObj.b * (0.5 + t * 0.5);
    }
    
    return [positions, colors];
  }, [count, color]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0005;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        vertexColors
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

// Neural Network Lines
const NeuralConnections: React.FC = () => {
  const linesRef = useRef<THREE.Group>(null);
  
  const connections = useMemo(() => {
    const lines: [THREE.Vector3, THREE.Vector3][] = [];
    const nodeCount = 30;
    const nodes: THREE.Vector3[] = [];
    
    // Generate nodes
    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 8 + Math.random() * 5;
      
      nodes.push(new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      ));
    }
    
    // Generate connections
    nodes.forEach((node, i) => {
      const connectionCount = 2 + Math.floor(Math.random() * 2);
      for (let j = 0; j < connectionCount; j++) {
        const targetIndex = Math.floor(Math.random() * nodeCount);
        if (targetIndex !== i) {
          lines.push([node, nodes[targetIndex]]);
        }
      }
    });
    
    return lines;
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={linesRef}>
      {connections.map((points, i) => (
        <Line
          key={i}
          points={points}
          color="#00f5ff"
          lineWidth={0.5}
          transparent
          opacity={0.2}
        />
      ))}
    </group>
  );
};

// Energy Orb at Center
const EnergyCore: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.5;
      meshRef.current.rotation.y = t * 0.3;
      const scale = 1 + Math.sin(t * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
    
    if (glowRef.current) {
      const scale = 2 + Math.sin(t * 1.5) * 0.3;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* Inner core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.5, 2]} />
        <meshBasicMaterial color="#00f5ff" wireframe />
      </mesh>
      
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#9d50bb"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

// Floating Data Streams
const DataStreams: React.FC = () => {
  const streamsRef = useRef<THREE.Group>(null);
  
  const streamData = useMemo(() => {
    const streams = [];
    const streamCount = 8;
    
    for (let i = 0; i < streamCount; i++) {
      const angle = (i / streamCount) * Math.PI * 2;
      const points: THREE.Vector3[] = [];
      const segments = 50;
      
      for (let j = 0; j < segments; j++) {
        const t = j / segments;
        const radius = 3 + t * 12;
        const spiralAngle = angle + t * Math.PI * 4;
        const height = (t - 0.5) * 10;
        
        points.push(new THREE.Vector3(
          Math.cos(spiralAngle) * radius * 0.3,
          height,
          Math.sin(spiralAngle) * radius * 0.3
        ));
      }
      
      streams.push(points);
    }
    
    return streams;
  }, []);

  useFrame((state) => {
    if (streamsRef.current) {
      streamsRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={streamsRef}>
      {streamData.map((points, i) => (
        <Line
          key={i}
          points={points}
          color={i % 2 === 0 ? '#00f5ff' : '#ff00ff'}
          lineWidth={1}
          transparent
          opacity={0.4}
        />
      ))}
    </group>
  );
};

// Camera Controller
const CameraRig: React.FC = () => {
  const { camera } = useThree();
  
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.1;
    camera.position.x = Math.sin(t) * 2;
    camera.position.z = 20 + Math.cos(t) * 2;
    camera.lookAt(0, 0, 0);
  });
  
  return null;
};

// Main Component
export const HolographicParticleUniverse: React.FC<{
  className?: string;
  particleCount?: number;
  interactive?: boolean;
}> = ({ className = '', particleCount = 5000, interactive = true }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: UNIVERSE_CONFIG.CAMERA_POSITION, fov: UNIVERSE_CONFIG.CAMERA_FOV }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <fog attach="fog" args={[UNIVERSE_CONFIG.FOG_COLOR, UNIVERSE_CONFIG.FOG_NEAR, UNIVERSE_CONFIG.FOG_FAR]} />
        <ambientLight intensity={UNIVERSE_CONFIG.AMBIENT_LIGHT_INTENSITY} />
        
        {/* Main particle field */}
        <ParticleField count={particleCount} color={UNIVERSE_CONFIG.PRIMARY_COLOR} />
        <ParticleField count={Math.floor(particleCount * 0.3)} color={UNIVERSE_CONFIG.SECONDARY_COLOR} />
        <ParticleField count={Math.floor(particleCount * 0.2)} color={UNIVERSE_CONFIG.TERTIARY_COLOR} />
        
        {/* Neural connections */}
        <NeuralConnections />
        
        {/* Central energy core */}
        <EnergyCore />
        
        {/* Spiral data streams */}
        <DataStreams />
        
        {/* Camera animation */}
        <CameraRig />
      </Canvas>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-transparent via-transparent to-[#020205]/80" />
    </div>
  );
};

export default HolographicParticleUniverse;
