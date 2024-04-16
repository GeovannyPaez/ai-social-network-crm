import { styled } from "@mui/system";
import Container from "@mui/material/Container";

const MainContainerWrapper = styled(Container)(() => ({
  flex: 1,
  padding: 5,
  height: "100%",
}));

const ContentWrapper = styled("div")(() => ({
  height: "100%",
  overflowY: "hidden",
  display: "flex",
  flexDirection: "column",
}));

const MainContainer = ({ children }) => {
  return (
    <MainContainerWrapper maxWidth={false}>
      <ContentWrapper>{children}</ContentWrapper>
    </MainContainerWrapper>
  );
};

export default MainContainer;
