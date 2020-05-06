import React from 'react';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { v1 as uuidv1 } from 'uuid';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentSong } from '../../redux/ModelSelectors';
import { updateCurrentArtist, updateCurrentChart } from '../../redux/ModelActions';

import '../../styles/SongDisplay.css';

const SongDisplay = ({ currentSongView, history, updateCurrentArtist, updateCurrentChart }) => {
    const { trackName, artistNames, artistId, albumName, albumArt, trackUrl, lyrics, chartsIn } = currentSongView;

    return (
        <article>
            <div className='cf pa2'>
                <div className='pa2'>
                    <a href={trackUrl} className='dib' target='_blank' rel='noopener noreferrer'>
                        {
                            albumArt ?
                                <img src={albumArt} alt='album art' className='mw5 center db outline black-10 link dim'/>
                            :
                                <i style={{ color: '#b3b3b3' }}>Cannot display image</i>
                        }
                    </a>
                    <dl className='mt2 f6 lh-copy'>
                        <dt className='clip'>Title</dt>
                        <dd className='fw6 ml0 white truncate w-100'>{trackName}</dd>
                        <dt className='clip'>Artist</dt>
                        <dd
                            className='ml0 gray truncate w-100 artist-link'
                            onClick={async () => {
                                updateCurrentArtist({});
                                history.push(`/artist/${artistNames}`);
                                const artistData = await fetch(`${process.env.REACT_APP_BACKEND_URL}/searchartistid`, {
                                    method: 'post',
                                    headers: {'Content-Type': 'application/json'},
                                    body: JSON.stringify({ id: artistId })
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
                            {artistNames}
                        </dd>
                        <dt className='clip'>Album</dt>
                        <dd className='fw3 ml0 white truncate w-100'>{albumName}</dd>
                    </dl>
                    
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <div className='mt6 mw6 center'>
                                <h1 className='title-text mb4'>Charts Appeared In</h1>
                                <ol style={{ listStylePosition: 'inside' }}>
                                    {
                                        chartsIn.map(chart => <li key={uuidv1()} className='tc mv3'>
                                            <span
                                                className='click-link pointer fw7'
                                                onClick={async () => {
                                                    updateCurrentChart({});
                                                    history.push(`/chart/${chart[0]}`);
                                                    const chartData = await fetch(`${process.env.REACT_APP_BACKEND_URL}/searchchartid`, {
                                                        method: 'post',
                                                        headers: {'Content-Type': 'application/json'},
                                                        body: JSON.stringify({ id: chart[1] })
                                                    });
                                                    const chartJSON = await chartData.json();
                                                    updateCurrentChart({
                                                        chartDate: chartJSON.date,
                                                        songs: chartJSON.songs
                                                    });
                                                }}
                                            >
                                                {chart[0]}
                                            </span>
                                        </li>)
                                    }
                                </ol>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <div className='mt6'>
                                <h1 className='title-text'>Genius Lyrics</h1>
                                <p style={{ whiteSpace: 'pre-line' }}>{lyrics.trim()}</p>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </article>
    );
};

const mapStateToProps = createStructuredSelector({
    currentSongView: selectCurrentSong
});

const mapDispatchToProps = dispatch => ({
    updateCurrentArtist: artist => dispatch(updateCurrentArtist(artist)),
    updateCurrentChart: chart => dispatch(updateCurrentChart(chart))
}); 

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SongDisplay));
