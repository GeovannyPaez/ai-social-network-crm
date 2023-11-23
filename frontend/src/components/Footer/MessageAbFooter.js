import { Link, Typography } from '@material-ui/core'
import React from 'react'

export default function MessageAbFooter() {
    return (
        <Typography
            variant="body2" color="textPrimary">
            ©2023,{"  "} <Link href='https://ab-sistemas.com'>AB TECHNOLOGY GROUP</Link>
        </Typography>
    )
}
