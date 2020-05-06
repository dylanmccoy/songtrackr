import React from 'react';
import { withRouter } from 'react-router-dom';

const Footer = ({ history }) => (
    <div className='mv4'>
        <span className='fw6 pointer click-link-footer' onClick={() => {history.push('/'); window.scroll(0, 0)}}>Home&nbsp;·&nbsp;</span>
        <span className='fw6 pointer click-link-footer' onClick={() => {history.push('/about'); window.scroll(0, 0)}}>About&nbsp;·&nbsp;</span>
        <span className='fw6 pointer click-link-footer' onClick={() => {history.push('/songs/page/1'); window.scroll(0, 0)}}>Songs&nbsp;·&nbsp;</span>
        <span className='fw6 pointer click-link-footer' onClick={() => {history.push('/artists/page/1'); window.scroll(0, 0)}}>Artists&nbsp;·&nbsp;</span>
        <span className='fw6 pointer click-link-footer' onClick={() => {history.push('/charts/page/1'); window.scroll(0, 0)}}>Charts</span>
    </div>
);

export default withRouter(Footer);
