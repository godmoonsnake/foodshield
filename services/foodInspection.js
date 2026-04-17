/**
 * FoodGuard AI — Food Inspection Service
 * Uses Gemini Vision to analyze food/ingredient photos
 * and predict safety windows using food science (Q10 temperature coefficient)
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// ─────────────────────────────────────────────────────────
// SHELF LIFE DATABASE (USDA / FDA safe storage guidelines)
// Format: ingredient → { baseTempC, safeHours, criticalSymptoms, pathogenRisk }
// baseTempC = 4°C (refrigeration standard baseline)
// ─────────────────────────────────────────────────────────
const SHELF_LIFE_DB = {
  // ── RAW PROTEINS (highest risk) ───────────────────────
  'raw chicken': {
    safeHours: 2, baseTempC: 4,
    pathogens: ['Salmonella', 'Campylobacter'],
    color: '#ff3b30', risk: 'CRITICAL',
    notes: 'Must be kept below 4°C. Bacteria double every 20 min at room temperature.'
  },
  'raw fish': {
    safeHours: 1.5, baseTempC: 4,
    pathogens: ['Vibrio', 'Listeria', 'Clostridium botulinum'],
    color: '#ff3b30', risk: 'CRITICAL',
    notes: 'Highly perishable. Seafood toxins do not always smell or look bad.'
  },
  'raw prawns': {
    safeHours: 1, baseTempC: 4,
    pathogens: ['Vibrio parahaemolyticus', 'Salmonella'],
    color: '#ff3b30', risk: 'CRITICAL',
    notes: 'Vibrio thrives in warm coastal water. High risk during monsoon.'
  },
  'raw mutton': {
    safeHours: 2, baseTempC: 4,
    pathogens: ['Salmonella', 'E. coli O157:H7', 'Clostridium perfringens'],
    color: '#ff3b30', risk: 'CRITICAL',
    notes: 'Ground meat has 5× more surface area for bacteria than whole cuts.'
  },
  'raw pork': {
    safeHours: 2, baseTempC: 4,
    pathogens: ['Trichinella', 'Salmonella', 'Yersinia'],
    color: '#ff3b30', risk: 'CRITICAL',
    notes: 'Must reach 71°C internal temperature during cooking.'
  },
  'raw eggs': {
    safeHours: 4, baseTempC: 4,
    pathogens: ['Salmonella enteritidis'],
    color: '#ff9500', risk: 'HIGH',
    notes: 'Bacteria inside the egg shell, not just surface. Never eat runny eggs if immunocompromised.'
  },
  // ── COOKED/FRIED FOODS ────────────────────────────────
  'fried chicken': {
    safeHours: 2, baseTempC: 25,
    pathogens: ['Staphylococcus aureus', 'Clostridium perfringens'],
    color: '#ff9500', risk: 'HIGH',
    notes: 'Fried coating traps moisture and heat inside. If left at room temp, bacteria multiply rapidly in the meat.'
  },
  'fried fish': {
    safeHours: 2, baseTempC: 25,
    pathogens: ['Vibrio', 'Staphylococcus aureus', 'Salmonella'],
    color: '#ff3b30', risk: 'HIGH',
    notes: 'Cooked seafood spoils very fast at room temperature. The breading can mask off-odors.'
  },
  'french fries': {
    safeHours: 24, baseTempC: 25,
    pathogens: ['Staphylococcus aureus'],
    color: '#30d158', risk: 'LOW',
    notes: 'Low moisture and high salt make fries relatively safe at room temp, but they become soggy. Risk increases if covered in cheese/sauce.'
  },
  'samosa': {
    safeHours: 6, baseTempC: 25,
    pathogens: ['Bacillus cereus', 'Staphylococcus aureus'],
    color: '#ff9500', risk: 'MODERATE',
    notes: 'Potato/meat filling retains moisture. High risk if kept warm for long periods instead of hot (>60°C) or cold (<4°C).'
  },
  'pakora': {
    safeHours: 6, baseTempC: 25,
    pathogens: ['Bacillus cereus'],
    color: '#ff9500', risk: 'MODERATE',
    notes: 'Vegetable fillings retain moisture. Lower risk than meat, but still perishable at room temperature.'
  },
  'cooked chicken': {
    safeHours: 4, baseTempC: 4,
    pathogens: ['Bacillus cereus', 'Clostridium perfringens', 'Staphylococcus aureus'],
    color: '#ff9500', risk: 'HIGH',
    notes: 'Cooling must happen within 2 hours. Bacteria begin multiplying quickly after 60°C drop.'
  },
  'cooked rice': {
    safeHours: 2, baseTempC: 4,
    pathogens: ['Bacillus cereus'],
    color: '#ff9500', risk: 'HIGH',
    notes: 'B. cereus spores SURVIVE cooking. If rice sits warm, spores germinate and produce toxins.'
  },
  'cooked meat': {
    safeHours: 3, baseTempC: 4,
    pathogens: ['Clostridium perfringens', 'Staphylococcus aureus'],
    color: '#ff9500', risk: 'HIGH',
    notes: 'Gravy and sauces hold heat — ideal bacterial growth environment.'
  },

  // ── DAIRY ─────────────────────────────────────────────
  'milk': {
    safeHours: 4, baseTempC: 4,
    pathogens: ['Listeria', 'Salmonella', 'E. coli'],
    color: '#ff9500', risk: 'HIGH',
    notes: 'Unpasteurized milk is 150× more dangerous. Check for curdling or sour smell.'
  },
  'paneer': {
    safeHours: 3, baseTempC: 4,
    pathogens: ['Listeria', 'Staphylococcus aureus'],
    color: '#ff9500', risk: 'HIGH',
    notes: 'Fresh paneer has very high moisture — bacteria multiply rapidly.'
  },
  'curd': {
    safeHours: 6, baseTempC: 4,
    pathogens: ['E. coli', 'Staphylococcus'],
    color: '#ff9500', risk: 'HIGH',
    notes: 'Natural acidity slows growth but not in warm climate. Always refrigerate.'
  },
  'cheese': {
    safeHours: 12, baseTempC: 4,
    pathogens: ['Listeria'],
    color: '#ff9500', risk: 'MODERATE',
    notes: 'Hard cheeses are safer. Soft cheeses and fresh cheese have higher Listeria risk.'
  },

  // ── COOKED GRAINS ─────────────────────────────────────
  'dal': {
    safeHours: 4, baseTempC: 25,
    pathogens: ['Bacillus cereus', 'Clostridium perfringens'],
    color: '#ff9500', risk: 'HIGH',
    notes: 'High protein content. If left out overnight in Indian climate — discard.'
  },
  'biryani': {
    safeHours: 3, baseTempC: 25,
    pathogens: ['Bacillus cereus', 'Salmonella', 'Clostridium'],
    color: '#ff3b30', risk: 'HIGH',
    notes: 'Layered dish traps heat unevenly. Bacteria in center may survive if not reheated to 74°C.'
  },
  'naan': {
    safeHours: 24, baseTempC: 25,
    pathogens: [],
    color: '#30d158', risk: 'LOW',
    notes: 'Bread is low risk when dry. Becomes medium risk if butter or wet toppings are added.'
  },

  // ── VEGETABLES ────────────────────────────────────────
  'leafy greens': {
    safeHours: 8, baseTempC: 4,
    pathogens: ['E. coli O157:H7', 'Salmonella', 'Listeria'],
    color: '#ff9500', risk: 'HIGH',
    notes: 'Pre-washed salad bags are NOT sterile. Wash all produce. E. coli 2006 & 2018 from spinach/romaine.'
  },
  'spinach': {
    safeHours: 6, baseTempC: 4,
    pathogens: ['E. coli O157:H7'],
    color: '#ff9500', risk: 'HIGH',
    notes: 'Linked to major outbreaks. Cross-contamination from irrigation water.'
  },
  'cut tomatoes': {
    safeHours: 4, baseTempC: 4,
    pathogens: ['Salmonella', 'Cholera'],
    color: '#ff9500', risk: 'HIGH',
    notes: 'Whole tomatoes are safe. Cut surface becomes high-risk within 2 hours.'
  },
  'onion': {
    safeHours: 48, baseTempC: 25,
    pathogens: [],
    color: '#30d158', risk: 'LOW',
    notes: 'Naturally antibacterial. Low risk when whole. Chopped onion kept overnight OK if refrigerated.'
  },
  'potato': {
    safeHours: 72, baseTempC: 25,
    pathogens: ['Clostridium botulinum (baked in foil)'],
    color: '#30d158', risk: 'LOW',
    notes: 'Baked potato wrapped in foil and left room temp overnight is a botulism risk.'
  },

  // ── SAUCES / CONDIMENTS ───────────────────────────────
  'mayonnaise': {
    safeHours: 2, baseTempC: 4,
    pathogens: ['Salmonella', 'Listeria'],
    color: '#ff3b30', risk: 'HIGH',
    notes: 'Never leave out. Sandwiches/rolls with mayo left at room temp = very high risk.'
  },
  'chutney': {
    safeHours: 6, baseTempC: 25,
    pathogens: ['E. coli', 'Mold toxins'],
    color: '#ff9500', risk: 'MODERATE',
    notes: 'Fresh chutneys (mint, coriander) spoil fast. Check for discoloration.'
  },

  // ── SEAFOOD (specific) ────────────────────────────────
  'shellfish': {
    safeHours: 1, baseTempC: 4,
    pathogens: ['Vibrio', 'Norovirus', 'Hepatitis A'],
    color: '#ff3b30', risk: 'CRITICAL',
    notes: 'Filter feeders concentrate viruses and bacteria. Must be LIVE before cooking.'
  },
};

// ─────────────────────────────────────────────────────────
// Q10 TEMPERATURE COEFFICIENT
// Biological rule: bacterial growth rate doubles every 10°C rise
// Q10 = 2 (standard microbiology constant)
// Adjusted_Safe_Hours = Base_Safe_Hours / Q10^((T_current - T_base) / 10)
// ─────────────────────────────────────────────────────────
function adjustForTemperature(baseSafeHours, baseTempC, currentTempC, humidity) {
  const Q10 = 2.0; // bacterial growth rate doubles every 10°C
  const tempDelta = currentTempC - baseTempC;
  const tempAdjustedHours = baseSafeHours / Math.pow(Q10, tempDelta / 10);

  // Humidity modifier: >70% RH speeds spoilage by 15-25%
  let humidityMultiplier = 1.0;
  if (humidity >= 85) humidityMultiplier = 0.70;
  else if (humidity >= 70) humidityMultiplier = 0.82;
  else if (humidity >= 60) humidityMultiplier = 0.92;

  const adjustedHours = Math.max(0.25, tempAdjustedHours * humidityMultiplier);

  return {
    adjustedHours: Math.round(adjustedHours * 10) / 10,
    tempImpact: tempDelta > 0
      ? `+${tempDelta}°C above storage baseline reduces safe window by ${Math.round((1 - tempAdjustedHours / baseSafeHours) * 100)}%`
      : `Within safe temperature range`,
    humidityImpact: humidity >= 60
      ? `${humidity}% humidity further reduces safe window by ${Math.round((1 - humidityMultiplier) * 100)}%`
      : `Humidity within acceptable range`,
  };
}

// ─────────────────────────────────────────────────────────
// GEMINI VISION ANALYSIS
// ─────────────────────────────────────────────────────────
async function analyzeImageWithGemini(imageBase64, mimeType = 'image/jpeg') {
  // Use the upgraded API key for all kinds of contamination detection
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log('📸 Demo mode: returning mock food analysis');
    return getMockAnalysis();
  }

  const prompt = `You are a world-class food safety inspector, microbiologist, and auditor.
Perform an exhaustive visual analysis of this food, ingredient, or storage setting. Look for ANY signs of contamination, including:
1. Biological (mold, slime, excessive moisture, discoloration, wilting, strange textures)
2. Physical (hair, insects, plastic fragments, dirt, foreign objects)
3. Cross-contamination risks (e.g., raw meat near ready-to-eat foods, unsealed containers, improper stacking)
4. Packaging/Storage issues (bloated cans/bags, tears, ice crystals indicating temperature abuse)

Return ONLY valid JSON in this exact structure (no markdown, no extra text):
{
  "detected_items": [
    { "name": "item name in lowercase", "quantity_estimate": "e.g. 200g", "condition": "fresh/cooked/raw/questionable/spoiled", "visible_concerns": "specific details on mold, slime, discoloration, physical contaminants, etc. or 'none'" }
  ],
  "preparation_visible": true,
  "estimated_dish": "name of dish if identifiable",
  "visible_spoilage_signs": ["detailed list of biological spoilage markers"],
  "physical_contaminants_found": ["list of foreign bodies/insects/dirt, or empty array"],
  "cross_contamination_risks": ["list of risks like raw meat next to veggies, or empty array"],
  "packaging_or_storage_issues": ["bloating, tears, unprotected surfaces, or empty array"],
  "storage_visible": "visible storage context (open air, wrapped, refrigerated, etc.)",
  "overall_visual_safety": "SAFE / CAUTION / WARNING / DANGER",
  "ai_immediate_concern": "Most critical concern in 1 sentence, or null if none"
}

Be specific with ingredient names. Examples: 'raw chicken', 'cooked rice', 'fresh spinach'.
Do not miss any subtle cues of spoilage or physical contamination. Look closely at the background and surfaces.`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1beta" });

    // Ensure the base64 string doesn't have the data URI prefix if it was passed with one
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      }
    ]);
    
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response: ' + text);
    
    return JSON.parse(jsonMatch[0]);

  } catch (err) {
    console.error('Failed to parse or fetch Gemini response:', err);
    return getMockAnalysis();
  }
}

// ─────────────────────────────────────────────────────────
// MATCH DETECTED INGREDIENTS TO SHELF LIFE DB
// ─────────────────────────────────────────────────────────
function matchIngredientToShelfLife(itemName) {
  const lower = itemName.toLowerCase().trim();

  // Direct match
  if (SHELF_LIFE_DB[lower]) return { key: lower, data: SHELF_LIFE_DB[lower] };

  // Partial match
  for (const [key, data] of Object.entries(SHELF_LIFE_DB)) {
    if (lower.includes(key) || key.includes(lower.split(' ')[0])) {
      return { key, data };
    }
  }

  // Fallback — generic cooked food
  return {
    key: 'generic',
    data: {
      safeHours: 4, baseTempC: 25,
      pathogens: ['Various bacteria'],
      color: '#ff9500', risk: 'MODERATE',
      notes: 'Unable to find specific data. Apply standard 2-hour room temperature rule.'
    }
  };
}

// ─────────────────────────────────────────────────────────
// MAIN INSPECTION FUNCTION
// ─────────────────────────────────────────────────────────
async function inspectFood(imageBase64, mimeType, weatherData) {
  const temperature = weatherData?.temperature || 28;
  const humidity = weatherData?.humidity || 65;

  // Step 1: Gemini Vision analysis
  const visionResult = await analyzeImageWithGemini(imageBase64, mimeType);

  // Step 2: For each detected ingredient, compute safety window
  const ingredientAnalysis = (visionResult.detected_items || []).map(item => {
    const match = matchIngredientToShelfLife(item.name);
    const adjustment = adjustForTemperature(
      match.data.safeHours,
      match.data.baseTempC,
      temperature,
      humidity
    );

    // If item shows visible spoilage, override to 0
    const spoiledOverride = item.condition === 'spoiled' ||
      (item.visible_concerns && item.visible_concerns.toLowerCase().includes('mold'));

    return {
      ingredient: item.name,
      quantity: item.quantity_estimate,
      condition: item.condition,
      visible_concerns: item.visible_concerns,
      shelf_life: {
        base_safe_hours: match.data.safeHours,
        adjusted_safe_hours: spoiledOverride ? 0 : adjustment.adjustedHours,
        temperature_impact: adjustment.tempImpact,
        humidity_impact: adjustment.humidityImpact,
        already_spoiled: spoiledOverride,
        safe_until: spoiledOverride ? 'ALREADY SPOILED — DO NOT EAT' :
          new Date(Date.now() + adjustment.adjustedHours * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      risk: spoiledOverride ? 'CRITICAL' : match.data.risk,
      risk_color: spoiledOverride ? '#ff0000' : match.data.color,
      pathogens_at_risk: match.data.pathogens,
      safety_notes: match.data.notes,
    };
  });

  // Step 3: Overall assessment — driven by worst ingredient
  const riskRanking = { CRITICAL: 4, HIGH: 3, MODERATE: 2, LOW: 1 };
  const worstIngredient = ingredientAnalysis.sort((a, b) =>
    (riskRanking[b.risk] || 0) - (riskRanking[a.risk] || 0)
  )[0];

  const shortestWindow = ingredientAnalysis.reduce((min, item) =>
    item.shelf_life.adjusted_safe_hours < min ? item.shelf_life.adjusted_safe_hours : min,
    Infinity
  );

  // Step 4: Actionable recommendations
  const recommendations = generateRecommendations(ingredientAnalysis, temperature, humidity, visionResult);

  return {
    timestamp: new Date().toISOString(),
    environmental_conditions: {
      temperature_c: temperature,
      humidity_percent: humidity,
      risk_level: humidity >= 70 && temperature >= 30 ? 'HIGH' : 'MODERATE',
      note: `Current conditions (${temperature}°C, ${humidity}% RH) accelerate bacterial growth significantly`
    },
    vision_analysis: visionResult,
    ingredient_analysis: ingredientAnalysis,
    overall_assessment: {
      estimated_dish: visionResult.estimated_dish || 'Unknown dish',
      overall_visual_safety: visionResult.overall_visual_safety,
      risk_score_100: calculateRiskScore(visionResult.overall_visual_safety, worstIngredient?.risk || 'LOW'),
      critical_window_hours: shortestWindow === Infinity ? 4 : Math.round(shortestWindow * 10) / 10,
      highest_risk_ingredient: worstIngredient?.ingredient || 'N/A',
      highest_risk_level: worstIngredient?.risk || 'MODERATE',
      all_pathogens_at_risk: [...new Set(ingredientAnalysis.flatMap(i => i.pathogens_at_risk))],
      safe_to_eat_now: visionResult.overall_visual_safety !== 'DANGER' && shortestWindow > 0,
      immediate_concern: visionResult.ai_immediate_concern,
      physical_contaminants: visionResult.physical_contaminants_found || [],
      cross_contamination_risks: visionResult.cross_contamination_risks || [],
      packaging_issues: visionResult.packaging_or_storage_issues || []
    },
    recommendations,
    disclaimer: 'This is an AI-assisted visual inspection only. It cannot detect invisible contamination (bacteria, toxins, pesticides). When in doubt, discard the food.'
  };
}

// ─────────────────────────────────────────────────────────
// RECOMMENDATION ENGINE
// ─────────────────────────────────────────────────────────
function generateRecommendations(ingredients, temperature, humidity, vision) {
  const recs = [];

  // Temperature-based
  if (temperature >= 35) {
    recs.push({
      priority: 'URGENT',
      icon: '🌡️',
      message: `Current temperature (${temperature}°C) is in the DANGER ZONE. Bacteria double every 20 minutes at this heat. Move all food to refrigeration immediately.`
    });
  } else if (temperature >= 30) {
    recs.push({
      priority: 'HIGH',
      icon: '⚠️',
      message: `At ${temperature}°C, safe windows are reduced by 50–75% vs. refrigerated storage. Consume within 1–2 hours or refrigerate.`
    });
  }

  // Humidity-based
  if (humidity >= 80) {
    recs.push({
      priority: 'MODERATE',
      icon: '💧',
      message: `High humidity (${humidity}% RH) promotes mold and bacterial surface growth. Keep food covered and sealed.`
    });
  }

  // Critical ingredients
  const criticalItems = ingredients.filter(i => i.risk === 'CRITICAL');
  if (criticalItems.length > 0) {
    criticalItems.forEach(item => {
      recs.push({
        priority: 'URGENT',
        icon: '🚨',
        message: `${item.ingredient.toUpperCase()}: Safe window is only ${item.shelf_life.adjusted_safe_hours} hrs in current conditions. Risk: ${item.pathogens_at_risk.join(', ')}.`
      });
    });
  }

  // Visible spoilage or other contamination
  const issues = [
    ...(vision.visible_spoilage_signs || []),
    ...(vision.physical_contaminants_found || []),
    ...(vision.cross_contamination_risks || []),
    ...(vision.packaging_or_storage_issues || [])
  ];

  if (issues.length > 0) {
    recs.push({
      priority: 'CRITICAL',
      icon: '☠️',
      message: `DISCARD OR REMEDY IMMEDIATELY. Detected issues: ${issues.join('; ')}.`
    });
  }

  // Generic best practice
  recs.push({
    priority: 'INFO',
    icon: '✅',
    message: 'Store raw proteins on the lowest refrigerator shelf to prevent drip contamination onto other foods.'
  });

  return recs.sort((a, b) => {
    const order = { CRITICAL: 0, URGENT: 1, HIGH: 2, MODERATE: 3, INFO: 4 };
    return order[a.priority] - order[b.priority];
  });
}

// ─────────────────────────────────────────────────────────
// MOCK ANALYSIS (demo mode — no Gemini key)
// ─────────────────────────────────────────────────────────
function getMockAnalysis() {
  return {
    detected_items: [
      { name: 'cooked chicken', quantity_estimate: '300g', condition: 'cooked', visible_concerns: 'none visible' },
      { name: 'cooked rice', quantity_estimate: '200g', condition: 'cooked', visible_concerns: 'none visible' },
      { name: 'cut tomatoes', quantity_estimate: '100g', condition: 'raw', visible_concerns: 'slightly wilted edges' },
    ],
    preparation_visible: true,
    estimated_dish: 'Chicken Rice Bowl',
    visible_spoilage_signs: [],
    physical_contaminants_found: [],
    cross_contamination_risks: [],
    packaging_or_storage_issues: [],
    storage_visible: 'open air, appears to be at room temperature',
    overall_visual_safety: 'CAUTION',
    ai_immediate_concern: 'Cooked proteins left at room temperature in warm conditions — safe window is limited'
  };
}

// ─────────────────────────────────────────────────────────
// RISK SCORE CALCULATOR (0-100)
// ─────────────────────────────────────────────────────────
function calculateRiskScore(visualSafety, ingredientRisk) {
  let score = 0;
  
  // Base score off the AI's visual assessment
  if (visualSafety === 'DANGER') score += 75;
  else if (visualSafety === 'WARNING') score += 50;
  else if (visualSafety === 'CAUTION') score += 25;
  else score += 0; // SAFE

  // Add modifiers for the highest risk biological ingredient present
  if (ingredientRisk === 'CRITICAL') score += 25;
  else if (ingredientRisk === 'HIGH') score += 15;
  else if (ingredientRisk === 'MODERATE') score += 5;

  // Cap at 100
  return Math.min(100, score);
}

module.exports = { inspectFood, analyzeImageWithGemini, adjustForTemperature, calculateRiskScore };
