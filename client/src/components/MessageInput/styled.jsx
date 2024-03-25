

import { Paper, CircularProgress, InputBase } from "@mui/material";
import { green } from "@mui/material/colors";
import { styled } from "@mui/system";

export const ViewMediaInputWrapper = styled(Paper)({
  display: "flex",
  padding: "10px 13px",
  position: "relative",
  justifyContent: "space-between",
  alignItems: "center",
  background: "rgb(80, 80, 80)",
  borderTop: "1px solid rgba(0, 0, 0, 0.12)",
});
export const MessageQuickAnswersWrapper = styled("ul")({
  margin: 0,
  position: "absolute",
  bottom: "50px",
  background: "rgb(80, 80, 80)",
  padding: "2px",
  borderRadius: "5px",
  border: "1px solid #CCC",
  left: 0,
  width: "100%",
  "& li": {
    listStyle: "none",
    "& a": {
      display: "block",
      padding: "8px",
      textOverflow: "ellipsis",
      overflow: "hidden",
      maxHeight: "32px",
      "&:hover": {
        background: "white",
        cursor: "pointer",
        color: "rgb(80, 80, 80)",
      },
    },
  },
});
export const MessageContactName = styled("span")({
  display: "flex",
  color: "#6bcbef",
  fontWeight: 500,
});
export const ReplyingMsgSideColor = styled("span")(({ fromMe }) => ({
  display: "flex",
  width: "4px",
  backgroundColor: fromMe ? "#6bcbef" : "#35cd96",
}));
// const ReplyginContactMsgSideColor=styled("span")({
//   flex: "none",
//     width: "4px",
//     backgroundColor: "#35cd96",
// });
export const ReplyginMsgBody = styled("div")({
  padding: 10,
  height: "auto",
  display: "block",
  whiteSpace: "pre-wrap",
  overflow: "hidden",
});
export const ReplyginMsgContainer = styled("div")({
  flex: 1,
  marginRight: 5,
  overflowY: "hidden",
  backgroundColor: "rgba(0, 0, 0, 0.05)",
  borderRadius: "7.5px",
  display: "flex",
  position: "relative",
});
export const ReplyginMsgWrapper = styled("div")({
  display: "flex",
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  paddingTop: 8,
  paddingLeft: 73,
  paddingRight: 7,
});
export const MainWrapper = styled(Paper)(({ theme }) => ({
  background: "#fff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderTop: "1px solid rgba(0, 0, 0, 0.12)",
  [theme.breakpoints.down("sm")]: {
    position: "fixed",
    bottom: 0,
    width: "100%",
  },
}));
export const CircleLoading = styled(CircularProgress)({
  color: green[500],
  opacity: "70%",
  position: "absolute",
  top: "20%",
  left: "50%",
  marginLeft: -12,
});
export const NewMessageBox = styled("div")({
  background: "rgb(80, 80, 80)",
  width: "100%",
  display: "flex",
  padding: "7px",
  alignItems: "center",
});
export const EmojiBox = styled("div")({
  position: "absolute",
  bottom: 63,
  width: 40,
  borderTop: "1px solid #e8e8e8",
});
export const UploadInput = styled("input")({
  display: "none",
});
export const MessageInputWrapper = styled("div")({
  padding: 6,
  marginRight: 7,
  backgroundColor: "#a1a1a1",
  display: "flex",
  borderRadius: 20,
  flex: 1,
  position: "relative",
});
export const MessageInputStyled = styled(InputBase)({
  paddingLeft: 10,
  flex: 1,
  border: "none",
  color: "white",
});
export const RescorderWrapper = styled("div")({
  display: "flex",
  alignItems: "center",
  alignContent: "middle",
});
export const AudioLoading = styled(CircularProgress)({
  color: green[500],
  opacity: "70%",
});


// hazme el import de todos los componentes

