import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  IconButton,
  Paper,
  TextField,
  InputAdornment,
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Snackbar,
  Avatar,
  Link as MuiLink
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Shield as ShieldIcon,
  Speed as SpeedIcon,
  Groups as GroupsIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  NotificationsActive as NotificationsIcon,
  Smartphone as MobileIcon,
  School as CampusIcon,
  TrendingUp as TrendingIcon,
  EmojiEvents as TrophyIcon,
  SupportAgent as SupportIcon,
  VerifiedUser as TrustIcon,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  ArrowRightAlt as ArrowRightIcon,
  PlayCircle as PlayIcon,
  Star as StarIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationCity as LocationCityIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Security as SecurityIcon,
  ConnectWithoutContact as ConnectIcon,
  AutoAwesome as AutoAwesomeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from '../components/common/UI/AnimatedBackground';
import GlassCard from '../components/common/UI/GlassCard';
import FloatingAnimation from '../components/common/UI/FloatingAnimation';

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const features = [
    {
      icon: <SearchIcon />,
      title: "Smart Search",
      description: "Advanced search with filters by location, category, date, and keywords",
      color: "#667eea"
    },
    {
      icon: <NotificationsIcon />,
      title: "Real-time Notifications",
      description: "Instant alerts when matching items are found or claims are made",
      color: "#4ecdc4"
    },
    {
      icon: <ShieldIcon />,
      title: "Secure Claims",
      description: "Verified ownership process with secure item claiming",
      color: "#ff6b6b"
    },
    {
      icon: <LocationIcon />,
      title: "Campus Mapping",
      description: "Interactive campus map showing lost and found hotspots",
      color: "#96ceb4"
    },
    {
      icon: <CategoryIcon />,
      title: "Category Management",
      description: "Organized categories for easy item classification",
      color: "#ffd166"
    },
    {
      icon: <MobileIcon />,
      title: "Mobile Responsive",
      description: "Fully responsive design for all devices",
      color: "#a267ac"
    }
  ];

  const testimonials = [
    {
      name: "Harini",
      role: "Student, Computer Science",
      text: "Found my lost laptop within hours! This platform is a lifesaver for students.",
      avatar: "https://i.pravatar.cc/150?img=1",
      rating: 5
    },
    {
      name: "Mathew Charles",
      role: "Andriod Developer (Java & Kotlin)",
      text: "As a Devloper, I appreciate how organized and efficient the system is.",
      avatar: "https://i.pravatar.cc/150?img=2",
      rating: 5
    },
    {
      name: "Dharshini",
      role: "Administrative Staff",
      text: "Streamlined our lost & found process dramatically. Highly recommended!",
      avatar: "https://i.pravatar.cc/150?img=3",
      rating: 5
    },
    {
      name: "Strutiloshan",
      role: "Administrative Staff",
      text: "Streamlined our lost & found process dramatically. Highly recommended!",
      avatar: "https://i.pravatar.cc/150?img=3",
      rating: 5
    }
  ];

  const stats = [
    { value: "500+", label: "Items Reunited", icon: <TrophyIcon /> },
    { value: "95%", label: "Satisfaction Rate", icon: <StarIcon /> },
    { value: "24h", label: "Average Return Time", icon: <SpeedIcon /> },
    { value: "1000+", label: "Active Users", icon: <GroupsIcon /> }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send to your backend
    console.log('Contact form submitted:', contactForm);
    setSnackbar({
      open: true,
      message: 'Thank you for your message! We\'ll get back to you soon.',
      severity: 'success'
    });
    setContactForm({ name: '', email: '', message: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box sx={{ 
      position: 'relative',
      minHeight: '100vh',
      background: 'ivory',
      color: 'white',
      overflow: 'hidden'
    }}>
      <AnimatedBackground />
      
      {/* Navigation Bar */}
      <Paper 
        elevation={0}
        sx={{ 
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background: 'rgba(63, 40, 82, 0.84)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(20, 18, 18, 0.2)'
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            py: 2
          }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }} onClick={() => window.scrollTo(0, 0)}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  background: 'linear-gradient(135deg, #4a1b88ff 0%, #e4daeeff 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                }}
              >
                <Typography
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                  }}
                >
                  🔍
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  background: 'linear-gradient(135deg, #e4e6ecff 0%, #efe5f8ff 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontWeight: 'bold',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Campus Lost & Found
              </Typography>
            </Box>

            {/* Navigation Links */}
            <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button 
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                sx={{ color: 'white' }}
              >
                Features
              </Button>
              <Button 
                onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
                sx={{ color: 'white' }}
              >
                About
              </Button>
              <Button 
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                sx={{ color: 'white' }}
              >
                Contact
              </Button>
            </Stack>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="contained"
                onClick={() => navigate(user ? '/dashboard' : '/login')}
                sx={{
                  background: 'linear-gradient(135deg, #29164dff 0%, #764ba2 100%)',
                  color: 'white',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
                  }
                }}
              >
                {user ? 'Go to Dashboard' : 'Get Started'}
              </Button>
            </Stack>
          </Box>
        </Container>
      </Paper>

      {/* Hero Section */}
      <Container maxWidth="xl" sx={{ py: 8, mt: 2 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={1000}>
              <Box>
                <Chip 
                  label="TRUSTED BY 1000+ STUDENTS" 
                  icon={<TrustIcon />}
                  sx={{ 
                    mb: 3,
                    background: 'rgba(103, 31, 124, 0.83)',
                    color: 'white',
                    fontWeight: 'medium'
                  }}
                />
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 'bold',
                    mb: 2,
                    background: 'linear-gradient(135deg, #2a144dff 0%, #8188aaff 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    lineHeight: 1.2
                  }}
                >
                  Never Lose Anything on Campus Again
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'rgba(84, 23, 102, 1)',
                    mb: 4,
                    fontWeight: 'normal'
                  }}
                >
                  The ultimate platform for reuniting lost items with their owners. 
                  Fast, secure, and built for campus communities.
                </Typography>
                
                {/* Search Bar */}
                <Paper
                  sx={{
                    p: 1,
                    background: 'rgba(80, 50, 105, 0.88)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    mb: 4
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Search for lost items (e.g., 'laptop', 'keys', 'wallet')"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.96)' }} />
                          </InputAdornment>
                        ),
                        sx: { color: 'white' }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { border: 'none' },
                          '&:hover fieldset': { border: 'none' },
                          '&.Mui-focused fieldset': { border: 'none' }
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleSearch}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 2,
                        minWidth: 100
                      }}
                    >
                      Search
                    </Button>
                  </Box>
                </Paper>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate(user ? '/dashboard' : '/register')}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.5)'
                      }
                    }}
                  >
                    {user ? 'Go to Dashboard' : 'Join Now - Free'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<PlayIcon />}
                    onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        background: 'rgba(255, 255, 255, 0.05)'
                      }
                    }}
                  >
                    Learn More
                  </Button>
                </Stack>
              </Box>
            </Fade>
          </Grid>

          <Grid item xs={12} md={6}>
            <Zoom in={true} timeout={1500}>
              <Box sx={{ position: 'relative' }}>
                <FloatingAnimation>
                  <Box
                    sx={{
                      width: '100%',
                      height: 400,
                      background: 'linear-gradient(135deg, rgba(53, 8, 83, 0.94) 0%, rgba(54, 19, 78, 0.71) 100%)',
                      borderRadius: 4,
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    {/* Mock Dashboard UI */}
                    <Box sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <Box sx={{ 
                          flex: 1, 
                          height: 120, 
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: 2,
                          p: 2
                        }}>
                          <Typography variant="h6" sx={{ color: 'white', fontSize: '0.9rem' }}>Lost Items</Typography>
                          <Typography variant="h3" sx={{ color: '#f73636ff' }}>42</Typography>
                        </Box>
                        <Box sx={{ 
                          flex: 1, 
                          height: 120, 
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: 2,
                          p: 2
                        }}>
                          <Typography variant="h6" sx={{ color: 'white', fontSize: '0.9rem' }}>Found Items</Typography>
                          <Typography variant="h3" sx={{ color: '#11eb1cff' }}>38</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ 
                        height: 200, 
                        background: 'rgba(207, 191, 223, 0.12)',
                        borderRadius: 2,
                        p: 2
                      }}>
                        <Typography sx={{ color: 'white', mb: 1 }}>Recent Activity</Typography>
                        {['📱 iPhone found at Library', '💻 Laptop claimed', '🎒 Bag reported lost'].map((item, idx) => (
                          <Box key={idx} sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mb: 1,
                            p: 1,
                            background: 'hsla(0, 0%, 100%, 0.20)',
                            borderRadius: 1
                          }}>
                            <CheckCircleIcon sx={{ color: '#4ed8cde7', fontSize: 16, mr: 1 }} />
                            <Typography sx={{ color: 'white', fontSize: '0.9rem' }}>{item}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </FloatingAnimation>
              </Box>
            </Zoom>
          </Grid>
        </Grid>
      </Container>

      {/* Stats Section */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Zoom in={true} timeout={500 + index * 200}>
                <GlassCard sx={{ p: 3, textAlign: 'center',background:'rgba(49, 16, 71, 0.78)'}}>
                  <Box sx={{ 
                    display: 'inline-flex',
                    p: 1.5,
                    background: 'rgba(247, 239, 239, 0.98)',
                    borderRadius: '50%',
                    mb: 2
                  }}>
                    {React.cloneElement(stat.icon, { sx: { fontSize: 32, color: '#1d39b8ff' } })}
                  </Box>
                  <Typography variant="h3" sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    mb: 1
                  }}>
                    {stat.value}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {stat.label}
                  </Typography>
                </GlassCard>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box id="features" sx={{ py: 8, background: 'rgba(63, 40, 82, 0.7)' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip 
              label="FEATURES" 
              sx={{ 
                mb: 2,
                background: 'rgba(17, 53, 214, 0.2)',
                color: '#0f1f63ff',
                fontWeight: 'bold'
              }}
            />
            <Typography variant="h2" sx={{ 
              color: 'white',
              fontWeight: 'bold',
              mb: 2
            }}>
              Everything You Need to Stay Connected
            </Typography>
            <Typography variant="h5" sx={{ 
              color: 'white',
              maxWidth: 600,
              mx: 'auto'
            }}>
              Powerful features designed specifically for campus communities
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Fade in={true} timeout={500 + index * 100}>
                  <GlassCard sx={{ 
                    p: 3, 
                    height: '100%',
                    background:'rgba(63, 40, 82, 0.7)',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      background:'rgba(40, 30, 48, 0.7)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                    }
                  }}>
                    <Box sx={{ 
                      display: 'inline-flex',
                      p: 2,
                      background: `rgba(${parseInt(feature.color.slice(1,3), 16)}, ${parseInt(feature.color.slice(3,5), 16)}, ${parseInt(feature.color.slice(5,7), 16)}, 0.2)`,
                      borderRadius: 2,
                      mb: 3
                    }}>
                      {React.cloneElement(feature.icon, { sx: { fontSize: 32, color: feature.color } })}
                    </Box>
                    <Typography variant="h5" sx={{ 
                      color: 'white',
                      fontWeight: 'bold',
                      mb: 2
                    }}>
                      {feature.title}
                    </Typography>
                    <Typography sx={{ color: 'white' }}>
                      {feature.description}
                    </Typography>
                  </GlassCard>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* About Us Section */}
      <Box id="about" sx={{ py: 8 }}>
        <Container maxWidth="xl">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box>
                <Chip 
                  label="ABOUT US" 
                  sx={{ 
                    mb: 3,
                    background: 'rgba(78, 205, 196, 0.2)',
                    color: '#4ecdc4',
                    fontWeight: 'bold'
                  }}
                />
                <Typography variant="h2" sx={{ 
                  color: 'rgba(50, 4, 88, 0.7)',
                  fontWeight: 'bold',
                  mb: 3
                }}>
                  Our Mission: Connect Campus Communities
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: 'rgba(63, 40, 82, 0.87)',
                  mb: 4,
                  fontSize: '1.1rem',
                  lineHeight: 1.8
                }}>
                  Campus Lost & Found was born from a simple observation: students lose items every day, 
                  and traditional lost & found systems are inefficient. We created a modern platform that 
                  leverages technology to quickly reunite items with their owners.
                </Typography>
                
                <List sx={{ mb: 4 }}>
                  {[
                    'Founded by students, for students',
                    'Serving multiple campuses nationwide',
                    '24/7 automated matching system',
                    'Secure and privacy-focused',
                    'Free for all students and faculty',
                    'Integrated with campus security'
                  ].map((item, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#4ecdc4' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={item}
                        primaryTypographyProps={{ 
                          sx: { color: 'rgba(63, 40, 82, 0.97)' }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <GlassCard sx={{ p: 4,background:'rgba(63, 40, 82, 0.84)'}}>
                <Typography variant="h5" sx={{ 
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 3,
                  textAlign: 'center'
                }}>
                  Why Choose Our Platform?
                </Typography>
                
                <Grid container spacing={3}>
                  {[
                    {
                      icon: <AutoAwesomeIcon />,
                      title: "Smart Matching",
                      desc: "AI-powered matching algorithm"
                    },
                    {
                      icon: <SecurityIcon />,
                      title: "100% Secure",
                      desc: "End-to-end encrypted communication"
                    },
                    {
                      icon: <SpeedIcon />,
                      title: "Lightning Fast",
                      desc: "Average return time: 24 hours"
                    },
                    {
                      icon: <ConnectIcon />,
                      title: "Community Driven",
                      desc: "Built trust with campus communities"
                    }
                  ].map((item, index) => (
                    <Grid item xs={6} key={index}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Box sx={{ 
                          display: 'inline-flex',
                          p: 2,
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '50%',
                          mb: 2
                        }}>
                          {React.cloneElement(item.icon, { sx: { fontSize: 32, color: '#667eea' } })}
                        </Box>
                        <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {item.desc}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </GlassCard>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* App Description Section */}
      <Box sx={{ py: 8, background: 'rgba(63, 40, 82, 0.7)' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip 
              label="APP OVERVIEW" 
              sx={{ 
                mb: 2,
                background: 'rgba(255, 107, 107, 0.2)',
                color: '#ff6b6b',
                fontWeight: 'bold'
              }}
            />
            <Typography variant="h2" sx={{ 
              color: 'white',
              fontWeight: 'bold',
              mb: 3
            }}>
              How It Works
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                step: "01",
                title: "Report or Find",
                description: "Report lost items or register found items with photos and details",
                icon: <DescriptionIcon />
              },
              {
                step: "02",
                title: "Smart Matching",
                description: "Our system automatically matches lost and found items",
                icon: <ConnectIcon />
              },
              {
                step: "03",
                title: "Secure Verification",
                description: "Verify ownership through secure identification process",
                icon: <TrustIcon />
              },
              {
                step: "04",
                title: "Reunion & Rating",
                description: "Items are returned and users rate their experience",
                icon: <TrophyIcon />
              }
            ].map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50%',
                    mb: 3,
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'white'
                  }}>
                    {step.step}
                  </Box>
                  <Box sx={{ 
                    display: 'inline-flex',
                    p: 2,
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    mb: 2
                  }}>
                    {React.cloneElement(step.icon, { sx: { fontSize: 32, color: '#667eea' } })}
                  </Box>
                  <Typography variant="h5" sx={{ 
                    color: 'white',
                    fontWeight: 'bold',
                    mb: 2
                  }}>
                    {step.title}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip 
            label="TESTIMONIALS" 
            sx={{ 
              mb: 2,
              background: 'rgba(150, 206, 180, 0.2)',
              color: '#96ceb4',
              fontWeight: 'bold'
            }}
          />
          <Typography variant="h2" sx={{ 
            color: 'rgba(63, 40, 82, 0.84)',
            fontWeight: 'bold',
            mb: 2
          }}>
            Loved by Students & Faculty
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <GlassCard sx={{ p: 3, height: '100%',background:'rgba(63, 40, 82, 0.84)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar src={testimonial.avatar} sx={{ width: 60, height: 60, mr: 2 }} />
                  <Box>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {testimonial.role}
                    </Typography>
                  </Box>
                </Box>
                <Typography sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontStyle: 'italic',
                  mb: 2
                }}>
                  "{testimonial.text}"
                </Typography>
                <Box sx={{ display: 'flex' }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} sx={{ color: '#ffd166', fontSize: 20 }} />
                  ))}
                </Box>
              </GlassCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Contact Us Section */}
      <Box id="contact" sx={{ py: 8, background: 'rgba(63, 40, 82, 0.7)' }}>
        <Container maxWidth="xl">
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Box>
                <Chip 
                  label="CONTACT US" 
                  sx={{ 
                    mb: 3,
                    background: 'rgba(255, 209, 102, 0.2)',
                    color: '#ffd166',
                    fontWeight: 'bold'
                  }}
                />
                <Typography variant="h2" sx={{ 
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 3
                }}>
                  Get In Touch
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  mb: 4,
                  fontSize: '1.1rem'
                }}>
                  Have questions? Need support? Our team is here to help you with any 
                  inquiries about the platform or assistance with lost items.
                </Typography>

                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '50%',
                      mr: 2
                    }}>
                      <EmailIcon sx={{ color: '#667eea' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white', mb: 0.5 }}>
                        Email Us
                      </Typography>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        support@campuslostfound.com
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '50%',
                      mr: 2
                    }}>
                      <PhoneIcon sx={{ color: '#4ecdc4' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white', mb: 0.5 }}>
                        Call Us
                      </Typography>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        +1 (555) 123-4567
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '50%',
                      mr: 2
                    }}>
                      <LocationCityIcon sx={{ color: '#96ceb4' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white', mb: 0.5 }}>
                        Campus Office
                      </Typography>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Team_3 Building, Room 205<br />
                        University Campus
                      </Typography>
                    </Box>
                  </Box>
                </Stack>

                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    Follow Us
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <IconButton sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
                      <Facebook />
                    </IconButton>
                    <IconButton sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
                      <Twitter />
                    </IconButton>
                    <IconButton sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
                      <Instagram />
                    </IconButton>
                    <IconButton sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
                      <LinkedIn />
                    </IconButton>
                  </Stack>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <GlassCard sx={{ p: 4,background:'rgba(63, 40, 82, 0.84)'}}>
                <Typography variant="h5" sx={{ 
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 3,
                  textAlign: 'center'
                }}>
                  Send Us a Message
                </Typography>
                
                <Box component="form" onSubmit={handleContactSubmit}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    required
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                        </InputAdornment>
                      )
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Your Email"
                    name="email"
                    type="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    required
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                        </InputAdornment>
                      )
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Your Message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    required
                    multiline
                    rows={4}
                    sx={{ mb: 3 }}
                  />
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      py: 1.5,
                      borderRadius: 2,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.5)'
                      }
                    }}
                  >
                    Send Message
                  </Button>
                </Box>
              </GlassCard>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <GlassCard sx={{ p: { xs: 3, md: 6 }, textAlign: 'center',background:'rgba(63, 40, 82, 0.84)' }}>
          <Typography variant="h2" sx={{ 
            color: 'white',
            fontWeight: 'bold',
            mb: 2
          }}>
            Ready to Join Our Community?
          </Typography>
          <Typography variant="h5" sx={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            mb: 4,
            maxWidth: 600,
            mx: 'auto'
          }}>
            Start finding and returning lost items today. It's free and takes only 2 minutes to sign up.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(user ? '/dashboard' : '/register')}
            endIcon={<ArrowForwardIcon />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              py: 2,
              px: 6,
              borderRadius: 2,
              fontSize: '1.1rem',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 30px rgba(102, 126, 234, 0.6)'
              }
            }}
          >
            {user ? 'Go to Dashboard' : 'Get Started Free'}
          </Button>
        </GlassCard>
      </Container>

      {/* Footer */}
      <Box sx={{ 
        py: 4,
        background: 'rgba(63, 40, 82, 0.84)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
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
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
                Reuniting lost items with their owners across campus communities since 2025.
              </Typography>
            </Grid>

            <Grid item xs={6} md={2}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                Platform
              </Typography>
              <Stack spacing={1}>
                <MuiLink href="#" sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', '&:hover': { color: '#667eea' } }}>
                  Lost Items
                </MuiLink>
                <MuiLink href="#" sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', '&:hover': { color: '#667eea' } }}>
                  Found Items
                </MuiLink>
                <MuiLink href="#" sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', '&:hover': { color: '#667eea' } }}>
                  Search
                </MuiLink>
                <MuiLink href="#" sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', '&:hover': { color: '#667eea' } }}>
                  Dashboard
                </MuiLink>
              </Stack>
            </Grid>

            <Grid item xs={6} md={2}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                Resources
              </Typography>
              <Stack spacing={1}>
                <MuiLink href="#about" sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', '&:hover': { color: '#667eea' } }}>
                  About Us
                </MuiLink>
                <MuiLink href="#features" sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', '&:hover': { color: '#667eea' } }}>
                  Features
                </MuiLink>
                <MuiLink href="#contact" sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', '&:hover': { color: '#667eea' } }}>
                  Contact
                </MuiLink>
                <MuiLink href="#" sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', '&:hover': { color: '#667eea' } }}>
                  Help Center
                </MuiLink>
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                Stay Updated
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                Subscribe to our newsletter for updates and tips.
              </Typography>
              <Paper sx={{ p: 1, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    placeholder="Your email"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { border: 'none' },
                        '&:hover fieldset': { border: 'none' }
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white'
                    }}
                  >
                    Subscribe
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 3 }} />

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2
          }}>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              © 2025 Campus Lost & Found. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={2}>
              <MuiLink href="#" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>
                Privacy Policy
              </MuiLink>
              <MuiLink href="#" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>
                Terms of Service
              </MuiLink>
              <MuiLink href="#" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>
                Cookie Policy
              </MuiLink>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LandingPage;