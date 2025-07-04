'use client';

import * as THREE from 'three';
import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Decal, useTexture, useGLTF } from '@react-three/drei';
import type { CupModel, GeneratedArt } from '@/lib/types';
import { DEGRADE_HEX_COLORS, RIM_COLORS } from '@/lib/cup-data';

// This function creates a gradient texture for the 'degrade' effect.
// It needs to be guarded against running on the server.
function createGradientTexture(color1: string, color2: string, position: 'Cima' | 'Baixo') {
  if (typeof document === 'undefined') {
    // This check is crucial for SSR safety
    return null;
  }
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

interface CupMeshProps {
  cupModel: CupModel;
  art: GeneratedArt | null;
}

function CupMesh({ cupModel, art }: CupMeshProps) {
  // IMPORTANT: Your GLB file must contain meshes named 'Cup' and, optionally, 'Rim'.
  const { nodes } = useGLTF('/models/cup.glb');
  const cupNode = nodes.Cup as THREE.Mesh;
  const rimNode = nodes.Rim as THREE.Mesh;

  const artTexture = useTexture(art?.imageUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');

  if (!cupNode) {
    console.error("3D Model Error: The GLB file at /models/cup.glb must contain a mesh named 'Cup'.");
    return null;
  }

  const isTransparent = cupModel.opacityType === 'Transparente';
  const hasDegrade = cupModel.degradeColor && cupModel.degradeColor !== 'Nenhum';
  let map = null;

  if (hasDegrade && cupModel.degradePosition && cupModel.degradePosition !== 'Nenhum') {
    const degradeColorHex = DEGRADE_HEX_COLORS[cupModel.degradeColor!];
    const baseColor = isTransparent ? 'rgba(255, 255, 255, 0.0)' : '#FFFFFF';
    const texture = createGradientTexture(degradeColorHex, baseColor, cupModel.degradePosition);
    if (texture) map = texture;
  }

  return (
    <group dispose={null}>
      <mesh geometry={cupNode.geometry}>
        <meshStandardMaterial
          color={hasDegrade ? '#ffffff' : cupModel.colorHex}
          map={map}
          roughness={0.2}
          metalness={0.1}
          transparent={true}
          opacity={isTransparent ? 0.6 : 1.0}
          side={THREE.DoubleSide}
        />
        {art && (
          <Decal
            position={[0, 0.1, 0.4]}
            rotation={[0, 0, 0]}
            scale={[0.6, 0.5, 0.6]}
            map={artTexture}
          />
        )}
      </mesh>
      {rimNode && cupModel.rimColor && cupModel.rimColor !== 'Nenhuma' && (
        <mesh
          geometry={rimNode.geometry}
          material-color={RIM_COLORS[cupModel.rimColor]}
          material-roughness={0.1}
          material-metalness={0.8}
        />
      )}
    </group>
  );
}

interface CupPreview3DProps {
  cupModel: CupModel;
  art: GeneratedArt | null;
}

// The main export is the Canvas containing the scene.
export default function CupPreview3D({ cupModel, art }: CupPreview3DProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This hook only runs on the client, after the component has mounted.
    setIsClient(true);
  }, []);

  // Render a fallback on the server and on the initial client render.
  // This ensures the 3D-heavy part is never touched by the server.
  if (!isClient) {
    // The parent dynamic import already provides a loader, so returning null is perfect.
    return null;
  }
  
  return (
    <Canvas camera={{ position: [0, 0, 2.2], fov: 50 }}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />
      <Suspense fallback={null}>
        <CupMesh cupModel={cupModel} art={art} />
      </Suspense>
      <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
}
