import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/system";

const BackdropContainer = styled('div')(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  color: "#fff",
}));

const BackdropLoading = () => {
  return (
    <Backdrop open={true}>
      <BackdropContainer>
        <CircularProgress color="inherit" />
      </BackdropContainer>
    </Backdrop>
  );
};

export default BackdropLoading;
