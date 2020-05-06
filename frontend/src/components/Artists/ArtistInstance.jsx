import React, { Component } from 'react';
import ArtistDisplay from './ArtistDisplay';
import Loader from 'react-loader-spinner';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentArtist } from '../../redux/ModelSelectors';

class ArtistInstance extends Component {
    componentDidMount() {
        window.scroll(0, 0);
    }

    render() {
        const { currentArtistView } = this.props;
        return (
            currentArtistView && currentArtistView.profileArt ?
                <ArtistDisplay />
            :
                <Loader className='mv6' type='ThreeDots' color='white' height={80} width={80} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    currentArtistView: selectCurrentArtist
});

export default connect(mapStateToProps)(ArtistInstance);
