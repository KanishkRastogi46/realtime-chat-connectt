import React from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Box, 
  Grid, 
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Fade,
  Slide,
  Divider,
  Avatar,
  Stack
} from "@mui/material";
import { 
  Menu as MenuIcon,
  Security,
  Speed,
  Devices,
  Groups,
  PersonAdd,
  CloudUpload,
  Close as CloseIcon
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router";
import { keyframes } from "@mui/system";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const App: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const features = [
    { icon: <Security fontSize="large" color="primary" />, title: "Secure Messaging", description: "End-to-end encryption ensures your conversations remain private and secure." },
    { icon: <Speed fontSize="large" color="primary" />, title: "Real-Time Updates", description: "Instant message delivery with typing indicators and read receipts." },
    { icon: <Devices fontSize="large" color="primary" />, title: "Cross-Platform", description: "Access your chats from any device - web, mobile, or desktop." },
    { icon: <Groups fontSize="large" color="primary" />, title: "Group Chats", description: "Create dedicated spaces for teams, projects or friend groups." },
    { icon: <PersonAdd fontSize="large" color="primary" />, title: "Easy Onboarding", description: "Add team members quickly with simple invitation links." },
    { icon: <CloudUpload fontSize="large" color="primary" />, title: "File Sharing", description: "Share documents, images and videos with your contacts securely." }
  ]
  
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Manager",
      comment: "Connectt has transformed how our team communicates. The real-time features are incredibly reliable.",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      name: "Alex Chen",
      role: "Software Developer",
      comment: "The best chat platform I've used. Clean interface and excellent performance even with large group chats.",
      avatar: "https://randomuser.me/api/portraits/men/44.jpg"
    },
    {
      name: "Maya Patel",
      role: "Project Manager",
      comment: "We've cut down on email by 70% since adopting Connectt for our team communications.",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center', 
        p: 2, 
        bgcolor: 'primary.main', 
        color: 'white'
      }}>
        <Typography variant="h6" component="div">
          Connectt
        </Typography>
        <IconButton 
          color="inherit" 
          aria-label="close drawer" 
          onClick={handleDrawerToggle}
          edge="end"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        <ListItem component={RouterLink} to="/signin" onClick={handleDrawerToggle}>
          <ListItemText primary="Login" />
        </ListItem>
        <ListItem component={RouterLink} to="/signup" onClick={handleDrawerToggle}>
          <ListItemText primary="Sign Up" />
        </ListItem>
        <ListItem component={RouterLink} to="/features" onClick={handleDrawerToggle}>
          <ListItemText primary="Features" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
        <Toolbar>
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold', 
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box 
              component="span" 
              sx={{ 
                mr: 1, 
                display: 'inline-block', 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                bgcolor: 'primary.main' 
              }}
            />
            Connectt
          </Typography>
          
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box>
              <Button 
                component={RouterLink} 
                to="/features"
                color="inherit"
                sx={{ mx: 1 }}
              >
                Features
              </Button>
              <Button 
                component={RouterLink} 
                to="/signin"
                variant="outlined" 
                color="primary" 
                sx={{ mx: 1 }}
              >
                Login
              </Button>
              <Button 
                component={RouterLink} 
                to="/signup"
                variant="contained" 
                color="primary" 
                sx={{ mx: 1 }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          anchor="right"
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <Box 
          sx={{ 
            bgcolor: 'background.paper',
            position: 'relative',
            overflow: 'hidden',
            pt: { xs: 6, md: 12 },
            pb: { xs: 8, md: 14 }
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <Fade in={true} style={{ transitionDelay: '100ms' }}>
                  <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography 
                      variant="h2" 
                      component="h1" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: { xs: '2.5rem', md: '3.75rem' }
                      }}
                    >
                      Connect and Chat <Box component="span" sx={{ color: 'primary.main' }}>in Real-time</Box>
                    </Typography>
                    <Typography 
                      variant="h6" 
                      color="text.secondary" 
                      paragraph
                      sx={{ mb: 4 }}
                    >
                      Secure, fast, and intuitive messaging platform for teams and friends. 
                      Experience seamless communication across all your devices.
                    </Typography>
                    <Stack 
                      direction={{ xs: 'column', sm: 'row' }} 
                      spacing={2} 
                      justifyContent={{ xs: 'center', md: 'flex-start' }}
                    >
                      <Button 
                        variant="contained" 
                        color="primary" 
                        size="large"
                        component={RouterLink}
                        to="/signup"
                        sx={{ 
                          py: 1.5, 
                          px: 4, 
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          textTransform: 'none' 
                        }}
                      >
                        Get Started Free
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        size="large"
                        component={RouterLink}
                        to="/demo"
                        sx={{ 
                          py: 1.5, 
                          px: 4, 
                          fontWeight: 'medium',
                          textTransform: 'none' 
                        }}
                      >
                        See Demo
                      </Button>
                    </Stack>
                  </Box>
                </Fade>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Slide direction="left" in={true} mountOnEnter unmountOnExit>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center',
                      animation: `${fadeIn} 1s ease-out`
                    }}
                  >
                    <Box 
                      component="img" 
                      src="https://via.placeholder.com/600x400?text=Connectt+App+Preview" 
                      alt="Connectt App Preview"
                      sx={{
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: 2,
                        boxShadow: 3
                      }}
                    />
                  </Box>
                </Slide>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: 8, bgcolor: 'background.default' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="overline" color="primary" fontWeight="medium">
                Why Choose Connectt
              </Typography>
              <Typography 
                variant="h3" 
                component="h2" 
                fontWeight="bold" 
                gutterBottom
              >
                Powerful Features
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ 
                  maxWidth: '800px', 
                  mx: 'auto' 
                }}
              >
                Everything you need for seamless communication with your team and friends
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {
              features.map((feature, index) => (
                <Grid size={{ xs: 12, sm: 4, md: 6 }} key={index}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      height: '100%',
                      p: 2,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Testimonials Section */}
        <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="overline" color="primary" fontWeight="medium">
                Testimonials
              </Typography>
              <Typography 
                variant="h3" 
                component="h2" 
                fontWeight="bold" 
                gutterBottom
              >
                What Our Users Say
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {testimonials.map((testimonial, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={index}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      height: '100%', 
                      borderRadius: 2,
                      p: 2,
                      bgcolor: 'background.default' 
                    }}
                  >
                    <CardContent>
                      <Typography 
                        variant="body1" 
                        paragraph
                        sx={{ mb: 2, fontStyle: 'italic' }}
                      >
                        "{testimonial.comment}"
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          sx={{ mr: 2 }} 
                        />
                        <Box>
                          <Typography variant="subtitle2" component="div">
                            {testimonial.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {testimonial.role}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box 
          sx={{ 
            py: 10, 
            bgcolor: 'primary.main', 
            color: 'primary.contrastText',
            textAlign: 'center'
          }}
        >
          <Container maxWidth="md">
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              fontWeight="bold"
            >
              Ready to get started?
            </Typography>
            <Typography 
              variant="h6" 
              paragraph
              sx={{ 
                mb: 4, 
                opacity: 0.9,
                maxWidth: '700px',
                mx: 'auto'
              }}
            >
              Join thousands of teams that use Connectt for seamless communication.
              Try it free for 30 days, no credit card required.
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              component={RouterLink}
              to="/signup"
              sx={{ 
                py: 1.5, 
                px: 4, 
                fontWeight: 'bold',
                fontSize: '1.1rem',
                textTransform: 'none',
                borderRadius: 2
              }}
            >
              Create Free Account
            </Button>
          </Container>
        </Box>
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 5, 
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary" align="center">
              © {new Date().getFullYear()} Connectt. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default App;