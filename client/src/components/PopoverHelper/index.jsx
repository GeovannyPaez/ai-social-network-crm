import * as React from 'react';
import Popover from '@mui/material/Popover';
import { IconButton } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
export default function PopoverHelper({ children, Element = IconButton }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const RenderElement = (props) => {
    if (!Element) return <IconButton {...props}><HelpIcon /></IconButton>
    return <Element {...props} />
  }
  const open = Boolean(anchorEl);

  return (
    <div style={{ position: "relative" }}>
      <RenderElement
        aria-owns={open ? 'mouse-over-popovers' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      />
      <Popover
        id="mouse-over-popovers"
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        {children}
      </Popover>
    </div>
  );
}
