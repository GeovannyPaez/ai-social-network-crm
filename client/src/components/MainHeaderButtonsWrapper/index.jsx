import { Box } from "@mui/material";
import { styled } from "@mui/system";

const MainHeaderButtonsWrapper = ({ children }) => {
  return <CustomMainHeaderButtonsWrapper>{children}</CustomMainHeaderButtonsWrapper>;
};

const CustomMainHeaderButtonsWrapper = styled(Box)(({ theme }) => ({
  flex: "none",
  display: "flex",
  justifyContent: "space-evenly",
  gap: "1rem",
  // marginLeft: "auto",
  "& > *": {
    margin: theme.spacing(1),
  },
}));

export default MainHeaderButtonsWrapper;
