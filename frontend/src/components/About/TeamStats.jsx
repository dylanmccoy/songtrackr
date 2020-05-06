import React, { Component } from 'react';
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';

class TeamStats extends Component {
    constructor(props) {
        super(props);
        this.state = { inView: false };
    }

    onChange = visible => this.setState({ inView: visible });

    render() {
        const { commits, issues, numTests } = this.props;
        const { inView } = this.state;
        return (
            <div className='mt5 dib'>
                <h1 className='title-text'>Team Stats </h1>
                {
                    commits && numTests && inView ?
                        <div>
                            <p className='tl'><CountUp style={{ fontSize: '400%' }} end={commits} /> commits</p>
                            <p className='tl'><CountUp style={{ fontSize: '400%' }} end={issues} /> issues</p>
                            <p className='tl'><CountUp style={{ fontSize: '400%' }} end={numTests} /> tests</p>
                        </div>
                    :   
                        <div>
                            <p className='tl'><span style={{ fontSize: '400%' }}>0</span> commits</p>
                            <p className='tl'><span style={{ fontSize: '400%' }}>0</span> issues</p>
                            <VisibilitySensor onChange={this.onChange}>
                                <p className='tl'><span style={{ fontSize: '400%' }}>0</span> tests</p>
                            </VisibilitySensor>
                        </div>
                }
            </div>
        );
    }
};

export default TeamStats;
