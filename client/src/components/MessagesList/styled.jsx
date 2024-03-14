import { green } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import { Block } from "@mui/icons-material";
import {
  CircularProgress,
  IconButton,
} from "@mui/material";
import whatsBackground from "../../assets/wa-background.jpg";

export const ackIcons = {
  fontSize: 18,
  verticalAlign: "middle",
  marginLeft: 4,
}
export const ackDoneAllIcon = {
  color: green[500],
  fontSize: 18,
  verticalAlign: "middle",
  marginLeft: 4,
}
export const MessagesListWrapper = styled("div")({
  overflow: "hidden",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
})
export const MessagesListStyled = styled("div")(({ theme }) => ({
  backgroundImage: `url(${whatsBackground})`,
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  padding: "20px 20px 20px 20px",
  overflowY: "scroll",
  [theme.breakpoints.down("sm")]: {
    paddingBottom: "90px",
  },
  ...theme.scrollbarStyles,
}));
export const CircleLoading = styled(CircularProgress)({
  color: green[500],
  position: "absolute",
  opacity: "70%",
  top: 0,
  left: "50%",
  marginTop: 12,
})
export const DailyTimeStamp = styled("span")({
  alignItems: "center",
  textAlign: "center",
  alignSelf: "center",
  width: "110px",
  backgroundColor: "#e1f3fb",
  margin: "10px",
  borderRadius: "10px",
  boxShadow: "0 1px 1px #b3b3b3",
})
export const DailyTimeStampText = styled("div")({
  color: "#808888",
  padding: 8,
  alignSelf: "center",
  marginLeft: "0px",
})
export const MessageMedia = styled("video")({
  objectFit: "cover",
  width: 250,
  height: 200,
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
})
export const DownloadMedia = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "inherit",
  padding: 10,
})
export const QuotedContainer = styled("div")(({ fromMe }) => ({
  margin: "-3px -80px 6px -6px",
  overflow: "hidden",
  backgroundColor: "#f0f0f0",
  borderRadius: "7.5px",
  display: "flex",
  position: "relative",
  ...(fromMe && {
    backgroundColor: "#cfe9ba",
  }),
}))
export const QuotedSideColor = styled("span")(({ fromMe }) => ({
  flex: "none",
  width: "4px",
  backgroundColor: "#6bcbef",
  ...(fromMe && {
    backgroundColor: "#35cd96",
  }),
}))
export const QuotedMsg = styled("div")({
  padding: 10,
  maxWidth: 300,
  height: "auto",
  display: "block",
  whiteSpace: "pre-wrap",
  overflow: "hidden",
})
export const MessageContactName = styled("span")({
  display: "flex",
  color: "#6bcbef",
  fontWeight: 500,
});
export const TextContentItem = styled("div")(({ isDeleted }) => ({
  overflowWrap: "break-word",
  padding: "3px 80px 6px 6px",
  ...(isDeleted && {
    fontStyle: "italic",
    color: "rgba(0, 0, 0, 0.36)",
    overflowWrap: "break-word",
    padding: "3px 80px 6px 6px",
  }),
}))
export const MessageLeft = styled("div")({
  marginRight: 20,
  marginTop: 2,
  minWidth: 100,
  maxWidth: 600,
  height: "auto",
  display: "block",
  position: "relative",
  "&:hover #messageActionsButton": {
    visibility: "visible",
    position: "absolute",

  },

  whiteSpace: "pre-wrap",
  backgroundColor: "#ffffff",
  color: "#303030",
  alignSelf: "flex-start",
  borderTopLeftRadius: 0,
  borderTopRightRadius: 8,
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
  paddingLeft: 5,
  paddingRight: 5,
  paddingTop: 5,
  paddingBottom: 0,
  boxShadow: "0 1px 1px #b3b3b3",
})
export const MessageActionButton = styled(IconButton)({
  display: "none",
  position: "relative",
  color: "#999",
  zIndex: 1,
  backgroundColor: "inherit",
  opacity: "90%",
  "&:hover, &.Mui-focusVisible": { backgroundColor: "inherit" },
})
export const TimeStamp = styled("span")({
  fontSize: 11,
  position: "absolute",
  bottom: 0,
  right: 5,
  color: "#999",
})
export const MessageRight = styled("div")({
  marginLeft: 20,
  marginTop: 2,
  minWidth: 100,
  maxWidth: 600,
  height: "auto",
  display: "block",
  position: "relative",
  "&:hover #messageActionsButton": {
    // display: "flex",
    visibility: "visible",
    position: "absolute",
  },

  whiteSpace: "pre-wrap",
  backgroundColor: "#dcf8c6",
  color: "#303030",
  alignSelf: "flex-end",
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 0,
  paddingLeft: 5,
  paddingRight: 5,
  paddingTop: 5,
  paddingBottom: 0,
  boxShadow: "0 1px 1px #b3b3b3",
})
export const DeletedIcon = styled(Block)({
  fontSize: 18,
  verticalAlign: "middle",
  marginRight: 4,
})

// generame el import de todos los styled components
