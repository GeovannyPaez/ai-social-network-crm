import Typography from "@mui/material/Typography";

const Title = props => {
	return (
		<Typography component="h2" variant="h6" color="secondary" gutterBottom>
			{props.children}
		</Typography>
	);
};

export default Title;
