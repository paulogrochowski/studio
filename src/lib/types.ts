
export interface CupModel {
  id: string;
  name: string;
  imageUrl: string;
  svgMaskUrl: string;
  basePrice: number;
  'data-ai-hint'?: string;
  colorName?: string;
  colorHex?: string;
  opacityType?: 'Fosco' | 'Transparente';
  rimColor?: 'Nenhuma' | 'Dourado' | 'Prata' | 'Rosa Gold';
  degradeColor?: string;
  degradePosition?: 'Nenhum' | 'Cima' | 'Baixo';
  printableArea?: {
    widthPercent: number;
    heightPercent: number;
    width_mm: number;
    height_mm: number;
  };
}

export interface GeneratedArt {
  id: string;
  imageUrl: string;
  prompt: string;
  x: number;
  y: number;
  rotation: number;
}

export interface OrderDetails {
  cupModel: CupModel;
  eventDescription: string;
  art: GeneratedArt;
  artComplexity: {
    score: number;
    reasoning: string;
  };
  quantity: number;
  isUrgent: boolean;
  total: number;
}
