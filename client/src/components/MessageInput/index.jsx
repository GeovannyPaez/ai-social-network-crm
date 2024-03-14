import { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import dataEmojimark from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import MicRecorder from "mic-recorder-to-mp3";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import IconButton from "@mui/material/IconButton";
import MoreVert from "@mui/icons-material/MoreVert";
import MoodIcon from "@mui/icons-material/Mood";
import SendIcon from "@mui/icons-material/Send";
import CancelIcon from "@mui/icons-material/Cancel";
import ClearIcon from "@mui/icons-material/Clear";
import MicIcon from "@mui/icons-material/Mic";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  FormControlLabel,
  Hidden,
  Menu,
  MenuItem,
  Switch,
} from "@mui/material";
import {
  ViewMediaInputWrapper,
  MessageQuickAnswersWrapper,
  MessageContactName,
  ReplyingMsgSideColor,
  ReplyginMsgBody,
  ReplyginMsgContainer,
  ReplyginMsgWrapper,
  MainWrapper,
  CircleLoading,
  NewMessageBox,
  EmojiBox,
  UploadInput,
  MessageInputWrapper,
  MessageInputStyled,
  RescorderWrapper,
  AudioLoading,
} from "./styled.jsx";
import ClickAwayListener from "@mui/material/ClickAwayListener";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import RecordingTimer from "./RecordingTimer";
import { ReplyMessageContext } from "../../context/ReplyingMessage/ReplyingMessageContext";
import { AuthContext } from "../../context/Auth/AuthContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import toastError from "../../errors/toastError";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

// const useStyles = makeStyles((theme) => ({
//   mainWrapper: {
//     background: "#fff",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     borderTop: "1px solid rgba(0, 0, 0, 0.12)",
//     [theme.breakpoints.down("sm")]: {
//       position: "fixed",
//       bottom: 0,
//       width: "100%",
//     },
//   },

//   newMessageBox: {
//     background: "rgb(80, 80, 80)",
//     width: "100%",
//     display: "flex",
//     padding: "7px",
//     alignItems: "center",
//   },

//   messageInputWrapper: {
//     padding: 6,
//     marginRight: 7,
//     backgroundColor: "#a1a1a1",
//     display: "flex",
//     borderRadius: 20,
//     flex: 1,
//     position: "relative",
//   },

//   messageInput: {
//     paddingLeft: 10,
//     flex: 1,
//     border: "none",
//     color: "white",
//   },

//   sendMessageIcons: {
//     color: "grey",
//   },

//   uploadInput: {
//     display: "none",
//   },

//   viewMediaInputWrapper: {
//     display: "flex",
//     padding: "10px 13px",
//     position: "relative",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#eee",
//     borderTop: "1px solid rgba(0, 0, 0, 0.12)",
//   },

//   emojiBox: {
//     position: "absolute",
//     bottom: 63,
//     width: 40,
//     borderTop: "1px solid #e8e8e8",
//   },

//   circleLoading: {
//     color: green[500],
//     opacity: "70%",
//     position: "absolute",
//     top: "20%",
//     left: "50%",
//     marginLeft: -12,
//   },

//   audioLoading: {
//     color: green[500],
//     opacity: "70%",
//   },

//   recorderWrapper: {
//     display: "flex",
//     alignItems: "center",
//     alignContent: "middle",
//   },

//   cancelAudioIcon: {
//     color: "red",
//   },

//   sendAudioIcon: {
//     color: "green",
//   },

//   replyginMsgWrapper: {
//     display: "flex",
//     width: "100%",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingTop: 8,
//     paddingLeft: 73,
//     paddingRight: 7,
//   },

//   replyginMsgContainer: {
//     flex: 1,
//     marginRight: 5,
//     overflowY: "hidden",
//     backgroundColor: "rgba(0, 0, 0, 0.05)",
//     borderRadius: "7.5px",
//     display: "flex",
//     position: "relative",
//   },

//   replyginMsgBody: {
//     padding: 10,
//     height: "auto",
//     display: "block",
//     whiteSpace: "pre-wrap",
//     overflow: "hidden",
//   },

//   replyginContactMsgSideColor: {
//     flex: "none",
//     width: "4px",
//     backgroundColor: "#35cd96",
//   },

