import { Card, CardMedia, CardContent, Typography, Button, CardActions } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface RecipeCardProps {
    title: string;
    image: string;
    id: number;
}

const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY;

export default function RecipeCard({ title, image, id }: RecipeCardProps) {
    const handleView = async () => {
        try {
            const response = await fetch(
                `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
            );
            const data = await response.json();
            if (data.sourceUrl) {
                window.open(data.sourceUrl, '_blank');
            }
        } catch (error) {
            console.error('Failed to fetch recipe details:', error);
        }
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <CardMedia
                component="img"
                height="180"
                image={image}
                alt={title}
                sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    textAlign="center"
                    sx={{ lineHeight: 1.3 }}
                >
                    {title}
                </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={handleView}
                >
                    View Recipe
                </Button>
            </CardActions>
        </Card>
    );
}
