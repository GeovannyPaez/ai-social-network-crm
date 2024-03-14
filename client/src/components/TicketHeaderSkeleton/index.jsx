
import { styled } from "@mui/material/styles";
import { Avatar, Card, CardHeader } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";


const TikectHeaderCard = styled(Card)({
	display: "flex",
	backgroundColor: "#eee",
	flex: "none",
	borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
});

const TicketHeaderSkeleton = () => {

	return (
		<TikectHeaderCard square >
			<CardHeader
				titleTypographyProps={{ noWrap: true }}
				subheaderTypographyProps={{ noWrap: true }}
				avatar={
					<Skeleton animation="wave" variant="circle">
						<Avatar alt="contact_image" />
					</Skeleton>
				}
				title={<Skeleton animation="wave" width={80} />}
				subheader={<Skeleton animation="wave" width={140} />}
			/>
		</TikectHeaderCard>
	);
};

export default TicketHeaderSkeleton;
