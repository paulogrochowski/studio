
'use client';

import * as THREE from 'three';
import React, { Suspense, Component, ReactNode, useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Decal, useTexture, useGLTF, Environment } from '@react-three/drei';
import type { CupModel, GeneratedArt } from '@/lib/types';
import { DEGRADE_HEX_COLORS, RIM_COLORS } from '@/lib/cup-data';
import { Loader } from './loader';

// Error Boundary Component remains the same
interface ErrorBoundaryProps {
    children: ReactNode;
    fallback: ReactNode;
}
interface ErrorBoundaryState {
    hasError: boolean;
}
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        console.error("Caught a 3D rendering error:", error);
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Uncaught error in 3D preview:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

// This function creates a gradient texture. It's stable and can stay outside.
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

interface CupMeshProps {
  cupModel: CupModel;
  art: GeneratedArt | null;
}

function CupMesh({ cupModel, art }: CupMeshProps) {
  const { nodes } = useGLTF('/models/cup.glb');
  const cupNode = nodes.Cup as THREE.Mesh;
  const rimNode = nodes.Rim as THREE.Mesh;
  
  // Load the AI-generated art texture here. It will suspend the component until loaded.
  // We use a tiny transparent pixel as a placeholder to avoid errors when no art is present.
  const artTextureUrl = art?.imageUrl ?? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const artTexture = useTexture(artTextureUrl);


  const isTransparent = cupModel.opacityType === 'Transparente';
  const hasDegrade = !!(cupModel.degradeColor && cupModel.degradeColor !== 'Nenhum' && cupModel.degradePosition && cupModel.degradePosition !== 'Nenhum');

  const gradientTexture = useMemo(() => {
    if (!hasDegrade) return null;
    const degradeColorHex = DEGRADE_HEX_COLORS[cupModel.degradeColor!];
    const baseColor = isTransparent ? 'rgba(255, 255, 255, 0.0)' : '#FFFFFF';
    return createGradientTexture(degradeColorHex, baseColor, cupModel.degradePosition!);
  }, [hasDegrade, cupModel.degradeColor, cupModel.degradePosition, isTransparent]);

  if (!cupNode?.geometry) {
    console.error("3D Model Error: The 'Cup' mesh or its geometry is missing in /models/cup.glb.");
    return null; 
  }

  return (
    <group dispose={null}>
      <mesh geometry={cupNode.geometry} castShadow>
        <meshStandardMaterial
          color={hasDegrade ? '#ffffff' : cupModel.colorHex}
          map={gradientTexture}
          roughness={0.2}
          metalness={0.1}
          transparent={true} // Always true to handle opacity and gradient transparency
          opacity={isTransparent ? 0.6 : 1.0}
          side={THREE.DoubleSide}
        />
        {/* The Decal is only rendered if art exists. The texture is pre-loaded above. */}
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

export default function CupPreview3D({ cupModel, art }: CupPreview3DProps) {
  const [modelExists, setModelExists] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/models/cup.glb')
      .then(response => setModelExists(response.ok))
      .catch(() => setModelExists(false));
  }, []);

  const ErrorFallback = (
    <div className="flex items-center justify-center h-full text-center p-4 bg-card">
        <div className="bg-destructive text-destructive-foreground p-4 rounded-md shadow-lg">
            <h3 className="font-bold">Modelo 3D Não Encontrado</h3>
            <p className="text-sm mt-2">
                Para ativar o preview 3D, crie a pasta <code className="bg-destructive-foreground/20 p-1 rounded">public/models</code> e adicione seu arquivo <code className="bg-destructive-foreground/20 p-1 rounded">cup.glb</code> nela.
            </p>
        </div>
    </div>
  );

  if (modelExists === null) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader message="Carregando preview 3D..." />
      </div>
    );
  }

  if (!modelExists) {
    return ErrorFallback;
  }
  
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <Canvas shadows camera={{ position: [0, 0.2, 3], fov: 50 }}>
        {/* Suspense now correctly wraps all async 3D assets (model, textures, environment) */}
        <Suspense fallback={null}>
            <ambientLight intensity={0.7} />
            <directionalLight intensity={1.5} position={[5, 5, 5]} castShadow />
            <CupMesh cupModel={cupModel} art={art} />
            <Environment preset="city" />
        </Suspense>
        <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.8} />
      </Canvas>
    </ErrorBoundary>
  );
}
