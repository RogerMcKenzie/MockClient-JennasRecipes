import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Typography, Container } from '@mui/material';
import theme from './theme';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RecipesPage from './pages/RecipesPage';
import StorePage from './pages/StorePage';

function Home() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
      <Container maxWidth="md">
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700 }}>
          Welcome to Jenna's Kitchen
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 6 }}>
          Discover amazing AI-generated recipes and high-quality kitchen supplies.
        </Typography>
        <Box
          component="img"
          src="/Images/JennaRecipe.jpeg"
          alt="Jenna"
          sx={{
            width: '100%',
            maxWidth: 400,
            borderRadius: '50%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}
        />
      </Container>
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <BrowserRouter>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/recipes" element={<RecipesPage />} />
                <Route path="/store" element={<StorePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  );
}
