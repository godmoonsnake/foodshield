/**
 * FoodShield Services — CommonJS interop bridge
 * Uses createRequire for reliable CJS import in Next.js App Router (ESM context).
 */

import { createRequire } from 'module';
const _require = createRequire(import.meta.url);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const foodInspection: any = _require('./foodInspection.js');

export const inspectFood = foodInspection.inspectFood;
export const analyzeImageWithGemini = foodInspection.analyzeImageWithGemini;
export const adjustForTemperature = foodInspection.adjustForTemperature;
export const calculateRiskScore = foodInspection.calculateRiskScore;
