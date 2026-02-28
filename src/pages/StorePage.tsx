import { useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Divider,
    Tabs,
    Tab,
    Chip,
} from '@mui/material';
import ProductCard from '../components/ProductCard';
import ShoppingCart from '../components/ShoppingCart';
import CheckoutForm from '../components/CheckoutForm';
import { products } from '../data/products';

const categories = ['All', 'Cookware', 'Knives & Blenders', 'Bowls & Plates', 'Spices'];

export default function StorePage() {
    const [activeCategory, setActiveCategory] = useState(0);

    const filteredProducts =
        activeCategory === 0
            ? products
            : products.filter((p) => p.category === categories[activeCategory]);

    return (
        <Box>
            {/* Intro Section */}
            <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Typography variant="h2" sx={{ mb: 3, fontSize: { xs: '2rem', md: '2.8rem' } }}>
                                Store
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'text.secondary' }}
                            >
                                Welcome to Jenna's Recipes Store, the online shop where you can find high-quality and
                                affordable products for your kitchen. I have carefully selected and tested the products
                                that I offer in my store, and I can guarantee that they will make your cooking and baking
                                experience more enjoyable and successful. Whether you are looking for cookware, bakeware,
                                utensils, appliances, or spices, you will find something to suit your needs and
                                preferences here.
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Box
                                component="img"
                                src="/Images/Supplies.jpg"
                                alt="Kitchen supplies"
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

            {/* Products Section */}
            <Box sx={{ py: 6, bgcolor: 'white' }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        textAlign="center"
                        sx={{ mb: 1, fontSize: { xs: '1.8rem', md: '2.4rem' } }}
                    >
                        Our Products
                    </Typography>
                    <Typography textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
                        Quality kitchen essentials for every home chef
                    </Typography>

                    {/* Category Tabs */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                        <Tabs
                            value={activeCategory}
                            onChange={(_, val) => setActiveCategory(val)}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    fontSize: '0.95rem',
                                    minWidth: 'auto',
                                    px: 3,
                                },
                            }}
                        >
                            {categories.map((cat, i) => (
                                <Tab
                                    key={cat}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {cat}
                                            {i === 0 && (
                                                <Chip label={products.length} size="small" color="primary" sx={{ height: 20 }} />
                                            )}
                                        </Box>
                                    }
                                />
                            ))}
                        </Tabs>
                    </Box>

                    {/* Product Grid */}
                    <Grid container spacing={3}>
                        {filteredProducts.map((product) => (
                            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 3 }}>
                                <ProductCard product={product} />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            <Divider />

            {/* Cart & Checkout */}
            <Box sx={{ py: 8, bgcolor: 'background.default' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={5}>
                        <Grid size={{ xs: 12, md: 5 }}>
                            <ShoppingCart />
                        </Grid>
                        <Grid size={{ xs: 12, md: 7 }}>
                            <CheckoutForm />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}
