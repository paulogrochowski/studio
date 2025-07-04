'use client';

import * as THREE from 'three';
import { Decal, useTexture, useGLTF } from '@react-three/drei';
import type { CupModel, GeneratedArt } from '@/lib/types';
import { DEGRADE_HEX_COLORS, RIM_COLORS } from '@/lib/cup-data';

// This function creates a gradient texture for the 'degrade' effect.
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

export default function CupMesh({ cupModel, art }: CupMeshProps) {
  // This hook loads the GLB model from the /public/models/ directory.
  // IMPORTANT: Your GLB file must contain meshes named 'Cup' and, optionally, 'Rim'.
  const { nodes } = useGLTF('/models/cup.glb');

  // We need to cast the nodes to THREE.Mesh to access geometry
  const cupNode = nodes.Cup as THREE.Mesh;
  const rimNode = nodes.Rim as THREE.Mesh;

  // useTexture handles loading the art image. Provides a fallback for when there's no art.
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
    // For transparent cups, the gradient fades to a transparent white.
    const baseColor = isTransparent ? 'rgba(255, 255, 255, 0.0)' : '#FFFFFF';
    map = createGradientTexture(degradeColorHex, baseColor, cupModel.degradePosition);
  }

  return (
    <group dispose={null}>
      {/* Main cup mesh */}
      <mesh geometry={cupNode.geometry}>
        <meshStandardMaterial
          color={hasDegrade ? '#ffffff' : cupModel.colorHex}
          map={map}
          roughness={0.2}
          metalness={0.1}
          transparent={true}
          opacity={isTransparent ? 0.6 : 1.0}
          side={THREE.DoubleSide} // Render both sides for transparent effect
        />
        {/* The Decal component projects the texture onto the mesh */}
        {art && (
          <Decal
            position={[0, 0.1, 0.4]} // Fine-tune this to place the art correctly
            rotation={[0, 0, 0]}
            scale={[0.6, 0.5, 0.6]} // Fine-tune this for correct art size
            map={artTexture}
          />
        )}
      </mesh>
      {/* Optional rim mesh */}
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
