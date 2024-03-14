import  { useState } from "react";

import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Link from "@mui/material/Link";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";

import { i18n } from "../../translate/i18n";

import ContactModal from "../ContactModal";
import ContactDrawerSkeleton from "../ContactDrawerSkeleton";
import MarkdownWrapper from "../MarkdownWrapper";
import { ContactAvatart, ContactDetails, ContactExtraInfo, ContactHeader, Content, DrawerStyled, Header } from "../StyledComponents";

// const useStyles = makeStyles(theme => ({
// 	drawer: {
// 		width: drawerWidth,
// 		flexShrink: 0,
// 	},
// 	drawerPaper: {
// 		width: drawerWidth,
// 		display: "flex",
// 		borderTop: "1px solid rgba(0, 0, 0, 0.12)",
// 		borderRight: "1px solid rgba(0, 0, 0, 0.12)",
// 		borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
// 		borderTopRightRadius: 4,
// 		borderBottomRightRadius: 4,
// 	},
// 	header: {
// 		display: "flex",
// 		borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
// 		// backgroundColor: "#eee",
// 		alignItems: "center",
// 		padding: theme.spacing(0, 1),
// 		minHeight: "73px",
// 		justifyContent: "flex-start",
// 	},
// 	content: {
// 		display: "flex",
// 		// backgroundColor: "#eee",
// 		flexDirection: "column",
// 		padding: "8px 0px 8px 8px",
// 		height: "100%",
// 		overflowY: "scroll",
// 		...theme.scrollbarStyles,
// 	},

// 	contactAvatar: {
// 		margin: 15,
// 		width: 160,
// 		height: 160,
// 	},

// 	contactHeader: {
// 		display: "flex",
// 		padding: 8,
// 		flexDirection: "column",
// 		alignItems: "center",
// 		justifyContent: "center",
// 		"& > *": {
// 			margin: 4,
// 		},
// 	},

// 	contactDetails: {
// 		marginTop: 8,
// 		padding: 8,
// 		display: "flex",
// 		flexDirection: "column",
// 	},
// 	contactExtraInfo: {
// 		marginTop: 4,
// 		padding: 6,
// 	},
// }));


const ContactDrawer = ({ open, handleDrawerClose, contact, loading }) => {


	const [modalOpen, setModalOpen] = useState(false);

	return (
		<DrawerStyled
			variant="persistent"
			anchor="right"
			open={open}
			PaperProps={{ style: { position: "absolute" } }}
			BackdropProps={{ style: { position: "absolute" } }}
			ModalProps={{
				container: document.getElementById("drawer-container"),
				style: { position: "absolute" },
			}}
			// classes={{
			// 	paper: classes.drawerPaper,
			// }}
		>
			<Header>
				<IconButton onClick={handleDrawerClose}>
					<CloseIcon />
				</IconButton>
				<Typography style={{ justifySelf: "center" }}>
					{i18n.t("contactDrawer.header")}
				</Typography>
			</Header>
			{loading ? (
				<ContactDrawerSkeleton />
			) : (
				<Content>
					<ContactHeader square variant="outlined" >
						<ContactAvatart
							alt={contact.name}
							src={contact.profilePicUrl}
							
					/>

						<Typography>{contact.name}</Typography>
						<Typography>
							<Link href={`tel:${contact.number}`}>{contact.number}</Link>
						</Typography>
						<Button
							variant="outlined"
							color="primary"
							onClick={() => setModalOpen(true)}
						>
							{i18n.t("contactDrawer.buttons.edit")}
						</Button>
					</ContactHeader>
					<ContactDetails square variant="outlined" >
						<ContactModal
							open={modalOpen}
							onClose={() => setModalOpen(false)}
							contactId={contact.id}
						></ContactModal>
						<Typography variant="subtitle1">
							{i18n.t("contactDrawer.extraInfo")}
						</Typography>
						{contact?.extraInfo?.map(info => (
							<ContactExtraInfo
								key={info.id}
								square
								variant="outlined"
								
							>
								<InputLabel>{info.name}</InputLabel>
								<Typography component="div" noWrap style={{ paddingTop: 2 }}>
									<MarkdownWrapper>{info.value}</MarkdownWrapper>
								</Typography>
							</ContactExtraInfo>
						))}
					</ContactDetails>
				</Content>
			)}
		</DrawerStyled>
	);
};

export default ContactDrawer;
