import React from 'react';
import { withRouter } from 'react-router-dom';
import Dropdown from '../Dropdown/Dropdown';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';

import '../../styles/Header.css';

const HideOnScroll = props => {
    const { children, window } = props;
    const trigger = useScrollTrigger({ target: window ? window() : undefined });

    return (
        <Slide appear={false} direction='down' in={!trigger}>
            {children}
        </Slide>
    );
};

const Header = (props) => {
    const { history } = props;
    const menuItems = [
        {
            label: 'Songs',
            func: () => history.push('/songs/page/1')
        },
        {
            label: 'Artists',
            func: () => history.push('/artists/page/1')
        },
        {
            label: 'Charts',
            func: () => history.push('/charts/page/1')
        }
    ];

    return (
        <HideOnScroll {...props}>
            <AppBar position='sticky'>
                <Toolbar className='justify-between'>
                    <Typography variant='h5' className='pointer' onClick={() => history.push('/')}>
                        <span role='img' aria-label='DVD'>📀</span> SongTrackr
                    </Typography>
                    <div className='mh3-ns'>
                        <Dropdown title='models' menuItems={menuItems} />
                        <span className='mh3-ns' />
                        <Button onClick={() => history.push('/about')} color='inherit'>
                            About
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
        </HideOnScroll>
    );
};

export default withRouter(Header);
