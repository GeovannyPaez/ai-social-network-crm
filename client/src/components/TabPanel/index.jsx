import { Box } from "@mui/material";

const TabPanel = ({ children, value, name, ...rest }) => {
	if (value === name) {
		return (
			<Box
				role="tabpanel"
				id={`simple-tabpanel-${name}`}
				aria-labelledby={`simple-tab-${name}`}
				{...rest}
			>
				{children}
			</Box>
		);
	} else return null;
};

export default TabPanel;
