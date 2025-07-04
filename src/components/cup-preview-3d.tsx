'use client';

import * as THREE from 'three';
import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Decal, useTexture } from '@react-three/drei';
import type { CupModel, GeneratedArt } from '@/lib/types';
import { DEGRADE_HEX_COLORS, RIM_COLORS } from '@/lib/cup-data';

interface CupPreview3DProps {
  cupModel: CupModel;
  art: GeneratedArt | null;
}

// Helper to create a gradient texture for the cup body
function createGradientTexture(color1: string, color2: string, position: 'Cima' | 'Baixo') {
  const canvas = document.createElement('canvas');
  canvas.width = 2;
  canvas.height = 256;
  const context = canvas.getContext('2d')!;
  const gradient = context.createLinearGradient(0, 0, 0, 256);

  if (position === 'Cima') {
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
  } else {
    gradient.addColorStop(0, color2);
    gradient.addColorStop(1, color1);
  }

  context.fillStyle = gradient;
  context.fillRect(0, 0, 2, 256);
  return new THREE.CanvasTexture(canvas);
}

function CupMesh({ cupModel, art }: CupPreview3DProps) {
  const meshRef = useRef<THREE.Group>(null);
  const artTexture = useTexture(art?.imageUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');

  // Define cup geometry based on its name
  let geometry: THREE.BufferGeometry = new THREE.CylinderGeometry(0.4, 0.3, 1.5, 32); 
  let rimGeometry: THREE.BufferGeometry | null = new THREE.TorusGeometry(0.4, 0.02, 16, 64);
  let decalPosition = new THREE.Vector3(0, 0, 0.4);
  let decalScale = new THREE.Vector3(0.7, 0.7, 1);

  switch (cupModel.name) {
    case 'Copo Twister com Tampa':
      geometry = new THREE.CylinderGeometry(0.45, 0.35, 1.4, 32);
      rimGeometry = new THREE.TorusGeometry(0.45, 0.02, 16, 64);
      decalPosition = new THREE.Vector3(0, -0.1, 0.45);
      decalScale = new THREE.Vector3(0.8, 0.6, 1);
      break;
    case 'Copo Caldereta':
      geometry = new THREE.CylinderGeometry(0.45, 0.38, 1.2, 32);
      rimGeometry = new THREE.TorusGeometry(0.45, 0.02, 16, 64);
      decalPosition = new THREE.Vector3(0, 0, 0.45);
      decalScale = new THREE.Vector3(0.8, 0.8, 1);
      break;
    case 'Taça Gin':
      geometry = new THREE.SphereGeometry(0.6, 32, 32, 0, Math.PI * 2, 0, Math.PI * 1.8);
      rimGeometry = new THREE.TorusGeometry(0.6, 0.02, 16, 64);
      decalPosition = new THREE.Vector3(0, 0, 0.6);
      decalScale = new THREE.Vector3(0.8, 0.8, 1);
      break;
  }
   // Adjust rim position to be at the top of the geometry
  if (rimGeometry && 'parameters' in geometry) {
    const geoParams = geometry.parameters;
    const rimY = (geoParams.height || 1.5) / 2;
    rimGeometry.translate(0, rimY, 0);
  }
   if (rimGeometry && cupModel.name === 'Taça Gin') {
      rimGeometry.translate(0, 0.05, 0); // slight adjustment for sphere
   }

  // Define materials
  const isTransparent = cupModel.opacityType === 'Transparente';
  const hasDegrade = cupModel.degradeColor && cupModel.degradeColor !== 'Nenhum';

  let map = null;
  if (hasDegrade) {
      const degradeColorHex = DEGRADE_HEX_COLORS[cupModel.degradeColor!];
      const baseColor = isTransparent ? 'rgba(255, 255, 255, 0.0)' : '#FFFFFF';
      map = createGradientTexture(degradeColorHex, baseColor, cupModel.degradePosition!);
  }

  const cupMaterial = new THREE.MeshStandardMaterial({
    color: hasDegrade ? '#ffffff' : cupModel.colorHex,
    map: map,
    roughness: 0.1,
    metalness: 0.1,
    transparent: true,
    opacity: isTransparent ? 0.4 : 1.0,
    side: THREE.DoubleSide,
  });
  
  let rimMaterial = null;
  if (cupModel.rimColor && cupModel.rimColor !== 'Nenhuma') {
      rimMaterial = new THREE.MeshStandardMaterial({
          color: RIM_COLORS[cupModel.rimColor],
          roughness: 0.1,
          metalness: 0.8,
      });
  }

  return (
    <group ref={meshRef}>
      <mesh geometry={geometry} material={cupMaterial}>
        {art && (
          <Decal
            position={decalPosition}
            rotation={[0, 0, 0]}
            scale={decalScale}
            map={artTexture}
          />
        )}
      </mesh>
       {rimMaterial && rimGeometry && (
         <mesh geometry={rimGeometry} material={rimMaterial} />
       )}
    </group>
  );
}

export default function CupPreview3D(props: CupPreview3DProps) {
  return (
    <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />
      <Suspense fallback={null}>
        <CupMesh {...props} />
      </Suspense>
      <OrbitControls enableZoom={true} />
    </Canvas>
  );
}
