

import {  Button } from "@mui/material";
import { CustomButtonCircularProgress } from "../StyledComponents";


const ButtonWithSpinner = ({ loading, children, ...rest }) => {

	return (
		<Button sx={{position:"relative"}} disabled={loading} {...rest}>
			{children}
			{loading && (
				<CustomButtonCircularProgress size={24}  />
			)}
		</Button>
	);
};

export default ButtonWithSpinner;
