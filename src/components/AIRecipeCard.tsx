import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import type { AIRecipe } from '../services/aiService';

interface AIRecipeCardProps {
    recipe: AIRecipe;
}

export default function AIRecipeCard({ recipe }: AIRecipeCardProps) {
    return (
        <Card
            sx={{
                position: 'relative',
                overflow: 'visible',
                border: '2px solid transparent',
                backgroundClip: 'padding-box',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -2,
                    left: -2,
                    right: -2,
                    bottom: -2,
                    borderRadius: '18px',
                    background: 'linear-gradient(135deg, #4caf50 0%, #ff8c69 50%, #2e7d32 100%)',
                    zIndex: -1,
                },
                '&:hover': {
                    transform: 'translateY(-2px)',
                },
            }}
        >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #ff8c69 0%, #ff613b 100%)',
                            flexShrink: 0,
                        }}
                    >
                        <AutoAwesomeIcon sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="overline"
                            sx={{
                                color: 'secondary.main',
                                fontWeight: 700,
                                letterSpacing: 1.5,
                                fontSize: '0.7rem',
                            }}
                        >
                            AI-Generated Recipe
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                fontFamily: '"Playfair Display", serif',
                                fontWeight: 700,
                                fontSize: { xs: '1.5rem', md: '2rem' },
                                lineHeight: 1.2,
                            }}
                        >
                            {recipe.title}
                        </Typography>
                    </Box>
                </Box>

                {/* Meta chips */}
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
                    <Chip
                        icon={<AccessTimeIcon />}
                        label={recipe.cookTime}
                        variant="outlined"
                        sx={{ borderColor: 'primary.light', color: 'text.primary' }}
                    />
                    <Chip
                        icon={<PeopleIcon />}
                        label={`${recipe.servings} servings`}
                        variant="outlined"
                        sx={{ borderColor: 'primary.light', color: 'text.primary' }}
                    />
                    <Chip
                        icon={<SignalCellularAltIcon />}
                        label={recipe.difficulty}
                        variant="outlined"
                        sx={{ borderColor: 'primary.light', color: 'text.primary' }}
                    />
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Ingredients & Steps side-by-side on desktop */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: { xs: 3, md: 4 },
                    }}
                >
                    {/* Ingredients */}
                    <Box sx={{ flex: { md: '0 0 40%' } }}>
                        <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>
                            🧾 Ingredients
                        </Typography>
                        <List dense disablePadding>
                            {recipe.ingredients.map((ing, i) => (
                                <ListItem key={i} disableGutters sx={{ py: 0.3 }}>
                                    <ListItemIcon sx={{ minWidth: 28 }}>
                                        <CheckCircleOutlineIcon
                                            sx={{ fontSize: 16, color: 'primary.main' }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={ing}
                                        primaryTypographyProps={{
                                            variant: 'body2',
                                            sx: { lineHeight: 1.5 },
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>

                    {/* Steps */}
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>
                            👩‍🍳 Instructions
                        </Typography>
                        <List disablePadding>
                            {recipe.steps.map((step, i) => (
                                <ListItem
                                    key={i}
                                    disableGutters
                                    sx={{
                                        alignItems: 'flex-start',
                                        py: 0.8,
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 32, mt: 0.3 }}>
                                        <Box
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: '50%',
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                            }}
                                        >
                                            {i + 1}
                                        </Box>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={step}
                                        primaryTypographyProps={{
                                            variant: 'body2',
                                            sx: { lineHeight: 1.6 },
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Box>

                {/* Chef's Tip */}
                {recipe.tips && (
                    <Paper
                        elevation={0}
                        sx={{
                            mt: 3,
                            p: 2.5,
                            bgcolor: '#FFF8E1',
                            borderRadius: 3,
                            border: '1px solid #FFE082',
                            display: 'flex',
                            gap: 1.5,
                            alignItems: 'flex-start',
                        }}
                    >
                        <LightbulbIcon sx={{ color: '#F9A825', mt: 0.2 }} />
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.3 }}>
                                Jenna's Tip
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                {recipe.tips}
                            </Typography>
                        </Box>
                    </Paper>
                )}
            </CardContent>
        </Card>
    );
}
