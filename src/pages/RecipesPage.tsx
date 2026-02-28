import { useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    TextField,
    Button,
    CircularProgress,
    InputAdornment,
    Divider,
    Skeleton,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SearchIcon from '@mui/icons-material/Search';
import FlipCard from '../components/FlipCard';
import AIRecipeCard from '../components/AIRecipeCard';
import RecipeCard from '../components/RecipeCard';
import { favorites } from '../data/favorites';
import { generateRecipe, hasGeminiApiKey } from '../services/aiService';
import { hasSpoonacularApiKey, spoonacularApiKey } from '../config/env';
import type { AIRecipe } from '../services/aiService';

const hasSpoonacularKey = hasSpoonacularApiKey;

interface RecipeResult {
    id: number;
    title: string;
    image: string;
}

export default function RecipesPage() {
    const [query, setQuery] = useState('');
    const [aiRecipe, setAiRecipe] = useState<AIRecipe | null>(null);
    const [recipes, setRecipes] = useState<RecipeResult[]>([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [webLoading, setWebLoading] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);
    const [webError, setWebError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    const handleGenerate = async () => {
        const trimmed = query.trim();
        if (!trimmed) return;

        setSearched(true);
        setAiLoading(true);
        setWebLoading(true);
        setAiRecipe(null);
        setRecipes([]);
        setAiError(null);
        setWebError(null);

        const parts = trimmed.split(/[,\n]+/).map((s) => s.trim()).filter(Boolean);

        // Fire both AI and Spoonacular in parallel
        const aiPromise = generateRecipe(parts)
            .then((recipe) => {
                setAiRecipe(recipe);
                if (!recipe) {
                    setAiError(
                        hasGeminiApiKey
                            ? 'AI recipe generation failed. Please try again with different ingredients.'
                            : 'Set up a Gemini API key (VITE_GEMINI_API_KEY) in .env or Vercel, then redeploy to enable AI recipe generation.'
                    );
                }
            })
            .catch((err) => {
                console.error('AI generation failed:', err);
                setAiRecipe(null);

                if (!hasGeminiApiKey) {
                    setAiError('Set up a Gemini API key (VITE_GEMINI_API_KEY) in .env or Vercel, then redeploy to enable AI recipe generation.');
                    return;
                }

                setAiError(
                    err instanceof Error && err.message
                        ? err.message
                        : 'AI recipe generation failed. Please try again with different ingredients.'
                );
            })
            .finally(() => setAiLoading(false));

        const webPromise = !hasSpoonacularKey
            ? Promise.resolve()
                  .then(() => {
                      setRecipes([]);
                      setWebError('Set up a Spoonacular API key (VITE_SPOONACULAR_KEY) in .env or Vercel, then redeploy to enable web recipe search.');
                  })
                  .finally(() => setWebLoading(false))
            : fetch(
                  `https://api.spoonacular.com/recipes/complexSearch?apiKey=${spoonacularApiKey}&query=${encodeURIComponent(trimmed)}`
              )
                  .then(async (res) => {
                      if (!res.ok) {
                          const errorPayload = await res.json().catch(() => null);
                          const apiMessage =
                              errorPayload && typeof errorPayload.message === 'string'
                                  ? errorPayload.message
                                  : null;
                          throw new Error(apiMessage ?? `Spoonacular request failed (${res.status}).`);
                      }
                      return res.json();
                  })
                  .then((data) => {
                      const nextRecipes = Array.isArray(data.results) ? data.results : [];
                      setRecipes(nextRecipes);
                      if (nextRecipes.length === 0) {
                          setWebError('No additional recipes found.');
                      }
                  })
                  .catch((err) => {
                      console.error('Spoonacular fetch failed:', err);
                      setRecipes([]);
                      setWebError(
                          err instanceof Error
                              ? err.message
                              : 'Unable to fetch additional recipes right now. Please try again.'
                      );
                  })
                  .finally(() => setWebLoading(false));

        await Promise.all([aiPromise, webPromise]);
    };

    return (
        <Box>
            {/* Intro Section */}
            <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Typography variant="h2" sx={{ mb: 3, fontSize: { xs: '2rem', md: '2.8rem' } }}>
                                Recipes
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'text.secondary' }}
                            >
                                Welcome to Jenna's Recipes AI Recipe Generator, the online tool where you can find
                                amazing and creative recipes based on the ingredients you have. Powered by AI, this tool
                                creates unique, personalized recipes just for you. Whether you are looking for appetizers,
                                salads, soups, main courses, desserts, or drinks, you will find something to satisfy your
                                cravings here. All you have to do is list your ingredients or a dish name,
                                and the AI will generate a custom recipe for you.
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Box
                                component="img"
                                src="/Images/JennaDos.jpg"
                                alt="Jenna cooking"
                                sx={{
                                    width: '100%',
                                    borderRadius: 4,
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* AI Recipe Generator */}
            <Box sx={{ py: 8, bgcolor: 'white' }}>
                <Container maxWidth="md">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 4 }}>
                        <AutoAwesomeIcon sx={{ color: 'secondary.main', fontSize: 32 }} />
                        <Typography
                            variant="h3"
                            textAlign="center"
                            sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' } }}
                        >
                            AI Recipe Generator
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                        <TextField
                            fullWidth
                            placeholder="List Ingredients or Dish Name"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleGenerate();
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AutoAwesomeIcon color="primary" sx={{ fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    boxShadow: '0px 3px 15px rgba(0,0,0,0.08)',
                                    borderRadius: 3,
                                    bgcolor: '#fafafa',
                                    '& fieldset': { borderColor: 'transparent' },
                                    '&:hover fieldset': { borderColor: 'primary.light' },
                                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                },
                            }}
                        />
                    </Box>

                    <Box sx={{ textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleGenerate}
                            disabled={aiLoading || webLoading}
                            startIcon={
                                aiLoading || webLoading ? (
                                    <CircularProgress size={20} color="inherit" />
                                ) : (
                                    <AutoAwesomeIcon />
                                )
                            }
                            sx={{ px: 5, py: 1.5 }}
                        >
                            {aiLoading || webLoading ? 'Generating...' : 'Generate Recipe!'}
                        </Button>
                    </Box>

                    {/* Results */}
                    {searched && (
                        <Box sx={{ mt: 5 }}>
                            {/* AI-Generated Recipe */}
                            {aiLoading ? (
                                <Box>
                                    <Skeleton variant="rounded" height={60} sx={{ mb: 2, borderRadius: 3 }} />
                                    <Skeleton variant="rounded" height={200} sx={{ borderRadius: 3 }} />
                                </Box>
                            ) : aiRecipe ? (
                                <AIRecipeCard recipe={aiRecipe} />
                            ) : (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        fontStyle: 'italic',
                                        textAlign: 'center',
                                        py: 3,
                                        bgcolor: '#f9f9f9',
                                        borderRadius: 3,
                                    }}
                                >
                                    {aiError ?? 'AI recipe generation failed. Please try again with different ingredients.'}
                                </Typography>
                            )}

                            {/* More Recipes from the Web */}
                            <Divider sx={{ my: 4 }} />

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                                <SearchIcon sx={{ color: 'primary.main' }} />
                                <Typography
                                    variant="h5"
                                    sx={{ fontWeight: 700, fontSize: { xs: '1.2rem', md: '1.5rem' } }}
                                >
                                    More Recipes from the Web
                                </Typography>
                            </Box>

                            {webLoading ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : recipes.length > 0 ? (
                                <Grid container spacing={3}>
                                    {recipes.map((recipe) => (
                                        <Grid key={recipe.id} size={{ xs: 12, sm: 6, md: 4 }}>
                                            <RecipeCard title={recipe.title} image={recipe.image} id={recipe.id} />
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Typography textAlign="center" color="text.secondary">
                                    {webError ?? 'No additional recipes found.'}
                                </Typography>
                            )}
                        </Box>
                    )}
                </Container>
            </Box>

            <Divider />

            {/* Jenna's Favorites */}
            <Box sx={{ py: 8, bgcolor: 'background.default' }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        textAlign="center"
                        sx={{ mb: 2, fontSize: { xs: '1.8rem', md: '2.4rem' } }}
                    >
                        Jenna's Favorite Recipes
                    </Typography>
                    <Typography
                        textAlign="center"
                        color="text.secondary"
                        sx={{ mb: 6, maxWidth: 500, mx: 'auto' }}
                    >
                        Hover or tap to see the ingredients for each recipe
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {favorites.map((recipe) => (
                            <Grid key={recipe.id} size={{ xs: 12, sm: 6, md: 3 }}>
                                <FlipCard recipe={recipe} />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}
