import { GoogleGenerativeAI, SchemaType, type Schema } from '@google/generative-ai';
import { geminiApiKey, hasGeminiApiKey } from '../config/env';

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

const recipeSchema: Schema = {
    type: SchemaType.OBJECT,
    properties: {
        title: { type: SchemaType.STRING },
        cookTime: { type: SchemaType.STRING },
        servings: { type: SchemaType.INTEGER },
        difficulty: { type: SchemaType.STRING },
        ingredients: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
        },
        steps: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
        },
        tips: { type: SchemaType.STRING },
    },
    required: ['title', 'cookTime', 'servings', 'difficulty', 'ingredients', 'steps', 'tips'],
};

const GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash'];

function parseRecipe(rawText: string): AIRecipe {
    const cleaned = rawText
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        .trim();

    if (!cleaned) {
        throw new Error('Gemini returned an empty response.');
    }

    const recipe = JSON.parse(cleaned) as Partial<AIRecipe>;

    if (
        !recipe.title ||
        !recipe.cookTime ||
        typeof recipe.servings !== 'number' ||
        !recipe.difficulty ||
        !Array.isArray(recipe.ingredients) ||
        recipe.ingredients.length === 0 ||
        !Array.isArray(recipe.steps) ||
        recipe.steps.length === 0 ||
        !recipe.tips
    ) {
        throw new Error('Gemini returned an incomplete recipe. Please try again.');
    }

    return recipe as AIRecipe;
}

function mapGeminiError(error: unknown): string {
    if (!(error instanceof Error)) {
        return 'Unable to generate an AI recipe right now. Please try again.';
    }

    const message = error.message || 'Unable to generate an AI recipe right now. Please try again.';
    const lower = message.toLowerCase();

    if (lower.includes('api key not valid') || lower.includes('invalid api key')) {
        return 'Gemini API key is invalid. Verify VITE_GEMINI_API_KEY in Vercel and redeploy.';
    }

    if (lower.includes('permission denied') || lower.includes('permission_denied')) {
        return 'Gemini request was denied. Check key permissions and Gemini API access in Google AI Studio.';
    }

    if (lower.includes('quota') || lower.includes('resource_exhausted')) {
        return 'Gemini quota was exceeded. Check usage limits, then try again.';
    }

    if (lower.includes('model') && lower.includes('not found')) {
        return 'Gemini model access failed for this key. Check model availability in your account.';
    }

    return message;
}

export { hasGeminiApiKey };

export async function generateRecipe(ingredients: string[]): Promise<AIRecipe | null> {
    if (!hasGeminiApiKey || !geminiApiKey) {
        console.warn('Gemini API key not set. Skipping AI recipe generation.');
        return null;
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const prompt = `${SYSTEM_PROMPT}\n\nUser's ingredients: ${ingredients.join(', ')}`;

    let lastError: unknown = null;

    for (const modelName of GEMINI_MODELS) {
        try {
            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    responseMimeType: 'application/json',
                    responseSchema: recipeSchema,
                },
            });

            const result = await model.generateContent(prompt);
            return parseRecipe(result.response.text());
        } catch (error) {
            lastError = error;
            console.error(`Failed to generate AI recipe with ${modelName}:`, error);
        }
    }

    throw new Error(mapGeminiError(lastError));
}
