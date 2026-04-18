/**
 * ES Module wrapper for the foodInspection service.
 * This allows the CommonJS service to be imported by Next.js API routes.
 */

// Re-export functions from the CommonJS module
const { inspectFood, analyzeImageWithGemini, adjustForTemperature, calculateRiskScore } = require('./foodInspection.js');

export { inspectFood, analyzeImageWithGemini, adjustForTemperature, calculateRiskScore };
