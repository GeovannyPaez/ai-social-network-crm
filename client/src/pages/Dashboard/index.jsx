import { useContext } from "react";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system"; // Importar styled de @mui/system

import useTickets from "../../hooks/useTickets";
import { AuthContext } from "../../context/Auth/AuthContext";
import { i18n } from "../../translate/i18n";
import Chart from "./Chart";

// Usar styled para definir estilos
const CustomFixedHeightPaper = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(2),
	display: "flex",
	overflow: "auto",
	flexDirection: "column",
	height: 120,
}));

const Dashboard = () => {
	const { user } = useContext(AuthContext);
	const userQueueIds = user.queues?.map(q => q.id) || [];

	const GetTickets = (status, showAll, withUnreadMessages) => {
		const { count } = useTickets({
			status,
			showAll,
			withUnreadMessages,
			queueIds: JSON.stringify(userQueueIds),
		});
		return count;
	};

	return (
		<div>
			<Container maxWidth="lg" sx={{ paddingTop: 4, paddingBottom: 4 }}>
				<Grid container spacing={3}>
					{["open", "pending", "closed"].map((status, index) => (
						<Grid item key={index} xs={4}>
							<CustomFixedHeightPaper sx={{ overflow: "hidden" }}>
								<Typography component="h3" variant="h6" color="secondary" paragraph>
									{i18n.t(`dashboard.messages.${status === "open" ? "inAttendance" : status === "pending" ? "waiting" : "closed"}.title`)}
								</Typography>
								<Grid item>
									<Typography component="h1" color="textSecondary" variant="h4">
										{GetTickets(status, "true", "false")}
									</Typography>
								</Grid>
							</CustomFixedHeightPaper>
						</Grid>
					))}
					<Grid item xs={12}>
						<Paper sx={{ padding: 2, display: "flex", overflow: "auto", flexDirection: "column", height: 240 }}>
							<Chart />
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</div>
	);
};

export default Dashboard;
