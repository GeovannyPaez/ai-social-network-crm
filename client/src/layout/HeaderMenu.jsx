
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar } from './StyledComponents';
import { Box, Menu, MenuItem, Stack } from '@mui/material';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/Auth/AuthContext';
import { AccountCircle } from '@mui/icons-material';
import NotificationsPopOver from '../components/NotificationsPopOver';
import { i18n } from "../translate/i18n";
import Logo from '../components/Logo';
export default function HeaderMenu({ open, handleDrawerOpen, setUserModalOpen }) {

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { handleLogout } = useContext(AuthContext);
  const { user } = useContext(AuthContext);




  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const handleOpenUserModal = () => {
    setUserModalOpen(true);
    handleCloseMenu();
  };

  const handleClickLogout = () => {
    handleCloseMenu();
    handleLogout();
  };



  return (
    <AppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Stack direction={"row"} alignItems={"center"} justifyItems={"center"} spacing={2}>
          <Logo
            width={50}
            heigth={50}
          />
          <Typography variant="h6" noWrap component="div">
            Net AI
          </Typography>
        </Stack>

        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '80%',
        }}>
          {user.id && <NotificationsPopOver />}
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="secondary"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={menuOpen}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={handleOpenUserModal}>
              {i18n.t("mainDrawer.appBar.user.profile")}
            </MenuItem>
            <MenuItem onClick={handleClickLogout}>
              {i18n.t("mainDrawer.appBar.user.logout")}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
