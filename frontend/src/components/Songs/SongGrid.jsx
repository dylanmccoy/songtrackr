import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { convertLink } from '../../services/searchSong';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { cloneDeep } from 'lodash';
import Pagination from '@material-ui/lab/Pagination';
import { v1 as uuidv1 } from 'uuid';
import Loader from 'react-loader-spinner';
import TextField from '@material-ui/core/TextField';
import Dropdown from '../Dropdown/Dropdown';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectSongList } from '../../redux/ModelSelectors';
import { updateCurrentSong, updateCurrentArtist, updateSongList } from '../../redux/ModelActions';

import '../../styles/Pagination.css';

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

class SongGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            searchField: '',
            loaded: false,
            keyFilter: []
        };
    }

    async componentDidMount() {
        let { songList, updateSongList, match } = this.props;
        if (!songList || !songList.length) {
            const songData = await fetch(`${process.env.REACT_APP_BACKEND_URL}/songs`);
            songList = await songData.json();
            songList = songList.filter(song => song.image);
            updateSongList(songList);
        }
        this.setState({ currentPage: match.params.pageNum });
        this.setState({ loaded: true});
    }

    componentDidUpdate(prevProps) {
        const { pageNum: prevPageNum } = prevProps.match.params;
        const { pageNum: nextPageNum } = this.props.match.params;
        if (prevPageNum !== nextPageNum) {
            this.setState({ currentPage: nextPageNum });
        }
    }

    handlePageChange = (e, value) => {
        this.props.history.push(`/songs/page/${value}`);
        window.scroll(0, 0);
    };

    handleSort = compare => {
        const { songList, updateSongList } = this.props;
        songList.sort(compare);
        updateSongList(cloneDeep(songList));
    }

    handleSearch = event => {
        this.setState({ searchField: event.target.value, currentPage: 1 });
    };

    sortBy = param => {
        return function(a, b) {
            const x = a[param].toLowerCase();
            const y = b[param].toLowerCase();
            if (x < y) return -1;
            return x > y ? 1 : 0;
        };
    };

    handleFilter = key => {
        const { keyFilter } = this.state;
        if (keyFilter.includes(key)) {
            const index = keyFilter.indexOf(key);
            if (index !== -1) keyFilter.splice(index, 1);
        } else {
            keyFilter.push(key);
        }
        this.setState({ keyFilter, currentPage: 1 });
    };

    menuItems = [
        {
            label: 'Track Name',
            func: () => this.handleSort(this.sortBy('name')),
        },
        {
            label: 'Artist Name',
            func: () => this.handleSort(this.sortBy('artist')),
        },
        {
            label: 'Album Name',
            func: () => this.handleSort(this.sortBy('album_name')),
        }
    ];

    keys = ['C#', 'A#', 'D', 'C', 'G#', 'B', 'A', 'F#', 'E', 'G', 'F', 'D#'];

    render() {
        const { currentPage, searchField, loaded, keyFilter } = this.state;
        const { classes, songList, updateCurrentSong, updateCurrentArtist, history } = this.props;

        let filteredSongs = cloneDeep(songList);
        filteredSongs = filteredSongs ? filteredSongs.filter(song => (
            (song.name.toUpperCase().includes(searchField.toUpperCase())
            || song.artist.toUpperCase().includes(searchField.toUpperCase())
            || song.album_name.toUpperCase().includes(searchField.toUpperCase()))
            && (keyFilter.includes(song.key) || keyFilter.length === 0)
        )) : null;

        return (
            <div style={{ overflowX: 'hidden' }}>
                <h1 className='mt5 title-text'>Top Billboard Songs</h1>
                {
                    songList && songList.length ?
                        <div className='mv4'>
                            <div className='db'>
                                <Button style={{ backgroundColor: '#282828' }} variant='contained' onClick={() => history.push('/songs/table')}>View as Table</Button>
                            </div>
                            <div className='pa3 db'>
                                <TextField
                                    id='outlined-basic'
                                    label='Search'
                                    variant='outlined'
                                    multiline
                                    rows={1}
                                    size='small'
                                    onChange={this.handleSearch}
                                    className={classes.root}
                                    InputLabelProps={{ style: { color: '#b3b3b3' } }}
                                    InputProps={{ style: {color: '#b3b3b3'} }}
                                />
                            </div>
                            <div className='mw6 mv3 center'>
                                <div className='ma2 dib'>
                                    <Dropdown isButton title='Sort by' menuItems={this.menuItems} />
                                </div>
                                <div className='ma2 dib'>
                                    <Dropdown
                                        isButton
                                        title='Filter by Key'
                                        menuItems={this.keys.map(key => ({
                                            label: key,
                                            func: () => this.handleFilter(key)
                                        }))}
                                    />
                                </div>
                                <div className='ma2 dib'>
                                    <Button
                                        style={{ backgroundColor: '#20b954' }}
                                        variant='contained'
                                        onClick={() => this.setState({ keyFilter: [] })}
                                    >
                                        <span style={{ color: '#000000' }}>Clear Filters</span>
                                    </Button>
                                </div>
                            </div>
                            <p>
                                Currently Filtering by: {keyFilter.join(', ')}
                            </p>
                        </div>
                    :
                        null
                }

                {
                    filteredSongs && filteredSongs.length ?
                        <div>
                            <Pagination className='dib ma4' page={parseInt(currentPage)} onChange={this.handlePageChange} count={Math.ceil(filteredSongs.length / 9)} />
                            <Grid container spacing={3}>
                                {
                                    filteredSongs.slice((currentPage - 1) * 9, currentPage * 9).map(song => (
                                        <Grid key={uuidv1()} item xs={12} sm={6} md={4}>
                                            {
                                                song.image && song.image.url ?
                                                    <img
                                                        onClick={() => {
                                                            history.push(`/song/${convertLink(song.name, song.artist)}`);
                                                            updateCurrentSong({
                                                                trackName: song.name,
                                                                artistNames: song.artist,
                                                                artistId: song.artist_id,
                                                                albumName: song.album_name,
                                                                albumArt: song.image.url,
                                                                trackUrl: song.ext_url,
                                                                lyrics: song.lyrics,
                                                                chartsIn: song.charts_in
                                                            });
                                                        }}
                                                        src={song.image.url}
                                                        alt='album art'
                                                        className='mw5 center db outline black-10 link dim pointer'
                                                    />
                                                :
                                                    <i style={{ color: '#b3b3b3' }}>Cannot display image</i>
                                            }
                                            <dl className='mt2 f6 lh-copy'>
                                                <dt className='clip'>Title</dt>
                                                <dd className='fw6 ml0 white truncate w-100'>{song.name}</dd>
                                                <dt className='clip'>Artist</dt>
                                                <dd
                                                    className='ml0 gray truncate w-100 artist-link'
                                                    onClick={async () => {
                                                        updateCurrentArtist({});
                                                        history.push(`/artist/${song.artist}`);
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
                                                    {song.artist}
                                                </dd>
                                                <dt className='clip'>Album</dt>
                                                <dd className='fw3 ml0 white truncate w-100'>{song.album_name}</dd>
                                            </dl>
                                        </Grid>
                                    ))
                                }
                            </Grid>
                            <Pagination className='dib ma4' page={parseInt(currentPage)} onChange={this.handlePageChange} count={Math.ceil(filteredSongs.length / 9)} />
                        </div>
                    :
                        (loaded ? <h4>Your search <i>'{searchField}'</i> did not match any songs.</h4> : <Loader className='mv6' type='ThreeDots' color='white' height={80} width={80} />)
                }
            </div>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    songList: selectSongList
});

const mapDispatchToProps = dispatch => ({
    updateCurrentSong: song => dispatch(updateCurrentSong(song)),
    updateCurrentArtist: artist => dispatch(updateCurrentArtist(artist)),
    updateSongList: songList => dispatch(updateSongList(songList))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SongGrid)));
