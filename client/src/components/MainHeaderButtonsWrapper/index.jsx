import { styled } from "@mui/system";

const MainHeaderButtonsWrapper = ({ children }) => {
  return <CustomMainHeaderButtonsWrapper>{children}</CustomMainHeaderButtonsWrapper>;
};

const CustomMainHeaderButtonsWrapper = styled("div")(({ theme }) => ({
  flex: "none",
  display: "flex",
  justifyContent: "space-evenly",
  gap: "1rem",
  marginLeft: "auto",
  "& > *": {
    margin: theme.spacing(1),
  },
}));

export default MainHeaderButtonsWrapper;
