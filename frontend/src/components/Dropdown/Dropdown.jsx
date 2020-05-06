import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { v1 as uuidv1 } from 'uuid';

const Dropdown = ({ title, menuItems, isButton }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={`${isButton ? 'center' : 'fl'}`}>
            <Button style={isButton ? { backgroundColor: '#20b954' } : null} aria-controls='simple-menu' aria-haspopup='true' onClick={handleClick}>
                <span style={isButton ? { color: '#000000' } : null}>{title}</span>
            </Button>
            <Menu
                id='simple-menu'
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {
                    menuItems.map(menuItem => (
                        <MenuItem
                            key={uuidv1()}
                            onClick={() => {
                                handleClose();
                                menuItem.func();
                            }}
                        >
                            {menuItem.label}
                        </MenuItem>
                    ))
                }
            </Menu>
        </div>
    );
};

export default Dropdown;
