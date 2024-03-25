import { useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { CssBaseline } from "@mui/material";

import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/system";

import { i18n } from "../../translate/i18n";

import { AuthContext } from "../../context/Auth/AuthContext";
import Footer from "../../components/Footer";
import Logo from "../../components/Logo";

const MainContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: (theme) => theme.spacing(8),
});

const StyledForm = styled('form')(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(1),
}));

const Login = () => {
  const theme = useTheme();
  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin } = useContext(AuthContext);

  const handleChangeInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(user);
  };

  return (
    <MainContainer maxWidth="xs">
      <CssBaseline />
      <Logo />
      <Typography component="h1" style={{ marginTop: theme.spacing(3) }} variant="h5">
        {i18n.t("login.title")}
      </Typography>
      <StyledForm noValidate onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label={i18n.t("login.form.email")}
          name="email"
          value={user.email}
          onChange={handleChangeInput}
          autoComplete="email"
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label={i18n.t("login.form.password")}
          id="password"
          value={user.password}
          onChange={handleChangeInput}
          autoComplete="current-password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: theme.spacing(3), mb: theme.spacing(2) }}
        >
          {i18n.t("login.buttons.submit")}
        </Button>
        <Grid container justifyContent="center">
          <Grid item>
            <RouterLink
              href="#"
              variant="body2"
              component={RouterLink}
              to="/signup"
            >
              {i18n.t("login.buttons.register")}
            </RouterLink>
          </Grid>
        </Grid>
      </StyledForm>
      <Box mt={8}>
        {/* <Copyright /> */}
      </Box>
      <Footer />
    </MainContainer>
  );
};

export default Login;
