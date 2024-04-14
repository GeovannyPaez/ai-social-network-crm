import { useContext, useState } from "react";
import { redirect } from "react-router-dom";

import { IconButton, MenuItem, useMediaQuery } from "@mui/material";
import { MoreVert, Replay } from "@mui/icons-material";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import TicketOptionsMenu from "../TicketOptionsMenu";
import ButtonWithSpinner from "../ButtonWithSpinner";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import styled from "@emotion/styled";
import IconButtonWithSpinner from "../IconButtonWIthSpinner";
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';

const AcctionsButtons = styled("div")(({ theme }) => ({
	marginRight: 6,
	flex: "none",
	alignSelf: "center",
	marginLeft: "auto",
	"& > *": {
		margin: theme.spacing(1),
	},

}));

const TicketActionButtons = ({ ticket }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [loading, setLoading] = useState(false);
	const ticketOptionsMenuOpen = Boolean(anchorEl);
	const { user } = useContext(AuthContext);
	const isMovileScreen = !useMediaQuery('(min-width:500px)')


	const handleOpenTicketOptionsMenu = e => {
		setAnchorEl(e.currentTarget);
	};

	const handleCloseTicketOptionsMenu = () => {
		setAnchorEl(null);
	};
	const handleUpdateTicketStatus = async (status, userId) => {
		setLoading(true);
		try {
			await api.put(`/tickets/${ticket.id}`, {
				status: status,
				userId: userId || null,
			});

			setLoading(false);
			if (status === "open") {
				redirect(`/tickets/${ticket.id}`);
			} else {
				redirect("/tickets");
			}
		} catch (err) {
			setLoading(false);
			toastError(err);
		}
	};
	const handleResolveTicketStatus = () => handleUpdateTicketStatus("closed", user?.id);
	const handleReturnTicketStatus = () => handleUpdateTicketStatus("pending", null);
	const renderMoreOptionsMenu = () => {
		if (!isMovileScreen || (ticket.status != "open")) return null;
		return (
			<>
				<MenuItem
					onClick={handleResolveTicketStatus}
				>
					{i18n.t("messagesList.header.buttons.resolve")}
				</MenuItem>
				<MenuItem
					onClick={handleReturnTicketStatus}
				>
					{i18n.t("messagesList.header.buttons.return")}
				</MenuItem>
			</>
		)
	}
	return (
		<AcctionsButtons>
			{(ticket.status === "closed") && (
				<ButtonWithSpinner
					loading={loading}
					startIcon={<Replay />}
					size="small"
					onClick={() => handleUpdateTicketStatus("open", user?.id)}
				>
					{!isMovileScreen && i18n.t("messagesList.header.buttons.reopen")}
				</ButtonWithSpinner>
			)}
			{ticket.status === "open" && (
				<>
					{!isMovileScreen && (
						<>
							<IconButtonWithSpinner
								loading={loading}
								textHelper={i18n.t("messagesList.header.buttons.return")}
								size="small"
								onClick={() => handleUpdateTicketStatus("pending", null)}
							>
								<Replay />
							</IconButtonWithSpinner>
							<IconButtonWithSpinner
								loading={loading}
								size="small"
								textHelper={i18n.t("messagesList.header.buttons.resolve")}
								variant="contained"
								color="primary"
								onClick={() => handleUpdateTicketStatus("closed", user?.id)}
							>
								<MarkChatReadIcon />
							</IconButtonWithSpinner>
						</>
					)}
					<IconButton onClick={handleOpenTicketOptionsMenu}>
						<MoreVert />
					</IconButton>
					<TicketOptionsMenu
						ticket={ticket}
						anchorEl={anchorEl}
						renderMoreOptions={renderMoreOptionsMenu}
						menuOpen={ticketOptionsMenuOpen}
						handleClose={handleCloseTicketOptionsMenu}
					/>
				</>
			)}
			{ticket.status === "pending" && (
				<ButtonWithSpinner
					loading={loading}
					size="small"
					variant="contained"
					color="primary"
					onClick={() => handleUpdateTicketStatus("open", user?.id)}
				>
					{i18n.t("messagesList.header.buttons.accept")}
				</ButtonWithSpinner>
			)}
		</AcctionsButtons>
	);
};

export default TicketActionButtons;
