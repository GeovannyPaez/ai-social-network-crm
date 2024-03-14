import { styled } from '@mui/material/styles';
import { IconButton } from '@mui/material';


export const MessageActionButton = styled(IconButton)({
    // display: "inherit",
    position: "absolute",
    visibility: "hidden",
    color: "#999",
    zIndex: 1,
    top: 0,
    right: 0,
    backgroundColor: "inherit",
    // opacity: "90%",
    "&:hover, &.Mui-focusVisible": { backgroundColor: "inherit" },
})