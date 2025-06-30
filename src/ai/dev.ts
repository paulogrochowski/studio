import { config } from 'dotenv';
config();

import '@/ai/flows/generate-cup-art.ts'; // This file now contains the editImageFlow
// The other flow files are now unused.
