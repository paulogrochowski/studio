
'use client';

import * as THREE from 'three';
import React, { Suspense, Component, ReactNode, useState, useEffect, useMemo } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Decal, useTexture, Environment, useGLTF } from '@react-three/drei';
import type { CupModel, GeneratedArt, ArtTransformations } from '@/lib/types';
import { DEGRADE_HEX_COLORS, RIM_COLORS } from '@/lib/cup-data';
import { Loader } from './loader';
import { PackageX } from 'lucide-react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';


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


const ModelLoader = ({ url }: { url: string }) => {
  const extension = url.split('.').pop()?.toLowerCase();
  
  const scene = useLoader(
    // @ts-ignore
    extension === 'dae' ? ColladaLoader : GLTFLoader,
    url,
    (loader) => {
      if (loader instanceof GLTFLoader) {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
        loader.setDRACOLoader(dracoLoader);
      }
    }
  );

  return <primitive object={scene.scene || scene} />;
};


interface CupMeshProps {
  cupModel: CupModel;
  art: GeneratedArt | null;
  artTransformations: ArtTransformations;
  modelUrl: string;
}

function CupMesh({ cupModel, art, artTransformations, modelUrl }: CupMeshProps) {
  const { nodes } = useGLTF(modelUrl);
  const cupNode = (nodes.Cup || nodes.cup || Object.values(nodes).find(n => n instanceof THREE.Mesh)) as THREE.Mesh;
  const rimNode = (nodes.Rim || nodes.rim) as THREE.Mesh;
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
        
        const u = 1 - ((Math.atan2(z, x) / (Math.PI * 2)) + 0.5);
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
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.MeshStandardMaterial();

    if (hasDegrade) {
        const degradeColorHex = DEGRADE_HEX_COLORS[cupModel.degradeColor!];
        const baseColor = isTransparent ? 'rgba(255, 255, 255, 0.0)' : '#FFFFFF';
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);

        if (cupModel.degradePosition === 'Cima') {
             gradient.addColorStop(0, baseColor); 
             gradient.addColorStop(1, degradeColorHex); 
        } else {
             gradient.addColorStop(0, degradeColorHex);
             gradient.addColorStop(1, baseColor);
        }
        ctx.fillStyle = gradient;
    } else {
        ctx.fillStyle = cupModel.colorHex || '#FFFFFF';
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (art && artTexture?.image) {
        const { scale, position, rotation } = artTransformations;
        const image = artTexture.image;

        const canvasCenterX = canvas.width / 2;
        const canvasCenterY = canvas.height / 2;

        const drawWidth = image.width * scale[0];
        const drawHeight = image.height * scale[1];

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

  const finalModelUrl = modelUrl || cupModel.modelUrl || '/models/cup.glb';

  useEffect(() => {
    if (finalModelUrl.startsWith('blob:')) {
      setModelExists(true);
      return;
    }

    fetch(finalModelUrl)
      .then(response => {
        const contentType = response.headers.get("content-type");
        const isValid = response.ok && !contentType?.includes('text/html');
        setModelExists(isValid);
      })
      .catch(() => setModelExists(false));
  }, [finalModelUrl]);

  const GenericErrorFallback = null;

  if (modelExists === null) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader message="Carregando preview 3D..." />
      </div>
    );
  }

  if (!modelExists) {
     return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-muted/50 text-muted-foreground">
            <PackageX className="w-16 h-16 mb-4" />
            <h3 className="font-bold text-card-foreground">Sem Preview 3D</h3>
            <p className="text-sm mt-1">Nenhum modelo 3D foi carregado para este produto.</p>
        </div>
    );
  }
  
  return (
    <ErrorBoundary fallback={GenericErrorFallback}>
      <Canvas shadows camera={{ position: [0, 0.2, 3], fov: 50 }} key={finalModelUrl}>
        <Suspense fallback={
             <div className="flex items-center justify-center h-full">
                <Loader showText={false} />
            </div>
        }>
            <ambientLight intensity={0.7} />
            <directionalLight intensity={1.5} position={[5, 5, 5]} castShadow />
            {finalModelUrl.toLowerCase().endsWith('.glb') || finalModelUrl.toLowerCase().endsWith('.gltf') ? (
              <CupMesh 
                cupModel={cupModel} 
                art={art} 
                artTransformations={artTransformations}
                modelUrl={finalModelUrl}
              />
            ) : (
              <ModelLoader url={finalModelUrl} />
            )}
            <Environment preset="city" />
        </Suspense>
        <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.8} />
      </Canvas>
    </ErrorBoundary>
  );
}
