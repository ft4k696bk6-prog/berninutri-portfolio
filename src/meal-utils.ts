export type Ingredient = {
  name: string;
  grams: number;
  calories: number;
};

export type MealAnalysis = {
  mealName: string;
  totalWeightGrams: number;
  totalCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  sugarGrams: number;
  sodiumMg: number;
  confidence: "low" | "medium" | "high";
  ingredients: Ingredient[];
  notes: string;
};

export type Meal = {
  id: number;
  name: string;
  time: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  weight: number;
  confidence: MealAnalysis["confidence"];
  ingredients: Ingredient[];
  notes: string;
  source: "sample" | "ai";
};

export function mealFromAnalysis(analysis: MealAnalysis, image: string, now = new Date()): Meal {
  return {
    id: now.getTime(),
    name: analysis.mealName,
    time: new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit" }).format(now),
    image,
    calories: Math.round(analysis.totalCalories),
    protein: Math.round(analysis.proteinGrams),
    carbs: Math.round(analysis.carbsGrams),
    fat: Math.round(analysis.fatGrams),
    fiber: Math.round(analysis.fiberGrams),
    sugar: Math.round(analysis.sugarGrams),
    sodium: Math.round(analysis.sodiumMg),
    weight: Math.round(analysis.totalWeightGrams),
    confidence: analysis.confidence,
    ingredients: analysis.ingredients,
    notes: analysis.notes,
    source: "ai",
  };
}

export function macroPercent(value: number, goal: number) {
  if (goal <= 0) return "0%";
  return `${Math.min(100, Math.max(0, Math.round((value / goal) * 100)))}%`;
}
