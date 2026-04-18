/**
 * ES Module wrapper for the foodInspection service.
 * This allows the CommonJS service to be imported by Next.js API routes.
 */

// Re-export functions from the CommonJS module
import foodInspection from './foodInspection.js';
const { inspectFood, analyzeImageWithGemini, adjustForTemperature, calculateRiskScore } = foodInspection;

export { inspectFood, analyzeImageWithGemini, adjustForTemperature, calculateRiskScore };
