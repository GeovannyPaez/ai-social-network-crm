import { styled } from "@mui/system";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import TicketHeaderSkeleton from "../TicketHeaderSkeleton";
import { useNavigate } from "react-router-dom";

const TicketHeaderWrapper = styled(Card)(({ theme }) => ({
  display: "flex",
  backgroundColor: "rgb(80, 80, 80)",
  flex: "none",
  borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  [theme.breakpoints.down("sm")]: {
    flexWrap: "wrap",
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
          <Button color="primary" onClick={handleBack}>
            <ArrowBackIos />
          </Button>
          {children}
        </TicketHeaderWrapper>
      )}
    </>
  );
};

export default TicketHeader;
