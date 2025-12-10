
import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Stack,
  Divider
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 'auto',
        background: 'rgba(0, 0, 0, 0.3)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}
              >
                <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                  🔍
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                Campus Lost & Found
              </Typography>
            </Box>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
              Reuniting lost items with their owners across campus communities.
            </Typography>
            
            {/* Social Media */}
            <Stack direction="row" spacing={1}>
              <IconButton sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
                <LinkedIn fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
              Platform
            </Typography>
            <Stack spacing={1}>
              <Link href="/lost-items" sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', '&:hover': { color: '#667eea' } }}>
                Lost Items
              </Link>
              <Link href="/found-items" sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', '&:hover': { color: '#667eea' } }}>
                Found Items
              </Link>
              <Link href="/search" sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', '&:hover': { color: '#667eea' } }}>
                Search
              </Link>
              <Link href="/dashboard" sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', '&:hover': { color: '#667eea' } }}>
                Dashboard
              </Link>
            </Stack>
          </Grid>

          {/* Resources */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
              Resources
            </Typography>
            <Stack spacing={1}>
              <Link href="/about" sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', '&:hover': { color: '#667eea' } }}>
                About Us
              </Link>
              <Link href="/contact" sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', '&:hover': { color: '#667eea' } }}>
                Contact
              </Link>
              <Link href="/help" sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', '&:hover': { color: '#667eea' } }}>
                Help Center
              </Link>
              <Link href="/faq" sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', '&:hover': { color: '#667eea' } }}>
                FAQ
              </Link>
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ color: '#667eea', mr: 2, fontSize: 20 }} />
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  support@campuslostfound.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone sx={{ color: '#4ecdc4', mr: 2, fontSize: 20 }} />
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ color: '#96ceb4', mr: 2, fontSize: 20 }} />
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Student Union Building, Campus
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 3 }} />

        {/* Bottom Bar */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2
        }}>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            © {currentYear} Campus Lost & Found. All rights reserved.
          </Typography>
          
          <Stack direction="row" spacing={2}>
            <Link href="/privacy" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>
              Privacy Policy
            </Link>
            <Link href="/terms" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>
              Terms of Service
            </Link>
            <Link href="/cookies" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>
              Cookie Policy
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;