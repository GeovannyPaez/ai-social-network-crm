import * as React from 'react';
import { ExpandMore } from '@mui/icons-material';
import { MessageActionButton } from "./styled"
import MessageOptionsMenu from '../MessageOptionsMenu';

export default function ButtonMenuMessage({ message }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <MessageActionButton
                variant="outline"
                size="small"
                disabled={message?.isDeleted}
                id="messageActionsButton"
            >
                <div
                    disabled={message?.isDeleted}
                    id="actionsButton"
                    aria-controls={open ? 'menuOptionsMessage' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <ExpandMore />
                </div>
                <MessageOptionsMenu
                    message={message}
                    menuOpen={open}
                    handleClose={handleClose}
                    anchorEl={anchorEl}
                />
            </MessageActionButton>
        </>
    );
}
