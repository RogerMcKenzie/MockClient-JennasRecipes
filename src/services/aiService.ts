import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AIRecipe {
    title: string;
    cookTime: string;
    servings: number;
    difficulty: string;
    ingredients: string[];
    steps: string[];
    tips: string;
}

const SYSTEM_PROMPT = `You are Jenna, a professional home chef who creates delicious, easy-to-follow recipes. Given a list of ingredients, generate a creative and appetizing recipe.

You MUST respond with ONLY valid JSON in this exact format, no markdown, no code fences, just raw JSON:
{
  "title": "Recipe Name",
  "cookTime": "30 minutes",
  "servings": 4,
  "difficulty": "Easy",
  "ingredients": [
    "2 chicken breasts, diced",
    "3 cloves garlic, minced"
  ],
  "steps": [
    "Preheat the oven to 375°F.",
    "Season the chicken with salt and pepper."
  ],
  "tips": "For extra flavor, let the chicken marinate for 30 minutes before cooking."
}`;

export async function generateRecipe(ingredients: string[]): Promise<AIRecipe | null> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        console.warn('Gemini API key not set. Skipping AI recipe generation.');
        return null;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `${SYSTEM_PROMPT}\n\nUser's ingredients: ${ingredients.join(', ')}`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Clean the response — remove markdown code fences if present
        const cleaned = text
            .replace(/```json\s*/gi, '')
            .replace(/```\s*/g, '')
            .trim();

        const recipe: AIRecipe = JSON.parse(cleaned);

        // Basic validation
        if (!recipe.title || !recipe.ingredients || !recipe.steps) {
            console.error('AI returned incomplete recipe:', recipe);
            return null;
        }

        return recipe;
    } catch (error) {
        console.error('Failed to generate AI recipe:', error);
        return null;
    }
}
