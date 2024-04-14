import { Link, Typography } from '@mui/material'


export default function MessageAbFooter() {
    const year = new Date().getFullYear();
    return (
        <Typography
            variant="body2" color="textPrimary">
            ©{year},{"  "} <Link href='#'>Net AI</Link> {" "} {"All Rights Reserved"}
        </Typography>
    )
}
