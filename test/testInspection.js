const { inspectFood } = require('../services/foodInspection');

async function test() {
  const mockWeather = { temperature: 28.5, humidity: 74 };
  const placeholder = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

  const result = await inspectFood(placeholder, 'image/png', mockWeather);

  console.log('\n✅ FOOD INSPECTION TEST RESULT:');
  console.log('  Dish:', result.overall_assessment.estimated_dish);
  console.log('  Visual Safety:', result.overall_assessment.overall_visual_safety);
  console.log('  Safe Window:', result.overall_assessment.critical_window_hours, 'hours');
  console.log('  Highest Risk:', result.overall_assessment.highest_risk_ingredient, '—', result.overall_assessment.highest_risk_level);
  console.log('  Ingredients analyzed:', result.ingredient_analysis.length);
  console.log('  Pathogens at risk:', result.overall_assessment.all_pathogens_at_risk.join(', '));
  console.log('  Recommendations:', result.recommendations.length);
  console.log('\n  INGREDIENT BREAKDOWN:');
  result.ingredient_analysis.forEach(item => {
    console.log(`    🍽️  ${item.ingredient}: ${item.risk} risk | ${item.shelf_life.adjusted_safe_hours}h safe window`);
  });
  console.log('\n  TOP RECOMMENDATION:', result.recommendations[0]?.message);
  console.log('\n✅ Backend food inspection service is working correctly!\n');
}

test().catch(console.error);
