import { Box, Button, CircularProgress, Paper, styled,List,Popover, Drawer, Avatar } from "@mui/material";

const drawerWidth = 320;

export const CustomButtonCircularProgress = styled(CircularProgress)(({ theme }) => ({
    color: theme.palette.success.main,
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
}));
export const CustomTableCell = styled("div")({
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
});
export const ButtonWrapper = styled(Button)({
    position: "relative",
});
export const  InputsWrapper= styled(Box)({
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    // marginTop: "1rem",
});
export const RootModal = styled("div")({
    flexWrap: "wrap",
});
export const MainPaper= styled(Paper)(({ theme }) => ({
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  }));

export const RootSettings = styled("div")({
    display: "flex",
    alignItems: "center",
    padding: "1rem",
});
export const PaperSettings = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
}));
export const TabContainer=styled(List)(({ theme }) => ({
    overflowY: "auto",
    maxHeight: 350,
    ...theme.scrollbarStyles,
}));
export const PopoverPaper=styled(Popover)(({ theme }) => ({
    width: "100%",
    maxWidth: 350,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
        maxWidth: 270,
    },
}));
export const DrawerStyled = styled(Drawer)({
	width: drawerWidth,
		flexShrink: 0,
});
export const Header = styled("div")(({ theme }) => ({
	display: "flex",
		borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
		// backgroundColor: "#eee",
		alignItems: "center",
		padding: theme.spacing(0, 1),
		minHeight: "73px",
		justifyContent: "flex-start",
}));
export const Content = styled("div")(({ theme }) => ({
	display: "flex",
	// backgroundColor: "#eee",
	flexDirection: "column",
	padding: "8px 0px 8px 8px",
	height: "100%",
	overflowY: "scroll",
	...theme.scrollbarStyles,
}));
export const ContactHeader = styled(Paper)({
	display: "flex",
		padding: 8,
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		"& > *": {
			margin: 4,
		},
});
export const ContactExtraInfo = styled(Paper)({
	marginTop: 4,
	padding: 6,
});
export const ContactAvatart = styled(Avatar)({
	margin: 15,
		width: 160,
		height: 160,
})
export const ContactDetails = styled(Paper)({
	marginTop: 8,
		padding: 8,
		display: "flex",
		flexDirection: "column",
})