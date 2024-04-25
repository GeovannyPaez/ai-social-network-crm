import { styled } from "@mui/system";
import Card from "@mui/material/Card";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import TicketHeaderSkeleton from "../TicketHeaderSkeleton";
import { useNavigate } from "react-router-dom";
import { IconButton, Stack } from "@mui/material";

const TicketHeaderWrapper = styled(Card)(({ theme }) => ({
  display: "flex",
  backgroundColor: "rgb(80, 80, 80)",
  flex: "none",
  borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  [theme.breakpoints.down("sm")]: {
    flexWrap: "nowrap",
  },
}));

const TicketHeader = ({ loading, children }) => {
  const history = useNavigate();
  const handleBack = () => {
    history("/tickets");
  };

  return (
    <>
      {loading ? (
        <TicketHeaderSkeleton />
      ) : (
        <TicketHeaderWrapper square>
          <IconButton color="primary" onClick={handleBack}>
            <ArrowBackIos />
          </IconButton>
          <Stack
            sx={{ width: "100%" }}
            direction={"row"}
            justifyContent={"space-between"}
          >
            {children}
          </Stack>

        </TicketHeaderWrapper>
      )}
    </>
  );
};

export default TicketHeader;
