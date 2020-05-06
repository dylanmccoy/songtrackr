import React, { Component } from 'react';
import SongDisplay from './SongDisplay';
import { findSpotifySong } from '../../services/searchSong';
import Loader from 'react-loader-spinner';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentSong } from '../../redux/ModelSelectors';
import { updateCurrentSong } from '../../redux/ModelActions';

class SongInstance extends Component {
    async componentDidMount() {
        window.scroll(0, 0);
        try {
            const { updateCurrentSong, currentSongView, match } = this.props;
            if (!currentSongView) {
                const spotifyData = await findSpotifySong(match.params.songID);
                if (spotifyData.albumArt) {
                    this.setState({ ...spotifyData });
                    updateCurrentSong(spotifyData);
                }
            }
        } catch(err) {
            console.log(err);
        }
    }

    render() {
        const { currentSongView } = this.props;
        return (
            currentSongView && currentSongView.trackName ?
                <SongDisplay />
            :
                <Loader className='mv6' type='ThreeDots' color='white' height={80} width={80} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    currentSongView: selectCurrentSong
});

const mapDispatchToProps = dispatch => ({
    updateCurrentSong: song => dispatch(updateCurrentSong(song))
});

export default connect(mapStateToProps, mapDispatchToProps)(SongInstance);
