import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Pagination from '@material-ui/lab/Pagination';
import { v1 as uuidv1 } from 'uuid';
import { cloneDeep } from 'lodash';
import TextField from '@material-ui/core/TextField';
import Dropdown from '../Dropdown/Dropdown';
import Loader from 'react-loader-spinner';
import genres from '../../data/genres.json';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectArtistList } from '../../redux/ModelSelectors';
import { updateCurrentArtist, updateArtistList } from '../../redux/ModelActions';

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

class ArtistGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            searchField: '',
            genreFilter: [],
        };
    }

    async componentDidMount() {
        let { artistList, updateArtistList, match } = this.props;
        if (!artistList || !artistList.length) {
            const artistData = await fetch(`${process.env.REACT_APP_BACKEND_URL}/artists`);
            artistList = await artistData.json();
            artistList = artistList.filter(artist => artist.images && artist.images.length);
            updateArtistList(artistList);
        }
        this.setState({ currentPage: match.params.pageNum });
    }

    componentDidUpdate(prevProps) {
        const { pageNum: prevPageNum } = prevProps.match.params;
        const { pageNum: nextPageNum } = this.props.match.params;
        if (prevPageNum !== nextPageNum) {
            this.setState({ currentPage: nextPageNum });
        }
    }

    handlePageChange = (e, value) => {
        this.props.history.push(`/artists/page/${value}`);
        window.scroll(0, 0);
    };

    handleSearch = event => {
        this.setState({ searchField: event.target.value, currentPage: 1 });
    };

    handleSort = compare => {
        const { artistList, updateArtistList } = this.props;
        artistList.sort(compare);
        updateArtistList(cloneDeep(artistList));
    };

    byName = (a, b) => {
        const x = a.name.toLowerCase();
        const y = b.name.toLowerCase();
        if (x < y) return -1;
        return x > y ? 1 : 0;
    };

    byPopularity = (a, b) => {
        const x = a.avg_pop;
        const y = b.avg_pop;
        if (x > y) return -1;
        return x < y ? 1 : 0;
    };

    handleFilter = genre => {
        const { genreFilter } = this.state;
        if (genreFilter.includes(genre)) {
            const index = genreFilter.indexOf(genre);
            if (index !== -1) genreFilter.splice(index, 1);
        } else {
            genreFilter.push(genre);
        }
        this.setState({ genreFilter, currentPage: 1 });
    };

    menuItems = [
        {
            label: 'Name',
            func: () => this.handleSort(this.byName)
        },
        {
            label: 'Popularity',
            func: () => this.handleSort(this.byPopularity)
        }
    ];

    render() {
        const { currentPage, searchField, genreFilter } = this.state;
        const { classes, artistList, updateCurrentArtist, history } = this.props;

        let filteredList = cloneDeep(artistList);
        filteredList = filteredList ? filteredList.filter(artist => (
            artist.name.toUpperCase().includes(searchField.toUpperCase())
            && (genreFilter.length === 0 || artist.genres.some(r => genreFilter.includes(r)))
        )) : null;

        return (
            <div style={{ overflowX: 'hidden' }}>
                <h1 className='mt5 title-text'>Top Billboard Artists</h1>
                {
                    artistList && artistList.length ?
                        <div>
                            <div className='mv4'>
                                <div className='db'>
                                    <Button style={{ backgroundColor: '#282828' }} variant='contained' onClick={() => history.push('/artists/table')}>View as Table</Button>
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
                                            title='Filter by genre'
                                            menuItems={genres.map(genre => ({
                                                label: genre,
                                                func: () => this.handleFilter(genre)
                                            }))}
                                        />
                                    </div>
                                    <div className='ma2 dib'>
                                        <Button
                                            style={{ backgroundColor: '#20b954' }}
                                            variant='contained'
                                            onClick={() => this.setState({ genreFilter: [] })}
                                        >
                                            <span style={{ color: '#000000' }}>Clear Filters</span>
                                        </Button>
                                    </div>
                                </div>
                                <p>
                                    Currently Filtering by: {genreFilter.join(', ')}
                                </p>
                            </div>
                            <Pagination className='dib ma4' page={parseInt(currentPage)} onChange={this.handlePageChange} count={Math.ceil(filteredList.length / 9)} />
                            <Grid container spacing={3}>
                                {
                                    filteredList.slice((currentPage - 1) * 9, currentPage * 9).map(artist => (
                                        <Grid key={uuidv1()} item xs={12} sm={6} md={4}>
                                            {
                                                artist.images[0].url ?
                                                    <img
                                                        onClick={() => {
                                                            history.push(`/artist/${artist.name}`);
                                                            updateCurrentArtist({
                                                                artistName: artist.name,
                                                                popularity: artist.avg_pop,
                                                                timeOnCharts: artist.time_on_charts,
                                                                albums: artist.albums,
                                                                songs: artist.songs,
                                                                profileArt: artist.images[0].url,
                                                                chartsIn: artist.charts_in
                                                            });
                                                        }}
                                                        src={artist.images[0].url}
                                                        alt='profile art'
                                                        className='mw5 center db outline black-10 link dim pointer'
                                                    />
                                                :
                                                    <i style={{ color: '#b3b3b3' }}>Cannot display image</i>
                                            }
                                            <dl className='mv3 f6 lh-copy'>
                                                <dt className='clip'>Artist</dt>
                                                <dd className='fw6 ml0 white truncate w-100'>{artist.name}</dd>
                                                <dt className='clip'>Popularity</dt>
                                                <dd className='fw6 ml0 white truncate w-100'>Popularity: {artist.avg_pop}%</dd>
                                                <dt className='clip'>Time On Charts</dt>
                                                <dd className='fw6 ml0 white truncate w-100'>Time on Charts: {artist.time_on_charts} weeks</dd>
                                            </dl>
                                        </Grid>
                                    ))
                                }
                            </Grid>
                            <Pagination className='dib ma4' page={parseInt(currentPage)} onChange={this.handlePageChange} count={Math.ceil(filteredList.length / 9)} />
                        </div>
                    :
                        <Loader className='mv6' type='ThreeDots' color='white' height={80} width={80} />
                }
            </div>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    artistList: selectArtistList
});

const mapDispatchToProps = dispatch => ({
    updateCurrentArtist: artist => dispatch(updateCurrentArtist(artist)),
    updateArtistList: artistList => dispatch(updateArtistList(artistList))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ArtistGrid)));
