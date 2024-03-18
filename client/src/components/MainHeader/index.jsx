import { styled } from "@mui/system";


const CustomMainHeader = styled("div")({
  display: "flex",
  alignItems: "center",
  padding: "0px 6px 20px 0px",
});

const MainHeader = ({ children }) => {
  return <CustomMainHeader>{children}</CustomMainHeader>;
};

export default MainHeader;
