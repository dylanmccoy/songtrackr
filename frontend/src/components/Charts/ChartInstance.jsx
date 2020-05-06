import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { cloneDeep } from 'lodash';
import { convertLink } from '../../services/searchSong';
import 'date-fns';
import SortableTable from '../Table/SortableTable';
import Loader from 'react-loader-spinner';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentChart } from '../../redux/ModelSelectors';
import { updateCurrentSong, updateCurrentArtist } from '../../redux/ModelActions';

import '../../styles/ChartTable.css';

const styles = {
    root: {
        '& label.Mui-focused': {
            color: '#20b954'
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#20b954'
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#b3b3b3'
            },
            '&:hover fieldset': {
                borderColor: '#b3b3b3'
            },
            '&.Mui-focused fieldset': {
                borderColor: '#b3b3b3'
            }
        }
    },
    input: {
        color: '#b3b3b3'
    }
};

class ChartInstance extends Component {
    songHeaders = [
        { id: 'rank', disablePadding: true, label: 'Rank' },
        { id: 'name', disablePadding: false, label: 'Name' },
        { id: 'artist', disablePadding: false, label: 'Artist' }
    ];

    componentDidMount() {
        window.scroll(0, 0);
    }

    convertDateToBillboardWeek = date => {
        date = new Date(date.setDate(date.getDate() - (date.getDay() === 6 ? 0 : date.getDay() + 1)));
        const year = date.getFullYear();
        let month = (date.getMonth() + 1);
        let day = date.getDate();

        if (month < 10) month = '0' + month;
        if (day < 10) day = '0' + day;

        return `${year}-${month}-${day}`;
    };

    handleDateChange = async date => {
        try {
            if (date > new Date()) {
                alert('Invalid date.');
                return;
            }
            this.setState({ loadFailed: false });
            const billboardData = await fetch(`${process.env.REACT_APP_BACKEND_URL}/searchchart`, {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ date: this.convertDateToBillboardWeek(date) })
            });
            const billboardList = await billboardData.json();
            if (billboardList !== 'error') {
                this.setState({ songList: billboardList });
            } else {
                console.log('Error retrieving chart');
                this.setState({ loadFailed: true });
                this.setState({ songList: [] });
            }
            this.setState({ date: date });
        } catch(err) {
            console.log(err);
        }
    }

    handleWeekChange = direction => {
        const { date } = this.state;
        const millisecondInWeek = 1000 * 60 * 60 * 24 * 7;
        const newWeek = new Date(date.getTime() + (direction === 'forward' ? millisecondInWeek : -millisecondInWeek));
        this.handleDateChange(newWeek);
    };

    render() {
        const { history, updateCurrentSong, updateCurrentArtist, currentChartView } = this.props;

        let filteredSongs = cloneDeep(currentChartView.songs);

        if (filteredSongs) {
            filteredSongs.forEach((song, ind) => {
                const trackName = song.name;
                const artistName = song.artist;
                
                song.name = <span
                    className='fw7 pointer click-link'
                    style={{ color: '#000000' }}
                    onClick={async () => {
                        updateCurrentSong({});
                        history.push(`/song/${convertLink(trackName, artistName)}`);
                        const songData = await fetch(`${process.env.REACT_APP_BACKEND_URL}/searchsongid`, {
                            method: 'post',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ id: song.song_id })
                        });
                        const songJSON = await songData.json();
                        updateCurrentSong({
                            trackName,
                            artistNames: songJSON.artist,
                            artistId: songJSON.artist_id,
                            albumName: songJSON.album_name,
                            albumArt: songJSON.image ? songJSON.image.url : '',
                            trackUrl: songJSON.ext_url,
                            lyrics: songJSON.lyrics,
                            chartsIn: songJSON.charts_in
                        });
                    }}
                >
                    {trackName}
                </span>;
    
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
    
                song.rank = ind + 1;
            });
        }

        return (
            <div className='ma3 ma5-ns'>
                <h1 className='title-text'>Week of {currentChartView.chartDate}</h1>
                {
                    filteredSongs && filteredSongs.length ?
                        <SortableTable headers={this.songHeaders} dataSource={filteredSongs} initialSort='rank' />
                    :
                        <Loader className='mv6' type='ThreeDots' color='white' height={80} width={80} />
                }
            </div>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    currentChartView: selectCurrentChart
});

const mapDispatchToProps = dispatch => ({
    updateCurrentSong: song => dispatch(updateCurrentSong(song)),
    updateCurrentArtist: artist => dispatch(updateCurrentArtist(artist))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ChartInstance)));
