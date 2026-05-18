import { describe, expect, it } from "vitest";
import { macroPercent, mealFromAnalysis, type MealAnalysis } from "./meal-utils";

const analysis: MealAnalysis = {
  mealName: "Chicken bowl",
  totalWeightGrams: 420.6,
  totalCalories: 612.4,
  proteinGrams: 41.7,
  carbsGrams: 52.2,
  fatGrams: 19.5,
  fiberGrams: 8.3,
  sugarGrams: 6.2,
  sodiumMg: 710.8,
  confidence: "medium",
  ingredients: [{ name: "Chicken", grams: 140, calories: 230 }],
  notes: "Approximate AI estimate.",
};

describe("meal utils", () => {
  it("turns an AI analysis into a saved meal", () => {
    const meal = mealFromAnalysis(analysis, "data:image/jpeg;base64,abc", new Date("2026-05-18T10:30:00Z"));

    expect(meal.name).toBe("Chicken bowl");
    expect(meal.calories).toBe(612);
    expect(meal.protein).toBe(42);
    expect(meal.source).toBe("ai");
  });

  it("caps macro progress at 100 percent", () => {
    expect(macroPercent(120, 100)).toBe("100%");
    expect(macroPercent(25, 100)).toBe("25%");
    expect(macroPercent(25, 0)).toBe("0%");
  });
});
