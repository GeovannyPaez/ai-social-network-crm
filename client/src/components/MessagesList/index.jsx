import React, { useState, useEffect, useReducer, useRef } from "react";

import { isSameDay, parseISO, format } from "date-fns";
import openSocket from "../../services/socket-io";

import {
  Button,
  Divider,
} from "@mui/material";
import {
  AccessTime,
  Done,
  DoneAll,
  GetApp,
} from "@mui/icons-material";

import MarkdownWrapper from "../MarkdownWrapper";
import VcardPreview from "../VcardPreview";
import LocationPreview from "../LocationPreview";
import ModalImageCors from "../ModalImageCors";
import ButtonMenuMessage from "../ButtonMenuMessage";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import Audio from "../Audio";
import {
  ackIcons,
  ackDoneAllIcon,
  MessagesListWrapper,
  MessagesListStyled,
  CircleLoading,
  DailyTimeStamp,
  DailyTimeStampText,
  MessageMedia,
  DownloadMedia,
  QuotedContainer,
  QuotedSideColor,
  QuotedMsg,
  MessageContactName,
  TextContentItem,
  MessageLeft,
  // MessageActionButton,
  TimeStamp,
  MessageRight,
  DeletedIcon,
} from "./styled";


const reducer = (state, action) => {
  if (action.type === "LOAD_MESSAGES") {
    const messages = action.payload;
    const newMessages = [];

    messages.forEach((message) => {
      const messageIndex = state.findIndex((m) => m.id === message.id);
      if (messageIndex !== -1) {
        state[messageIndex] = message;
      } else {
        newMessages.push(message);
      }
    });

    return [...newMessages, ...state];
  }

  if (action.type === "ADD_MESSAGE") {
    const newMessage = action.payload;
    const messageIndex = state.findIndex((m) => m.id === newMessage.id);

    if (messageIndex !== -1) {
      state[messageIndex] = newMessage;
    } else {
      state.push(newMessage);
    }

    return [...state];
  }

  if (action.type === "UPDATE_MESSAGE") {
    const messageToUpdate = action.payload;
    const messageIndex = state.findIndex((m) => m.id === messageToUpdate.id);

    if (messageIndex !== -1) {
      state[messageIndex] = messageToUpdate;
    }

    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const MessagesList = ({ ticketId, isGroup }) => {

  const [messagesList, dispatch] = useReducer(reducer, []);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const lastMessageRef = useRef();

  const currentTicketId = useRef(ticketId);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);

    currentTicketId.current = ticketId;
  }, [ticketId]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchMessages = async () => {
        try {
          const { data } = await api.get("/messages/" + ticketId, {
            params: { pageNumber },
          });

          if (currentTicketId.current === ticketId) {
            dispatch({ type: "LOAD_MESSAGES", payload: data.messages });
            setHasMore(data.hasMore);
            setLoading(false);
          }

          if (pageNumber === 1 && data.messages.length > 1) {
            scrollToBottom();
          }
        } catch (err) {
          setLoading(false);
          toastError(err);
        }
      };
      fetchMessages();
    }, 500);
    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [pageNumber, ticketId]);

  useEffect(() => {
    const socket = openSocket();

    socket.on("connect", () => socket.emit("joinChatBox", ticketId));

    socket.on("appMessage", (data) => {
      if (data.action === "create") {
        dispatch({ type: "ADD_MESSAGE", payload: data.message });
        scrollToBottom();
      }

      if (data.action === "update") {
        dispatch({ type: "UPDATE_MESSAGE", payload: data.message });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [ticketId]);

  const loadMore = () => {
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  };

  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({});
    }
  };

  const handleScroll = (e) => {
    if (!hasMore) return;
    const { scrollTop } = e.currentTarget;

    if (scrollTop === 0) {
      document.getElementById("messagesList").scrollTop = 1;
    }

    if (loading) {
      return;
    }

    if (scrollTop < 50) {
      loadMore();
    }
  };



  const checkMessageMedia = (message) => {
    if (message.mediaType === "location" && message.body.split('|').length >= 2) {
      let locationParts = message.body.split('|')
      let imageLocation = locationParts[0]
      let linkLocation = locationParts[1]

      let descriptionLocation = null

      if (locationParts.length > 2)
        descriptionLocation = message.body.split('|')[2]

      return <LocationPreview image={imageLocation} link={linkLocation} description={descriptionLocation} />
    }
    else if (message.mediaType === "vcard") {
      let array = message.body.split("\n");
      let obj = [];
      let contact = "";
      for (let index = 0; index < array.length; index++) {
        const v = array[index];
        let values = v.split(":");
        for (let ind = 0; ind < values.length; ind++) {
          if (values[ind].indexOf("+") !== -1) {
            obj.push({ number: values[ind] });
          }
          if (values[ind].indexOf("FN") !== -1) {
            contact = values[ind + 1];
          }
        }
      }
      return <VcardPreview contact={contact} numbers={obj[0]?.number} />
    }
    /*else if (message.mediaType === "multi_vcard") {
      console.log("multi_vcard")
      console.log(message)
    	
      if(message.body !== null && message.body !== "") {
        let newBody = JSON.parse(message.body)
        return (
          <>
            {
            newBody.map(v => (
              <VcardPreview contact={v.name} numbers={v.number} />
            ))
            }
          </>
        )
      } else return (<></>)
    }*/
    else if (/^.*\.(jpe?g|png|gif)?$/i.exec(message.mediaUrl) && message.mediaType === "image") {
      return <ModalImageCors imageUrl={message.mediaUrl} />;
    } else if (message.mediaType === "audio") {
      return <Audio url={message.mediaUrl} />
    } else if (message.mediaType === "video") {
      return (
        <MessageMedia
          src={message.mediaUrl}
          controls
        />
      );
    } else {
      return (
        <>
          <DownloadMedia>
            <Button
              startIcon={<GetApp />}
              color="primary"
              variant="outlined"
              target="_blank"
              href={message.mediaUrl}
            >
              Download
            </Button>
          </DownloadMedia>
          <Divider />
        </>
      );
    }
  };

  const renderMessageAck = (message) => {
    if (message.ack === 0) {
      return <AccessTime fontSize="small" sx={
        ackIcons
      } />;
    }
    if (message.ack === 1) {
      return <Done fontSize="small" sx={ackIcons} />;
    }
    if (message.ack === 2) {
      return <DoneAll fontSize="small" sx={ackIcons} />;
    }
    if (message.ack === 3 || message.ack === 4) {
      return <DoneAll fontSize="small" sx={ackDoneAllIcon} />;
    }
  };

  const renderDailyTimestamps = (message, index) => {
    if (index === 0) {
      return (
        <DailyTimeStamp
          key={`timestamp-${message.id}`}
        >
          <DailyTimeStampText>
            {format(parseISO(messagesList[index].createdAt), "dd/MM/yyyy")}
          </DailyTimeStampText>
        </DailyTimeStamp>
      );
    }
    if (index < messagesList.length - 1) {
      let messageDay = parseISO(messagesList[index].createdAt);
      let previousMessageDay = parseISO(messagesList[index - 1].createdAt);

      if (!isSameDay(messageDay, previousMessageDay)) {
        return (
          <DailyTimeStamp
            key={`timestamp-${message.id}`}
          >
            <DailyTimeStampText>
              {format(parseISO(messagesList[index].createdAt), "dd/MM/yyyy")}
            </DailyTimeStampText>
          </DailyTimeStamp>
        );
      }
    }
    if (index === messagesList.length - 1) {
      return (
        <div
          key={`ref-${message.createdAt}`}
          ref={lastMessageRef}
          style={{ float: "left", clear: "both" }}
        />
      );
    }
  };

  const renderMessageDivider = (message, index) => {
    if (index < messagesList.length && index > 0) {
      let messageUser = messagesList[index].fromMe;
      let previousMessageUser = messagesList[index - 1].fromMe;

      if (messageUser !== previousMessageUser) {
        return (
          <span style={{ marginTop: 16 }} key={`divider-${message.id}`}></span>
        );
      }
    }
  };

  const renderQuotedMessage = (message) => {
    return (
      <QuotedContainer
        fromMe={message.fromMe}
      >
        <QuotedSideColor
          fromMe={message.quotedMsg?.fromMe}
        // className={clsx(classes.quotedSideColorLeft, {
        //   [classes.quotedSideColorRight]: message.quotedMsg?.fromMe,
        // })}
        ></QuotedSideColor>
        <QuotedMsg>
          {!message.quotedMsg?.fromMe && (
            <MessageContactName>
              {message.quotedMsg?.contact?.name}
            </MessageContactName>
          )}
          {message.quotedMsg?.body}
        </QuotedMsg>
      </QuotedContainer>
    );
  };

  const renderMessages = () => {

    if (messagesList.length > 0) {
      const viewMessagesList = messagesList.map((message, index) => {
        const isMediaMessage = (message.mediaUrl || message.mediaType === "location" || message.mediaType === "vcard"
          //|| message.mediaType === "multi_vcard" 
        )
        if (!message.fromMe) {
          return (
            <React.Fragment key={message.id}>
              {renderDailyTimestamps(message, index)}
              {renderMessageDivider(message, index)}
              <MessageLeft>
                <ButtonMenuMessage message={message} />
                {isGroup && (
                  <MessageContactName>
                    {message.contact?.name}
                  </MessageContactName>
                )}
                {isMediaMessage && checkMessageMedia(message)}
                <TextContentItem>
                  {message.quotedMsg && renderQuotedMessage(message)}
                  <MarkdownWrapper>{!isMediaMessage && message.body}</MarkdownWrapper>
                  <TimeStamp>
                    {format(parseISO(message.createdAt), "HH:mm")}
                  </TimeStamp>
                </TextContentItem>
              </MessageLeft>
            </React.Fragment>
          );
        } else {
          return (
            <React.Fragment key={message.id}>
              {renderDailyTimestamps(message, index)}
              {renderMessageDivider(message, index)}
              <MessageRight>
                <ButtonMenuMessage message={message} />
                {/* <MessageActionButton
                  variant="contained"
                  size="small"
                  id="messageActionsButton"
                  disabled={message.isDeleted}
                  onClick={(e) => handleOpenMessageOptionsMenu(e, message)}
                >
                  <ExpandMore />
                </MessageActionButton> */}
                {isMediaMessage && checkMessageMedia(message)}
                <TextContentItem
                  isDeleted={message.isDeleted}
                >
                  {message.isDeleted && (
                    <DeletedIcon
                      color="disabled"
                      fontSize="small"
                    />
                  )}
                  {message.quotedMsg && renderQuotedMessage(message)}
                  <MarkdownWrapper>{!isMediaMessage && message.body}</MarkdownWrapper>
                  <TimeStamp>
                    {format(parseISO(message.createdAt), "HH:mm")}
                    {renderMessageAck(message)}
                  </TimeStamp>
                </TextContentItem>

              </MessageRight>
            </React.Fragment>
          );
        }
      });
      return viewMessagesList;
    } else {
      return <div>Dile hola a tu nuevo contacto!</div>;
    }
  };

  return (
    <MessagesListWrapper>
      <MessagesListStyled
        id="messagesList"
        onScroll={handleScroll}
      >
        {messagesList.length > 0 ? renderMessages() : []}
      </MessagesListStyled>
      {loading && (
        <div>
          <CircleLoading />
        </div>
      )}
    </MessagesListWrapper>
  );
};

export default MessagesList;