const ANALYSIS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "mealName",
    "totalWeightGrams",
    "totalCalories",
    "proteinGrams",
    "carbsGrams",
    "fatGrams",
    "fiberGrams",
    "sugarGrams",
    "sodiumMg",
    "confidence",
    "ingredients",
    "notes",
  ],
  properties: {
    mealName: { type: "string" },
    totalWeightGrams: { type: "number" },
    totalCalories: { type: "number" },
    proteinGrams: { type: "number" },
    carbsGrams: { type: "number" },
    fatGrams: { type: "number" },
    fiberGrams: { type: "number" },
    sugarGrams: { type: "number" },
    sodiumMg: { type: "number" },
    confidence: { type: "string", enum: ["low", "medium", "high"] },
    ingredients: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "grams", "calories"],
        properties: {
          name: { type: "string" },
          grams: { type: "number" },
          calories: { type: "number" },
        },
      },
    },
    notes: { type: "string" },
  },
};

function extractOutputText(response) {
  if (typeof response.output_text === "string") {
    return response.output_text;
  }

  for (const item of response.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === "output_text" && typeof content.text === "string") {
        return content.text;
      }
    }
  }

  return "";
}

function normalizeAnalysis(analysis) {
  return {
    mealName: String(analysis.mealName || "Analyzed meal"),
    totalWeightGrams: Math.max(0, Number(analysis.totalWeightGrams) || 0),
    totalCalories: Math.max(0, Number(analysis.totalCalories) || 0),
    proteinGrams: Math.max(0, Number(analysis.proteinGrams) || 0),
    carbsGrams: Math.max(0, Number(analysis.carbsGrams) || 0),
    fatGrams: Math.max(0, Number(analysis.fatGrams) || 0),
    fiberGrams: Math.max(0, Number(analysis.fiberGrams) || 0),
    sugarGrams: Math.max(0, Number(analysis.sugarGrams) || 0),
    sodiumMg: Math.max(0, Number(analysis.sodiumMg) || 0),
    confidence: ["low", "medium", "high"].includes(analysis.confidence) ? analysis.confidence : "medium",
    ingredients: Array.isArray(analysis.ingredients)
      ? analysis.ingredients.slice(0, 8).map((ingredient) => ({
          name: String(ingredient.name || "Ingredient"),
          grams: Math.max(0, Number(ingredient.grams) || 0),
          calories: Math.max(0, Number(ingredient.calories) || 0),
        }))
      : [],
    notes: String(analysis.notes || "Nutrition values are AI estimates based on the visible plate."),
  };
}

async function readRequestBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  return rawBody ? JSON.parse(rawBody) : {};
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      code: "missing_openai_key",
      message: "AI is not configured yet. Add OPENAI_API_KEY in Vercel environment variables and redeploy.",
    });
  }

  try {
    const { image, imageUrl } = await readRequestBody(req);
    const inputImage = typeof image === "string" && image.startsWith("data:image/")
      ? image
      : typeof imageUrl === "string" && /^https:\/\//.test(imageUrl)
        ? imageUrl
        : "";

    if (!inputImage) {
      return res.status(400).json({ message: "Send an image data URL or HTTPS imageUrl." });
    }

    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text:
                  "Analyze this meal photo for a consumer nutrition tracker. Estimate visible food only. Return practical, approximate nutrition values. If the image is not a meal, say so in notes and keep confidence low.",
              },
              {
                type: "input_image",
                image_url: inputImage,
                detail: "high",
              },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "meal_analysis",
            strict: true,
            schema: ANALYSIS_SCHEMA,
          },
        },
        max_output_tokens: 1200,
      }),
    });

    const payload = await openaiResponse.json();
    if (!openaiResponse.ok) {
      return res.status(openaiResponse.status).json({
        message: payload?.error?.message || "OpenAI analysis failed.",
      });
    }

    const outputText = extractOutputText(payload);
    if (!outputText) {
      return res.status(502).json({ message: "OpenAI returned no analysis text." });
    }

    const parsedAnalysis = JSON.parse(outputText);
    return res.status(200).json({ analysis: normalizeAnalysis(parsedAnalysis) });
  } catch (error) {
    console.error("Meal analysis failed", error);
    return res.status(500).json({ message: "Meal analysis failed. Try another photo." });
  }
}
