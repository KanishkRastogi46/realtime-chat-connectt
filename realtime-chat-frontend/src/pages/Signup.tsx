import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Link,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import apiInstance from "../api/axios.config";

// Define the state types
interface SignupFormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State with type
  const [formState, setFormState] = useState<SignupFormState>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // Handler for input changes
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Form submission handler
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      let response = await apiInstance.post("/auth/register", formState);
      if (response.data.success) {
        navigate("/signin")
      }
    } catch (error) {
      console.log("Error during form submission: ", error);
    }
    // TODO: Add API call for signup
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'primary.contrastText', 
            py: 3,
            px: 2,
            textAlign: 'center'
          }}
        >
          <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
            Create your Account
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
            Join our community and start chatting in real-time
          </Typography>
        </Box>
        
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  required
                  name="username"
                  value={formState.username}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  type="email"
                  required
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Password"
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  required
                  name="password"
                  value={formState.password}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  variant="outlined"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  name="confirmPassword"
                  value={formState.confirmPassword}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleConfirmPasswordVisibility}
                          edge="end"
                          aria-label="toggle confirm password visibility"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ 
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    mt: 1
                  }}
                >
                  Sign Up
                </Button>
              </Grid>
              
              <Grid size={12}>
                <Divider sx={{ my: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    OR
                  </Typography>
                </Divider>
              </Grid>
            </Grid>
          </form>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link href="/signin" underline="hover" fontWeight="medium">
                Log In
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Signup;