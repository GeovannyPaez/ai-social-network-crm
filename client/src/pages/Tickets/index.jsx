import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

import TicketsManager from "../../components/TicketsManager";
import Ticket from "../../components/Ticket";

import { i18n } from "../../translate/i18n";
import Hidden from "@mui/material/Hidden";

const ChatContainer = styled("div")({
  flex: 1,
  height: `calc(100vh - 115px)`,
  overflow: "hidden",
});
const ChatPaper = styled(Paper)({
  display: "flex",
  height: "100%",
});

const MessagessWrapper = styled(Grid)({
  display: "flex",
  height: "100%",
  flexDirection: "column",
})
const WelcomeMsg = styled(Paper)({
  // backgroundColor: "",+
  display: "flex",
  justifyContent: "space-evenly",
  alignItems: "center",
  height: "100%",
  textAlign: "center",
  borderRadius: 0,

});

const Chat = () => {
  const { ticketId } = useParams();

  return (
    <ChatContainer>
      <ChatPaper>
        <Grid container spacing={0}>
          <Grid
            item
            xs={12}
            md={4}
          >
            <TicketsManager />
          </Grid>
          <MessagessWrapper item xs={12} md={8} >
            {ticketId ? (
              <>
                <Ticket />
              </>
            ) : (
              <Hidden only={["sm", "xs"]}>
                <WelcomeMsg>
                  <span>{i18n.t("chat.noTicketMessage")}</span>
                </WelcomeMsg>
              </Hidden>
            )}
          </MessagessWrapper>
        </Grid>
      </ChatPaper>
    </ChatContainer>
  );
};

export default Chat;
