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

// This is a more idiomatic R3F component.
// It uses declarative JSX for geometries and materials, which is more stable.
function CupMesh({ cupModel, art }: CupPreview3DProps) {
  const meshRef = useRef<THREE.Group>(null);
  const artTexture = useTexture(art?.imageUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');

  // Define shared material properties
  const isTransparent = cupModel.opacityType === 'Transparente';
  const hasDegrade = cupModel.degradeColor && cupModel.degradeColor !== 'Nenhum';

  let map = null;
  if (hasDegrade && cupModel.degradePosition) {
      const degradeColorHex = DEGRADE_HEX_COLORS[cupModel.degradeColor!];
      const baseColor = isTransparent ? 'rgba(255, 255, 255, 0.0)' : '#FFFFFF';
      map = createGradientTexture(degradeColorHex, baseColor, cupModel.degradePosition);
  }

  const cupMaterialProps = {
    color: hasDegrade ? '#ffffff' : cupModel.colorHex,
    map: map,
    roughness: 0.1,
    metalness: 0.1,
    transparent: true,
    opacity: isTransparent ? 0.4 : 1.0,
    side: THREE.DoubleSide,
  };

  let rimMaterialProps = null;
  if (cupModel.rimColor && cupModel.rimColor !== 'Nenhuma') {
      rimMaterialProps = {
          color: RIM_COLORS[cupModel.rimColor],
          roughness: 0.1,
          metalness: 0.8,
      };
  }
  
  // Conditionally render the correct geometry and decal
  const renderCupGeometry = () => {
      switch (cupModel.name) {
          case 'Copo Twister com Tampa':
              return (
                  <mesh>
                      <cylinderGeometry args={[0.45, 0.35, 1.4, 32]} />
                      <meshStandardMaterial {...cupMaterialProps} />
                      {art && <Decal position={[0, -0.1, 0.45]} scale={[0.8, 0.6, 1]} map={artTexture} />}
                  </mesh>
              );
          case 'Copo Caldereta':
              return (
                  <mesh>
                      <cylinderGeometry args={[0.45, 0.38, 1.2, 32]} />
                      <meshStandardMaterial {...cupMaterialProps} />
                      {art && <Decal position={[0, 0, 0.45]} scale={[0.8, 0.8, 1]} map={artTexture} />}
                  </mesh>
              );
          case 'Taça Gin':
              return (
                  <mesh>
                      <sphereGeometry args={[0.6, 32, 32, 0, Math.PI * 2, 0, Math.PI * 1.8]} />
                      <meshStandardMaterial {...cupMaterialProps} />
                      {art && <Decal position={[0, 0, 0.6]} scale={[0.8, 0.8, 1]} map={artTexture} />}
                  </mesh>
              );
          case 'Copo Long Drink':
          default:
              return (
                  <mesh>
                      <cylinderGeometry args={[0.4, 0.3, 1.5, 32]} />
                      <meshStandardMaterial {...cupMaterialProps} />
                      {art && <Decal position={[0, 0, 0.4]} scale={[0.7, 0.7, 1]} map={artTexture} />}
                  </mesh>
              );
      }
  };
  
  const renderRimGeometry = () => {
    if (!rimMaterialProps) return null;
    
    switch (cupModel.name) {
      case 'Copo Twister com Tampa':
        return (
          <mesh position={[0, 1.4 / 2, 0]}>
            <torusGeometry args={[0.45, 0.02, 16, 64]} />
            <meshStandardMaterial {...rimMaterialProps} />
          </mesh>
        );
      case 'Copo Caldereta':
        return (
          <mesh position={[0, 1.2 / 2, 0]}>
            <torusGeometry args={[0.45, 0.02, 16, 64]} />
            <meshStandardMaterial {...rimMaterialProps} />
          </mesh>
        );
      case 'Taça Gin':
         return (
          <mesh position={[0, 0.05, 0]}>
            <torusGeometry args={[0.6, 0.02, 16, 64]} />
            <meshStandardMaterial {...rimMaterialProps} />
          </mesh>
        );
      case 'Copo Long Drink':
      default:
         return (
          <mesh position={[0, 1.5 / 2, 0]}>
            <torusGeometry args={[0.4, 0.02, 16, 64]} />
            <meshStandardMaterial {...rimMaterialProps} />
          </mesh>
        );
    }
  }

  return (
    <group ref={meshRef}>
      {renderCupGeometry()}
      {renderRimGeometry()}
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
