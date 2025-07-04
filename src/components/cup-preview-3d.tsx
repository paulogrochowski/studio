
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

// ArtDecal sub-component to handle texture loading with Suspense and dynamic controls.
const ArtDecal = ({ art, scale, positionY }: { art: GeneratedArt, scale: number, positionY: number }) => {
    const artTexture = useTexture(art.imageUrl);
    // Maintain a consistent aspect ratio for the decal based on original values
    const decalScale = [scale, scale * (5/6), scale];
    return (
        <Decal
            position={[0, positionY, 0.4]}
            rotation={[0, 0, 0]}
            scale={decalScale}
            map={artTexture}
        />
    );
};


interface CupMeshProps {
  cupModel: CupModel;
  art: GeneratedArt | null;
  artScale: number;
  artPositionY: number;
}

function CupMesh({ cupModel, art, artScale, artPositionY }: CupMeshProps) {
  const { nodes } = useGLTF('/models/cup.glb');
  const cupNode = nodes.Cup as THREE.Mesh;
  const rimNode = nodes.Rim as THREE.Mesh;
  
  // This memoized block recalculates geometry to fix gradient and smoothing issues.
  const modifiedGeometry = useMemo(() => {
    if (!cupNode?.geometry) return null;

    const newGeometry = cupNode.geometry.clone();
    
    // KEY FIX: Smooths the model's surface to prevent the "face by face" gradient rendering.
    newGeometry.computeVertexNormals();
    
    newGeometry.computeBoundingBox();
    const { min, max } = newGeometry.boundingBox!;
    const height = max.y - min.y;

    // Ensure UV attribute exists for texture mapping.
    if (!newGeometry.attributes.uv) {
        newGeometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(newGeometry.attributes.position.count * 2), 2));
    }
    const uvAttribute = newGeometry.attributes.uv as THREE.BufferAttribute;

    // Generate UVs for a uniform vertical gradient.
    for (let i = 0; i < uvAttribute.count; i++) {
        const y = newGeometry.attributes.position.getY(i);
        const v = (y - min.y) / height;
        uvAttribute.setXY(i, 0.5, v);
    }
    uvAttribute.needsUpdate = true;
    return newGeometry;
  }, [cupNode?.geometry]);


  const isTransparent = cupModel.opacityType === 'Transparente';
  const hasDegrade = !!(cupModel.degradeColor && cupModel.degradeColor !== 'Nenhum' && cupModel.degradePosition && cupModel.degradePosition !== 'Nenhum');

  const gradientTexture = useMemo(() => {
    if (!hasDegrade) return null;
    const degradeColorHex = DEGRADE_HEX_COLORS[cupModel.degradeColor!];
    const baseColor = isTransparent ? 'rgba(255, 255, 255, 0.0)' : '#FFFFFF';
    return createGradientTexture(degradeColorHex, baseColor, cupModel.degradePosition!);
  }, [hasDegrade, cupModel.degradeColor, cupModel.degradePosition, isTransparent]);

  if (!modifiedGeometry) {
    console.error("3D Model Error: The 'Cup' mesh or its geometry is missing in /models/cup.glb.");
    return null; 
  }

  return (
    <group dispose={null}>
      <mesh geometry={modifiedGeometry} castShadow>
        <meshStandardMaterial
          color={hasDegrade ? '#ffffff' : cupModel.colorHex}
          map={gradientTexture}
          roughness={0.2}
          metalness={0.1}
          transparent={true}
          opacity={isTransparent ? 0.6 : 1.0}
          side={THREE.DoubleSide}
        />
        {art && art.id !== 'no-art' && (
            <Suspense fallback={null}>
              <ArtDecal art={art} scale={artScale} positionY={artPositionY} />
            </Suspense>
        )}
      </mesh>
      {rimNode && cupModel.rimColor && cupModel.rimColor !== 'Nenhuma' && (
        <mesh geometry={rimNode.geometry}>
           <meshStandardMaterial
            color={RIM_COLORS[cupModel.rimColor]}
            emissive={RIM_COLORS[cupModel.rimColor]}
            emissiveIntensity={0.4}
            roughness={0.1}
            metalness={0.8} 
            side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

interface CupPreview3DProps {
  cupModel: CupModel;
  art: GeneratedArt | null;
  artScale: number;
  artPositionY: number;
}

export default function CupPreview3D({ cupModel, art, artScale, artPositionY }: CupPreview3DProps) {
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
        <Suspense fallback={null}>
            <ambientLight intensity={0.7} />
            <directionalLight intensity={1.5} position={[5, 5, 5]} castShadow />
            <CupMesh cupModel={cupModel} art={art} artScale={artScale} artPositionY={artPositionY}/>
            <Environment preset="city" />
        </Suspense>
        <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.8} />
      </Canvas>
    </ErrorBoundary>
  );
}
