import React, { useState, useEffect, useRef, useContext } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { parseISO, format, isSameDay } from "date-fns";
// import clsx from "clsx";

// import { green } from "@mui/material/colors";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Badge from "@mui/material/Badge";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import ButtonWithSpinner from "../ButtonWithSpinner";
import MarkdownWrapper from "../MarkdownWrapper";
import { Tooltip, styled } from "@mui/material";
import { AuthContext } from "../../context/Auth/AuthContext";
import toastError from "../../errors/toastError";

const TicketQueueColor = styled('span')(({ queueColor }) => ({
	flex: "none",
	width: "8px",
	height: "100%",
	position: "absolute",
	top: "0%",
	left: "0%",
	backgroundColor: queueColor || "#7C7C7C",
  }));
  
  const UserTag = styled('div')({
	position: "absolute",
	marginRight: 5,
	right: 5,
	bottom: 5,
	background: "#2576D2",
	color: "#ffffff",
	border: "1px solid #CCC",
	padding: 1,
	paddingLeft: 5,
	paddingRight: 5,
	borderRadius: 10,
	fontSize: "0.9em",
  });
// const NoTikectsDiv = styled("div")({
// 	display: "flex",
// 	height: "100px",
// 	margin: 40,
// 	flexDirection: "column",
// 	alignItems: "center",
// 	justifyContent: "center",
// })
// const NoTikectsText = styled("p")({
// 	textAlign: "center",
// 	color: "rgb(104, 121, 146)",
// 	fontSize: "14px",
// 	lineHeight: "1.4",
// });
// const NoTikectsTitle = styled("h3")({
// 	textAlign: "center",
// 	fontSize: "16px",
// 	fontWeight: "600",
// 	margin: "0px",

// });
const ContactNameWrapper = styled("div")({
	display: "flex",
	justifyContent: "space-between",
});
const LastMessageTime = styled("span")({
	justifySelf: "flex-end",
});
const ClosedBadge=styled(Badge)({
	alignSelf: "center",
	justifySelf: "flex-end",
	marginRight: 32,
	marginLeft: "auto",
});
const ContactLastMessage = styled(Typography)({
	paddingRight: 20,
});
const NewMessagesCount = styled(Badge)({
	alignSelf: "center",
	marginRight: 8,
	marginLeft: "auto",
});
// const BadgeStyle = styled(Badge)({
// 	color: "white",
// 	backgroundColor: green[500],
// });
const AcceptButton = styled(ButtonWithSpinner)({
	position: "absolute",
	right: "17%",
});
// const useStyles = makeStyles(theme => ({
// 	ticket: {
// 		position: "relative",
// 	},

// 	pendingTicket: {
// 		cursor: "unset",
// 	},

// 	noTicketsDiv: {
// 		display: "flex",
// 		height: "100px",
// 		margin: 40,
// 		flexDirection: "column",
// 		alignItems: "center",
// 		justifyContent: "center",
// 	},

// 	noTicketsText: {
// 		textAlign: "center",
// 		color: "rgb(104, 121, 146)",
// 		fontSize: "14px",
// 		lineHeight: "1.4",
// 	},

// 	noTicketsTitle: {
// 		textAlign: "center",
// 		fontSize: "16px",
// 		fontWeight: "600",
// 		margin: "0px",
// 	},

// 	contactNameWrapper: {
// 		display: "flex",
// 		justifyContent: "space-between",
// 	},

// 	lastMessageTime: {
// 		justifySelf: "flex-end",
// 	},

// 	closedBadge: {
// 		alignSelf: "center",
// 		justifySelf: "flex-end",
// 		marginRight: 32,
// 		marginLeft: "auto",
// 	},

// 	contactLastMessage: {
// 		paddingRight: 20,
// 	},

// 	newMessagesCount: {
// 		alignSelf: "center",
// 		marginRight: 8,
// 		marginLeft: "auto",
// 	},

// 	badgeStyle: {
// 		color: "white",
// 		backgroundColor: green[500],
// 	},

// 	acceptButton: {
// 		position: "absolute",
// 		right: "17%",
// 	},

