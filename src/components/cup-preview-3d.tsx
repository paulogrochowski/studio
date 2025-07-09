
'use client';

import * as THREE from 'three';
import React, { Suspense, Component, ReactNode, useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Decal, useTexture, useGLTF, Environment } from '@react-three/drei';
import type { CupModel, GeneratedArt, ArtTransformations } from '@/lib/types';
import { DEGRADE_HEX_COLORS, RIM_COLORS } from '@/lib/cup-data';
import { Loader } from './loader';

// Error Boundary Component
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
    
    // Reset error state when props change, allowing a new model to be tried
    componentDidUpdate(prevProps: ErrorBoundaryProps) {
        if (prevProps.children !== this.props.children) {
            this.setState({ hasError: false });
        }
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

interface CupMeshProps {
  cupModel: CupModel;
  art: GeneratedArt | null;
  artTransformations: ArtTransformations;
  modelUrl: string | null;
}

function CupMesh({ cupModel, art, artTransformations, modelUrl }: CupMeshProps) {
  const { nodes } = useGLTF(modelUrl || '/models/cup.glb');
  const cupNode = (nodes.Cup || nodes.cup || Object.values(nodes).find(n => n instanceof THREE.Mesh)) as THREE.Mesh;
  const rimNode = (nodes.Rim || nodes.rim) as THREE.Mesh;
  // Always call useTexture, providing a placeholder transparent pixel if no art is available.
  // This respects the rules of React Hooks.
  const artTexture = useTexture(art?.imageUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
  
  const wrappedCupGeometry = useMemo(() => {
    if (!cupNode?.geometry) return null;

    const newGeometry = cupNode.geometry.clone();
    newGeometry.computeVertexNormals();
    newGeometry.computeBoundingBox();
    const { min, max } = newGeometry.boundingBox!;
    const height = max.y - min.y;

    if (!newGeometry.attributes.uv) {
        newGeometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(newGeometry.attributes.position.count * 2), 2));
    }
    const uvAttribute = newGeometry.attributes.uv as THREE.BufferAttribute;
    const positionAttribute = newGeometry.attributes.position;

    for (let i = 0; i < uvAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const z = positionAttribute.getZ(i);
        const y = positionAttribute.getY(i);
        
        // Calculate U coordinate based on angle for wrapping
        const u = 1 - ((Math.atan2(z, x) / (Math.PI * 2)) + 0.5);
        // Calculate V coordinate based on height
        const v = (y - min.y) / height;
        
        uvAttribute.setXY(i, u, v);
    }
    uvAttribute.needsUpdate = true;
    return newGeometry;
  }, [cupNode?.geometry]);


  const composedMaterial = useMemo(() => {
    const isTransparent = cupModel.opacityType === 'Transparente';
    const hasDegrade = !!(cupModel.degradeColor && cupModel.degradeColor !== 'Nenhum' && cupModel.degradePosition && cupModel.degradePosition !== 'Nenhum');

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.MeshStandardMaterial();

    // 1. Draw Base Layer (Color or Gradient)
    if (hasDegrade) {
        const degradeColorHex = DEGRADE_HEX_COLORS[cupModel.degradeColor!];
        const baseColor = isTransparent ? 'rgba(255, 255, 255, 0.0)' : '#FFFFFF';
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);

        if (cupModel.degradePosition === 'Cima') {
             gradient.addColorStop(0, baseColor); // Bottom
             gradient.addColorStop(1, degradeColorHex); // Top
        } else {
             gradient.addColorStop(0, degradeColorHex); // Bottom
             gradient.addColorStop(1, baseColor); // Top
        }
        ctx.fillStyle = gradient;
    } else {
        ctx.fillStyle = cupModel.colorHex || '#FFFFFF';
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Art on top only if art is available
    if (art && artTexture?.image) {
        const { scale, position, rotation } = artTransformations;
        const image = artTexture.image;

        const canvasCenterX = canvas.width / 2;
        const canvasCenterY = canvas.height / 2;

        const drawWidth = image.width * scale[0];
        const drawHeight = image.height * scale[1];

        // Position is an offset from the center in percentage of canvas size
        const drawX = canvasCenterX + (position[0] * canvas.width) - (drawWidth / 2);
        const drawY = canvasCenterY - (position[1] * canvas.height) - (drawHeight / 2);

        ctx.save();
        ctx.translate(drawX + drawWidth / 2, drawY + drawHeight / 2);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        ctx.restore();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    return new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: isTransparent ? 0.6 : 1.0,
        side: THREE.DoubleSide,
    });
  }, [cupModel, art, artTexture, artTransformations]);
  
  // Dispose material when it changes
  useEffect(() => {
    return () => {
      composedMaterial.map?.dispose();
      composedMaterial.dispose();
    };
  }, [composedMaterial]);


  const modifiedRimGeometry = useMemo(() => {
    if (!rimNode?.geometry) return null;
    const newGeometry = rimNode.geometry.clone();
    newGeometry.computeVertexNormals();
    return newGeometry;
  }, [rimNode?.geometry]);


  if (!wrappedCupGeometry) {
    return null; 
  }

  return (
    <group dispose={null}>
      <mesh 
        geometry={wrappedCupGeometry} 
        castShadow 
        material={composedMaterial}
      />
      {modifiedRimGeometry && cupModel.rimColor && cupModel.rimColor !== 'Nenhuma' && (
        <mesh
          geometry={modifiedRimGeometry}
        >
          <meshStandardMaterial
            color={RIM_COLORS[cupModel.rimColor]}
            emissive={RIM_COLORS[cupModel.rimColor]}
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

interface CupPreview3DProps {
  cupModel: CupModel;
  art: GeneratedArt | null;
  artTransformations: ArtTransformations;
  modelUrl: string | null;
}

export default function CupPreview3D({ cupModel, art, artTransformations, modelUrl }: CupPreview3DProps) {
  const [modelExists, setModelExists] = useState<boolean | null>(null);

  useEffect(() => {
    // If a custom model is uploaded via a blob URL, we assume it "exists" for rendering purposes.
    if (modelUrl) {
      setModelExists(true);
      return;
    }

    // Only check for the default static model if no custom one is provided.
    fetch('/models/cup.glb')
      .then(response => {
        const contentType = response.headers.get("content-type");
        setModelExists(response.ok && !contentType?.includes('text/html'));
      })
      .catch(() => setModelExists(false));
  }, [modelUrl]);

  const ErrorFallback = (
    <div className="flex items-center justify-center h-full text-center p-4 bg-card">
        <div className="bg-destructive text-destructive-foreground p-4 rounded-md shadow-lg">
            <h3 className="font-bold">Modelo 3D Não Encontrado</h3>
            <p className="text-sm mt-2">
                Para ativar o preview 3D, crie a pasta <code className="bg-destructive-foreground/20 p-1 rounded">public/models</code> e adicione seu arquivo <code className="bg-destructive-foreground/20 p-1 rounded">cup.glb</code> nela, ou carregue um modelo na seção correspondente.
            </p>
        </div>
    </div>
  );
  
  const GenericErrorFallback = (
    <div className="flex items-center justify-center h-full text-center p-4 bg-card">
        <div className="bg-destructive text-destructive-foreground p-4 rounded-md shadow-lg">
            <h3 className="font-bold">Erro ao Carregar Modelo</h3>
            <p className="text-sm mt-2">
                Não foi possível carregar o modelo 3D. Verifique se o arquivo <code className="bg-destructive-foreground/20 p-1 rounded">.glb</code> ou <code className="bg-destructive-foreground/20 p-1 rounded">.gltf</code> é válido.
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

  if (!modelExists && !modelUrl) {
    return ErrorFallback;
  }
  
  return (
    <ErrorBoundary fallback={GenericErrorFallback}>
      <Canvas shadows camera={{ position: [0, 0.2, 3], fov: 50 }} key={modelUrl}>
        <Suspense fallback={
             <div className="flex items-center justify-center h-full">
                <Loader showText={false} />
            </div>
        }>
            <ambientLight intensity={0.7} />
            <directionalLight intensity={1.5} position={[5, 5, 5]} castShadow />
            <CupMesh 
              cupModel={cupModel} 
              art={art} 
              artTransformations={artTransformations}
              modelUrl={modelUrl}
            />
            <Environment preset="city" />
        </Suspense>
        <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.8} />
      </Canvas>
    </ErrorBoundary>
  );
}
