import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { i18n } from "../../translate/i18n";
import { ContactDetails, ContactHeader, Content } from "../StyledComponents";

const ContactDrawerSkeleton = () => {
	return (
		<Content>
			<ContactHeader square variant="outlined" >
				<Skeleton
					animation="wave"
					variant="circle"
					width={160}
					height={160}
				/>
				<Skeleton animation="wave" height={25} width={90} />
				<Skeleton animation="wave" height={25} width={80} />
				<Skeleton animation="wave" height={25} width={80} />
			</ContactHeader>
			<ContactDetails>
				<Typography variant="subtitle1">
					{i18n.t("contactDrawer.extraInfo")}
				</Typography>
				<Paper square variant="outlined" sx={{marginTop: 4,
	padding: 6,}}>
					<Skeleton animation="wave" height={20} width={60} />
					<Skeleton animation="wave" height={20} width={160} />
				</Paper>
				<Paper square variant="outlined" sx={{
					marginTop: 4,
					padding: 6,
				}}>
					<Skeleton animation="wave" height={20} width={60} />
					<Skeleton animation="wave" height={20} width={160} />
				</Paper>
				<Paper square variant="outlined" sx={{
					marginTop: 4,
					padding: 6,
				}}>
					<Skeleton animation="wave" height={20} width={60} />
					<Skeleton animation="wave" height={20} width={160} />
				</Paper>
			</ContactDetails>
		</Content>
	);
};

export default ContactDrawerSkeleton;