//   replyginSelfMsgSideColor: {
//     flex: "none",
//     width: "4px",
//     backgroundColor: "#6bcbef",
//   },

//   messageContactName: {
//     display: "flex",
//     color: "#6bcbef",
//     fontWeight: 500,
//   },
//   messageQuickAnswersWrapper: {
//     margin: 0,
//     position: "absolute",
//     bottom: "50px",
//     background: "rgb(80, 80, 80)",
//     padding: "2px",
//     borderRadius: "5px",
//     border: "1px solid #CCC",
//     left: 0,
//     width: "100%",
//     "& li": {
//       listStyle: "none",
//       "& a": {
//         display: "block",
//         padding: "8px",
//         textOverflow: "ellipsis",
//         overflow: "hidden",
//         maxHeight: "32px",
//         "&:hover": {
//           background: "white",
//           cursor: "pointer",
//           color: "rgb(80, 80, 80)",
//         },
//       },
//     },
//   },
// }));


const MessageInput = ({ ticketStatus }) => {
  const { ticketId } = useParams();

  const [medias, setMedias] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [quickAnswers, setQuickAnswer] = useState([]);
  const [typeBar, setTypeBar] = useState(false);
  const inputRef = useRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const { setReplyingMessage, replyingMessage } =
    useContext(ReplyMessageContext);
  const { user } = useContext(AuthContext);

  const [signMessage, setSignMessage] = useLocalStorage("signOption", true);

  useEffect(() => {
    inputRef.current.focus();
  }, [replyingMessage]);

  useEffect(() => {
    inputRef.current.focus();
    return () => {
      setInputMessage("");
      setShowEmoji(false);
      setMedias([]);
      setReplyingMessage(null);
    };
  }, [ticketId, setReplyingMessage]);

  const handleChangeInput = (e) => {
    setInputMessage(e.target.value);
    handleLoadQuickAnswer(e.target.value);
  };

  const handleQuickAnswersClick = (value) => {
    setInputMessage(value);
    setTypeBar(false);
  };

  const handleAddEmoji = (e) => {
    let emoji = e.native;
    setInputMessage((prevState) => prevState + emoji);
  };

  const handleChangeMedias = (e) => {
    if (!e.target.files) {
      return;
    }

    const selectedMedias = Array.from(e.target.files);
    setMedias(selectedMedias);
  };

  const handleInputPaste = (e) => {
    if (e.clipboardData.files[0]) {
      setMedias([e.clipboardData.files[0]]);
    }
  };

  const handleUploadMedia = async (e) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append("fromMe", true);
    medias.forEach((media) => {
      formData.append("medias", media);
      formData.append("body", media.name);
    });

    try {
      await api.post(`/messages/${ticketId}`, formData);
    } catch (err) {
      toastError(err);
    }

    setLoading(false);
    setMedias([]);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;
    setLoading(true);

    const message = {
      read: 1,
      fromMe: true,
      mediaUrl: "",
      body: signMessage
        ? `*${user?.name}:*\n${inputMessage.trim()}`
        : inputMessage.trim(),
      quotedMsg: replyingMessage,
    };
    try {
      await api.post(`/messages/${ticketId}`, message);
    } catch (err) {
      toastError(err);
    }

    setInputMessage("");
    setShowEmoji(false);
    setLoading(false);
    setReplyingMessage(null);
  };

  const handleStartRecording = async () => {
    setLoading(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await Mp3Recorder.start();
      setRecording(true);
      setLoading(false);
    } catch (err) {
      toastError(err);
    }
  };


  const handleLoadQuickAnswer = async (value) => {
    if (value && value.indexOf("/") === 0) {
      try {
        const { data } = await api.get("/quickAnswers/", {
          params: { searchParam: inputMessage.substring(1) },
        });
        setQuickAnswer(data.quickAnswers);
        if (data.quickAnswers.length > 0) {
          setTypeBar(true);
        } else {
          setTypeBar(false);
        }
      } catch (err) {
        setTypeBar(false);
      }
    } else {
      setTypeBar(false);
    }
  };

  const handleUploadAudio = async () => {
    setLoading(true);
    try {
      const [, blob] = await Mp3Recorder.stop().getMp3();
      if (blob.size < 10000) {
        setLoading(false);
        setRecording(false);
        return;
      }

      const formData = new FormData();
      const filename = `${new Date().getTime()}.mp3`;
      formData.append("medias", blob, filename);
      formData.append("body", filename);
      formData.append("fromMe", true);

      await api.post(`/messages/${ticketId}`, formData);
    } catch (err) {
      toastError(err);
    }

    cancelUiRecordinAudio();
  }
  const cancelUiRecordinAudio = () => {
    setRecording(false);
    setLoading(false);
  }

  const handleCancelAudio = async () => {
    try {
      await Mp3Recorder.stop().getMp3();
      setRecording(false);
    } catch (err) {
      toastError(err);
    }
  };

  const handleOpenMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = () => {
    setAnchorEl(null);
  };

  const renderReplyingMessage = (message) => {
    return (
      <ReplyginMsgWrapper >
        <ReplyginMsgContainer >
          <ReplyingMsgSideColor
            fromMe={message.fromMe}
          />

          <ReplyginMsgBody >
            {!message.fromMe && (
              <MessageContactName >
                {message.contact?.name}
              </MessageContactName>
            )}
            {message.body}
          </ReplyginMsgBody>
        </ReplyginMsgContainer>
        <IconButton
          aria-label="showRecorder"
          component="span"
          disabled={loading || ticketStatus !== "open"}
          onClick={() => setReplyingMessage(null)}
        >
          <ClearIcon sx={{ color: "grey" }} />
        </IconButton>
      </ReplyginMsgWrapper>
    );
  };

  if (medias.length > 0)
    return (
      <ViewMediaInputWrapper elevation={0} square>
        <IconButton
          aria-label="cancel-upload"
          component="span"
          onClick={() => setMedias([])}
        >
          <CancelIcon sx={{
            color: "gray"
          }} />
        </IconButton>

        {loading ? (
          <div>
            <CircleLoading />
          </div>
        ) : (
          <span>
            {medias[0]?.name}
            {/* <img src={media.preview} alt=""></img> */}
          </span>
        )}
        <IconButton
          aria-label="send-upload"
          component="span"
          onClick={handleUploadMedia}
          disabled={loading}
        >
          <SendIcon sx={{ color: "grey" }} />
        </IconButton>
      </ViewMediaInputWrapper>
    );
  else {
    return (
      <MainWrapper square elevation={0} >
        {replyingMessage && renderReplyingMessage(replyingMessage)}
        <NewMessageBox>
          <Hidden only={["sm", "xs"]}>
            <IconButton
              aria-label="emojiPicker"
              component="span"
              disabled={loading || recording || ticketStatus !== "open"}
              onClick={() => setShowEmoji((prevState) => !prevState)}
            >
              <MoodIcon sx={{ color: "grey" }} />
            </IconButton>
            {showEmoji ? (
              <EmojiBox>
                <ClickAwayListener onClickAway={() => setShowEmoji(false)}>
                  <Picker
                    perLine={16}
                    data={dataEmojimark}
                    showPreview={false}
                    showSkinTones={false}
                    onEmojiSelect={handleAddEmoji}
                  />
                </ClickAwayListener>
              </EmojiBox>
            ) : null}

            <UploadInput
              multiple
              type="file"
              id="upload-button"
              disabled={loading || recording || ticketStatus !== "open"}
              onChange={handleChangeMedias}
            />
            <label htmlFor="upload-button">
              <IconButton
                aria-label="upload"
                component="span"
                disabled={loading || recording || ticketStatus !== "open"}
              >
                <AttachFileIcon sx={{ color: "grey" }} />
              </IconButton>
            </label>
            <FormControlLabel
              style={{ marginRight: 7, color: "gray" }}
              label={i18n.t("messagesInput.signMessage")}
              labelPlacement="start"
              control={
                <Switch
                  size="small"
                  checked={signMessage}
                  onChange={(e) => {
                    setSignMessage(e.target.checked);
                  }}
                  name="showAllTickets"
                  color="primary"
                />
              }
            />
          </Hidden>
          <Hidden only={["md", "lg", "xl"]}>
            <IconButton
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleOpenMenuClick}
            >
              <MoreVert></MoreVert>
            </IconButton>
            <Menu
              id="simple-menu"
              keepMounted
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuItemClick}
            >
              <MenuItem onClick={handleMenuItemClick}>
                <IconButton
                  aria-label="emojiPicker"
                  component="span"
                  disabled={loading || recording || ticketStatus !== "open"}
                  onClick={() => setShowEmoji((prevState) => !prevState)}
                >
                  <MoodIcon sx={{ color: "grey" }} />
                </IconButton>
              </MenuItem>
              <MenuItem onClick={handleMenuItemClick}>
                <UploadInput
                  multiple
                  type="file"
                  id="upload-button"
                  disabled={loading || recording || ticketStatus !== "open"}

                  onChange={handleChangeMedias}
                />
                <label htmlFor="upload-button">
                  <IconButton
                    aria-label="upload"
                    component="span"
                    disabled={loading || recording || ticketStatus !== "open"}
                  >
                    <AttachFileIcon sx={{ color: "gray" }} />
                  </IconButton>
                </label>
              </MenuItem>
              <MenuItem onClick={handleMenuItemClick}>
                <FormControlLabel
                  style={{ marginRight: 7, color: "gray" }}
                  label={i18n.t("messagesInput.signMessage")}
                  labelPlacement="start"
                  control={
                    <Switch
                      size="small"
                      checked={signMessage}
                      onChange={(e) => {
                        setSignMessage(e.target.checked);
                      }}
                      name="showAllTickets"
                      color="primary"
                    />
                  }
                />
              </MenuItem>
            </Menu>
          </Hidden>
          <MessageInputWrapper>
            <MessageInputStyled
              inputRef={(input) => {
                input && input.focus();
                input && (inputRef.current = input);
              }}

              placeholder={
                ticketStatus === "open"
                  ? i18n.t("messagesInput.placeholderOpen")
                  : i18n.t("messagesInput.placeholderClosed")
              }
              multiline
              maxRows={5}
              value={inputMessage}
              onChange={handleChangeInput}
              disabled={recording || loading || ticketStatus !== "open"}
              onPaste={(e) => {
                ticketStatus === "open" && handleInputPaste(e);
              }}
              onKeyPress={(e) => {
                if (loading || e.shiftKey) return;
                else if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            {typeBar ? (
              <MessageQuickAnswersWrapper >
                {quickAnswers.map((value, index) => {
                  return (
                    <li
                      // className={classes.messageQuickAnswersWrapperItem}
                      key={index}
                    >
                      <a onClick={() => handleQuickAnswersClick(value.message)}>
                        {`${value.shortcut} - ${value.message}`}
                      </a>
                    </li>
                  );
                })}
              </MessageQuickAnswersWrapper>
            ) : (
              <div></div>
            )}
          </MessageInputWrapper>
          {inputMessage ? (
            <IconButton
              aria-label="sendMessage"
              component="span"
              onClick={handleSendMessage}
              disabled={loading}
            >
              <SendIcon sx={{ color: "grey" }} />
            </IconButton>
          ) : recording ? (
            <RescorderWrapper>
              <IconButton
                aria-label="cancelRecording"
                component="span"
                fontSize="large"
                disabled={loading}
                onClick={handleCancelAudio}
              >
                <HighlightOffIcon sx={{ color: "red" }} />
              </IconButton>
              {loading ? (
                <div>
                  <AudioLoading />
                </div>
              ) : (
                <RecordingTimer />
              )}
              <IconButton
                aria-label="sendRecordedAudio"
                component="span"
                onClick={() => handleUploadAudio()}
                disabled={loading}
              >
                <CheckCircleOutlineIcon sx={{ color: "green" }} />
              </IconButton>
            </RescorderWrapper>
          ) : (
            <IconButton
              aria-label="showRecorder"
              component="span"
              disabled={loading || ticketStatus !== "open"}
              onClick={handleStartRecording}
            >
              <MicIcon sx={{ color: "grey" }} />
            </IconButton>
          )}
        </NewMessageBox>
      </MainWrapper>
    );
  }
};

export default MessageInput;
