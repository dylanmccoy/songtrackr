import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { cloneDeep } from 'lodash';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Loader from 'react-loader-spinner';
import SortableTable from '../Table/SortableTable';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectArtistList } from '../../redux/ModelSelectors';
import { updateCurrentArtist, updateArtistList } from '../../redux/ModelActions';

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

class ArtistTable extends Component {
    artistHeaders = [
        { id: 'name', disablePadding: true, label: 'Artist' },
        { id: 'avg_pop', disablePadding: false, label: 'Popularity (%)' },
        { id: 'time_on_charts', disablePadding: false, label: 'Time on Charts (weeks)' }
    ];
    
    constructor(props) {
        super(props);
        this.state = {
            nameField: '',
            popLessThanField: '',
            popMoreThanField: ''
        };
    }

    handleNameSearch = event => {
        this.setState({ nameField: event.target.value });
    };

    handlePopLessThan = event => {
        this.setState({ popLessThanField: event.target.value });
    };

    handlePopMoreThan = event => {
        this.setState({ popMoreThanField: event.target.value });
    };

    async componentDidMount() {
        try {
            let { artistList, updateArtistList } = this.props;
            if (!artistList || !artistList.length) {
                const artistData = await fetch(`${process.env.REACT_APP_BACKEND_URL}/artists`);
                artistList = await artistData.json();
                artistList = artistList.filter(artist => artist.images)
                updateArtistList(artistList);
            }
        } catch(err) {
            console.log(err);
        }
    }

    render() {
        const { nameField, popLessThanField, popMoreThanField } = this.state;
        const { classes, history, artistList, updateCurrentArtist } = this.props;

        let filteredArtists = cloneDeep(artistList);

        filteredArtists = filteredArtists.filter(artist => (
            artist.name.toUpperCase().includes(nameField.toUpperCase())
        ));
        if (popLessThanField && !isNaN(popLessThanField)) {
            filteredArtists = filteredArtists.filter(artist => (
                parseFloat(artist.avg_pop) <= parseFloat(popLessThanField)
            ));
        }
        if (popMoreThanField && !isNaN(popMoreThanField)) {
            filteredArtists = filteredArtists.filter(artist => (
                parseFloat(artist.avg_pop) >= parseFloat(popMoreThanField)
            ));
        }

        filteredArtists.forEach(artist => {
            const artistName = artist.name;
            artist.name = <span
                className='fw7 pointer click-link'
                style={{ color: '#000000' }}
                onClick={() => {
                    history.push(`/artist/${artistName}`);
                    updateCurrentArtist({
                        artistName,
                        popularity: artist.avg_pop,
                        timeOnCharts: artist.time_on_charts,
                        albums: artist.albums,
                        songs: artist.songs,
                        profileArt: artist.images[0].url,
                        chartsIn: artist.charts_in
                    });
                }}
            >
                {artistName}
            </span>;
        });

        return (
            <div className='ma3 ma5-ns'>
                <h1 className='title-text'>Top Billboard Artists</h1>
                {
                    artistList && artistList.length ?
                        <div>
                            <div className='db mv4'>
                                <Button style={{ backgroundColor: '#282828' }} variant='contained' onClick={() => history.push('/artists/page/1')}>View as Grid</Button>
                            </div>
                            <div className='pa3 dib'>
                                <TextField
                                    id='outlined-basic'
                                    label='Search by Name'
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
                                    label='Filter Popularity <='
                                    variant='outlined'
                                    multiline
                                    rows={1}
                                    size='small'
                                    onChange={this.handlePopLessThan}
                                    className={classes.root}
                                    InputLabelProps={{ style: { color: '#b3b3b3' } }}
                                    InputProps={{ className: classes.input }}
                                />
                            </div>
                            <div className='pa3 dib'>
                                <TextField
                                    id='outlined-basic'
                                    label='Filter Popularity >='
                                    variant='outlined'
                                    multiline
                                    rows={1}
                                    size='small'
                                    onChange={this.handlePopMoreThan}
                                    className={classes.root}
                                    InputLabelProps={{ style: { color: '#b3b3b3' } }}
                                    InputProps={{ className: classes.input }}
                                />
                            </div>
                            <SortableTable headers={this.artistHeaders} dataSource={filteredArtists} initialSort='avg_pop' sortOrder='desc' />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ArtistTable)));
