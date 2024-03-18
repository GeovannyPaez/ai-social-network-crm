import { useContext, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MainListItems from './MainListItems';
import { Drawer, DrawerHeader } from './StyledComponents';
import HeaderMenu from './HeaderMenu';
import UserModal from '../components/UserModal';
import { AuthContext } from '../context/Auth/AuthContext';
import { Outlet } from 'react-router-dom';




export default function LoggedInLayout() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <HeaderMenu setUserModalOpen={setUserModalOpen} open={open} handleDrawerOpen={handleDrawerOpen} />
        <MainListItems drawerClose={handleDrawerClose} />
      </Drawer>
      <UserModal open={userModalOpen} onClose={() => setUserModalOpen(false)} userId={user?.id} />
      <Box component="main" sx={{ flexGrow: 1, overflow: "hidden" }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
