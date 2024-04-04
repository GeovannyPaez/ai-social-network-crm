import { useState, useEffect } from "react";
import { useParams, redirect } from "react-router-dom";

import { toast } from "react-toastify";
import openSocket from "../../services/socket-io";


import { Paper, styled } from "@mui/material";

import ContactDrawer from "../ContactDrawer";
import MessageInput from "../MessageInput";
import TicketHeader from "../TicketHeader";
import TicketInfo from "../TicketInfo";
import TicketActionButtons from "../TicketActionButtons";
import MessagesList from "../MessagesList";
import api from "../../services/api";
import { ReplyMessageProvider } from "../../context/ReplyingMessage/ReplyingMessageContext";
import toastError from "../../errors/toastError";

const drawerWidth = 320;

const RootContainer = styled("div")({
  display: "flex",
  height: "100%",
  position: "relative",
  overflow: "hidden",
});
const TicketInfoContainer = styled("div")({
  maxWidth: "50%",
  // width: "30%",
  // flexBasis: "50%",
  // backgroundColor: "red",

});
const MainWrapper = styled(Paper)(({ drawerOpen, theme }) => ({
  flex: 1,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  borderLeft: "0",
  marginRight: -drawerWidth,
  ...(drawerOpen && {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  })
}))
const TikerActionButtons = styled("div")({
  maxWidth: "50%",
  display: "flex",
});

const Ticket = () => {
  const { ticketId } = useParams();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState({});
  const [ticket, setTicket] = useState({});
  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchTicket = async () => {
        try {
          const { data } = await api.get("/tickets/" + ticketId);

          setContact(data.contact);
          setTicket(data);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          toastError(err);
        }
      };
      fetchTicket();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [ticketId]);

  useEffect(() => {
    const socket = openSocket();

    socket.on("connect", () => socket.emit("joinChatBox", ticketId));

    socket.on("ticket", (data) => {
      if (data.action === "update") {
        setTicket(data.ticket);
      }

      if (data.action === "delete") {
        toast.success("Ticket deleted sucessfully.");
        redirect("/tickets");
      }
    });

    socket.on("contact", (data) => {
      if (data.action === "update") {
        setContact((prevState) => {
          if (prevState.id === data.contact?.id) {
            return { ...prevState, ...data.contact };
          }
          return prevState;
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [ticketId]);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <RootContainer id="drawer-container">
      <MainWrapper
        variant="outlined"
        elevation={0}
        drawerOpen={drawerOpen}
      >
        <TicketHeader loading={loading}>
          <TicketInfoContainer>
            <TicketInfo
              contact={contact}
              ticket={ticket}
              onClick={handleDrawerOpen}
            />
          </TicketInfoContainer>
          <TikerActionButtons>
            <TicketActionButtons ticket={ticket} />
          </TikerActionButtons>
        </TicketHeader>
        <ReplyMessageProvider>
          <MessagesList
            ticketId={ticketId}
            isGroup={ticket.isGroup}
          ></MessagesList>
          <MessageInput ticketStatus={ticket.status} />
        </ReplyMessageProvider>
      </MainWrapper>
      <ContactDrawer
        open={drawerOpen}
        handleDrawerClose={handleDrawerClose}
        contact={contact}
        loading={loading}
      />
    </RootContainer>
  );
};

export default Ticket;
