import { IconButton, Tooltip } from '@mui/material'
import { CustomButtonCircularProgress } from '../StyledComponents'

export default function IconButtonWithSpinner({ textHelper, children, loading = false, ...rest }) {
    return (
        <Tooltip title={textHelper} >
            <IconButton {...rest}>
                {
                    loading ? <CustomButtonCircularProgress /> : children
                }
            </IconButton>
        </Tooltip>
    )
}
