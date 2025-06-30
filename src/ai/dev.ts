import { config } from 'dotenv';
config();

import '@/ai/flows/generate-cup-art.ts';
import '@/ai/flows/analyze-art-complexity.ts';
import '@/ai/flows/refine-cup-art.ts';