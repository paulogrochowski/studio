'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { CupModel, GeneratedArt } from '@/lib/types';
import CupMesh from './cup-mesh';

interface CupPreview3DProps {
  cupModel: CupModel;
  art: GeneratedArt | null;
}

// The main export is the Canvas containing the scene.
export default function CupPreview3D({ cupModel, art }: CupPreview3DProps) {
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