// 	ticketQueueColor: {
// 		flex: "none",
// 		width: "8px",
// 		height: "100%",
// 		position: "absolute",
// 		top: "0%",
// 		left: "0%",
// 	},

// 	userTag: {
// 		position: "absolute",
// 		marginRight: 5,
// 		right: 5,
// 		bottom: 5,
// 		background: "#2576D2",
// 		color: "#ffffff",
// 		border: "1px solid #CCC",
// 		padding: 1,
// 		paddingLeft: 5,
// 		paddingRight: 5,
// 		borderRadius: 10,
// 		fontSize: "0.9em"
// 	},
// }));

const TicketListItem = ({ ticket }) => {
	const history = useNavigate();
	const [loading, setLoading] = useState(false);
	const { ticketId } = useParams();
	const isMounted = useRef(true);
	const { user } = useContext(AuthContext);

	useEffect(() => {
		return () => {
			isMounted.current = false;
		};
	}, []);

	const handleAcepptTicket = async id => {
		setLoading(true);
		try {
			await api.put(`/tickets/${id}`, {
				status: "open",
				userId: user?.id,
			});
		} catch (err) {
			setLoading(false);
			toastError(err);
		}
		if (isMounted.current) {
			setLoading(false);
		}
		history(`/tickets/${id}`);
	};

	const handleSelectTicket = id => {
		history(`/tickets/${id}`);
	};

	return (
		<React.Fragment key={ticket.id}>
			<ListItem
				dense
				button
				onClick={()=> {
					if (ticket.status === "pending") return;
					handleSelectTicket(ticket.id);
				}}
				selected={ticketId && +ticketId === ticket.id}
				
				// className={clsx(classes.ticket, {
				// 	[classes.pendingTicket]: ticket.status === "pending",
				// })}
			>
				<Tooltip
					arrow
					placement="right"
					title={ticket.queue?.name || "Sem fila"}
				>
					<TicketQueueColor
						style={{ backgroundColor: ticket.queue?.color || "#7C7C7C" }}
						
					></TicketQueueColor>
				</Tooltip>
				<ListItemAvatar>
					<Avatar src={ticket?.contact?.profilePicUrl} />
				</ListItemAvatar>
				<ListItemText
					disableTypography
					primary={
						<ContactNameWrapper>
							<Typography
								noWrap
								component="span"
								variant="body2"
								color="textPrimary"
							>
								{ticket.contact.name}
							</Typography>
							{ticket.status === "closed" && (
								<ClosedBadge
									badgeContent={"closed"}
									color="primary"
								/>
							)}
							{ticket.lastMessage && (
								<LastMessageTime
									component="span"
									variant="body2"
									color="textSecondary"
								>
									{isSameDay(parseISO(ticket.updatedAt), new Date()) ? (
										<>{format(parseISO(ticket.updatedAt), "HH:mm")}</>
									) : (
										<>{format(parseISO(ticket.updatedAt), "dd/MM/yyyy")}</>
									)}
								</LastMessageTime>
							)}
							{ticket.whatsappId && (
								<UserTag title={i18n.t("ticketsList.connectionTitle")}>{ticket.whatsapp?.name}</UserTag>
							)}
						</ContactNameWrapper>
					}
					secondary={
						<ContactNameWrapper>
							<ContactLastMessage
								noWrap
								component="span"
								variant="body2"
								color="textSecondary"
							>
								{ticket.lastMessage ? (
									<MarkdownWrapper>{ticket.lastMessage}</MarkdownWrapper>
								) : (
									<br />
								)}
							</ContactLastMessage>

							<NewMessagesCount
								badgeContent={ticket.unreadMessages}
								classes={{
									// badge: classes.badgeStyle,
								}}
							/>
						</ContactNameWrapper>
					}
				/>
				{ticket.status === "pending" && (
					<AcceptButton
						color="primary"
						variant="contained"
						
						size="small"
						loading={loading}
						onClick={()=> handleAcepptTicket(ticket.id)}
					>
						{i18n.t("ticketsList.buttons.accept")}
					</AcceptButton>
				)}
			</ListItem>
			<Divider variant="inset" component="li" />
		</React.Fragment>
	);
};

export default TicketListItem;
