import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { cloneDeep } from 'lodash';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SortableTable from '../Table/SortableTable';
import Loader from 'react-loader-spinner';
import { convertLink } from '../../services/searchSong';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectSongList } from '../../redux/ModelSelectors';
import { updateCurrentSong, updateCurrentArtist, updateSongList } from '../../redux/ModelActions';

const styles = {
    root: {
        '& label.Mui-focused': {
            color: '#b3b3b3'
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#b3b3b3'
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#b3b3b3'
            },
            '&:hover fieldset': {
                borderColor: '#b3b3b3'
            },
            '&.Mui-focused fieldset': {
                borderColor: '#20b954'
            }
        }
    },
    input: {
        color: '#b3b3b3'
    }
};

class SongTable extends Component {
    songHeaders = [
        { id: 'name', disablePadding: true, label: 'Name' },
        { id: 'artist', disablePadding: false, label: 'Artist' },
        { id: 'peakPos', disablePadding: false, label: 'Peak Position' }
    ];

    constructor(props) {
        super(props);
        this.state = {
            nameField: '',
            artistField: '',
            peakPosLessThanField: '',
            peakPosMoreThanField: ''
        };
    }

    handleNameSearch = event => {
        this.setState({ nameField: event.target.value });
    };

    handleArtistSearch = event => {
        this.setState({ artistField: event.target.value });
    };

    handlePeakPosLessThan = event => {
        this.setState({ peakPosLessThanField: event.target.value });
    };

    handlePeakPosMoreThan = event => {
        this.setState({ peakPosMoreThanField: event.target.value });
    };

    async componentDidMount() {
        try {
            let { songList, updateSongList } = this.props;
            if (!songList || !songList.length) {
                const songData = await fetch(`${process.env.REACT_APP_BACKEND_URL}/songs`);
                songList = await songData.json();
                songList = songList.filter(song => song.image);
                updateSongList(songList);
            }
        } catch(err) {
            console.log(err);
        }
    }

    render() {
        const { nameField, artistField, peakPosLessThanField, peakPosMoreThanField } = this.state;
        const { classes, history, updateCurrentSong, updateCurrentArtist, songList } = this.props;

        // IMPORTANT: must deep copy because you don't want any JSX components going back into the App state
        let filteredSongs = cloneDeep(songList);

        filteredSongs = filteredSongs.filter(song => (
            song.name.toUpperCase().includes(nameField.toUpperCase()) && song.artist.toUpperCase().includes(artistField.toUpperCase())
        ));
        if (peakPosLessThanField && !isNaN(peakPosLessThanField)) {
            filteredSongs = filteredSongs.filter(song => (
                song.peakPos <= peakPosLessThanField
            ));
        }
        if (peakPosMoreThanField && !isNaN(peakPosMoreThanField)) {
            filteredSongs = filteredSongs.filter(song => (
                song.peakPos >= peakPosMoreThanField
            ));
        }

        filteredSongs.forEach(song => {
            const trackName = song.name;
            const artistName = song.artist;

            // Turn each song cell of the table into a clickable link to an instance, not the best way but it works
            song.name = <span
                className='fw7 pointer click-link'
                style={{ color: '#000000' }}
                onClick={() => {
                    history.push(`/song/${convertLink(trackName, artistName)}`);
                    updateCurrentSong({
                        trackName,
                        artistNames: artistName,
                        artistId: song.artist_id,
                        albumName: song.album_name,
                        albumArt: song.image ? song.image.url : '',
                        trackUrl: song.ext_url,
                        lyrics: song.lyrics,
                        chartsIn: song.charts_in
                    });
                }}
            >
                {trackName}
            </span>;

            // Turn each artist cell of the table into a clickable link to an artist instance
            song.artist = <span
                className='fw7 pointer click-link'
                style={{ color: '#000000' }}
                onClick={async () => {
                    updateCurrentArtist({});
                    history.push(`/artist/${artistName}`);
                    const artistData = await fetch(`${process.env.REACT_APP_BACKEND_URL}/searchartistid`, {
                        method: 'post',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ id: song.artist_id })
                    });
                    const artist = await artistData.json();
                    updateCurrentArtist({
                        artistName: artist.name,
                        popularity: artist.avg_pop,
                        timeOnCharts: artist.time_on_charts,
                        albums: artist.albums,
                        songs: artist.songs,
                        profileArt: artist.images.length ? artist.images[0].url : '',
                        chartsIn: artist.charts_in
                    });
                }}
            >
                {artistName}
            </span>;
        });

        return (
            <div className='ma3 ma5-ns'>
                <h1 className='title-text'>Top Billboard Songs</h1>
                {
                    songList && songList.length ?
                        <div>
                            <div className='db mv4'>
                                <Button style={{ backgroundColor: '#282828' }} variant='contained' onClick={() => history.push('/songs/page/1')}>View as Grid</Button>
                            </div>
                            <div className='pa3 dib'>
                                <TextField
                                    id='outlined-basic'
                                    label='Search by Song'
                                    variant='outlined'
                                    multiline
                                    rows={1}
                                    size='small'
                                    onChange={this.handleNameSearch}
                                    className={classes.root}
                                    InputLabelProps={{ style: { color: '#b3b3b3' } }}
                                    InputProps={{ className: classes.input }}
                                />
                            </div>
                            <div className='pa3 dib'>
                                <TextField
                                    id='outlined-basic'
                                    label='Search by Artist'
                                    variant='outlined'
                                    multiline
                                    rows={1}
                                    size='small'
                                    onChange={this.handleArtistSearch}
                                    className={classes.root}
                                    InputLabelProps={{ style: { color: '#b3b3b3' } }}
                                    InputProps={{ className: classes.input }}
                                />
                            </div>
                            <div className='pa3 dib'>
                                <TextField
                                    id='outlined-basic'
                                    label='Filter Peak <='
                                    variant='outlined'
                                    multiline
                                    rows={1}
                                    size='small'
                                    onChange={this.handlePeakPosLessThan}
                                    className={classes.root}
                                    InputLabelProps={{ style: { color: '#b3b3b3' } }}
                                    InputProps={{ className: classes.input }}
                                />
                            </div>

                            <div className='pa3 dib'>
                                <TextField
                                    id='outlined-basic'
                                    label='Filter Peak >='
                                    variant='outlined'
                                    multiline
                                    rows={1}
                                    size='small'
                                    onChange={this.handlePeakPosMoreThan}
                                    className={classes.root}
                                    InputLabelProps={{ style: { color: '#b3b3b3' } }}
                                    InputProps={{ className: classes.input }}
                                />
                            </div>
                            <SortableTable headers={this.songHeaders} dataSource={filteredSongs} initialSort='peakPos' />
                        </div>
                    :
                        <Loader className='mv6' type='ThreeDots' color='white' height={80} width={80} />
                }
            </div>
        );
    }
};

const mapStateToProps = createStructuredSelector({
    songList: selectSongList
});

const mapDispatchToProps = dispatch => ({
    updateCurrentSong: song => dispatch(updateCurrentSong(song)),
    updateCurrentArtist: artist => dispatch(updateCurrentArtist(artist)),
    updateSongList: songList => dispatch(updateSongList(songList))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SongTable)));
