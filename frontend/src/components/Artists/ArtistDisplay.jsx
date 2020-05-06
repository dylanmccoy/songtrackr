import React from 'react';
import { withRouter } from 'react-router-dom';
import { convertLink } from '../../services/searchSong';
import Grid from '@material-ui/core/Grid';
import { v1 as uuidv1 } from 'uuid';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentArtist } from '../../redux/ModelSelectors';
import { updateCurrentSong, updateCurrentChart } from '../../redux/ModelActions';

const ArtistDisplay = ({ currentArtistView, history, updateCurrentSong, updateCurrentChart }) => {
    const { artistName, popularity, timeOnCharts, albums, songs, profileArt, chartsIn } = currentArtistView

    return (
        <article>
            <div className='cf pa2'>
                <div className='pa2'>
                    <a href={profileArt} className='dib' target='_blank' rel='noopener noreferrer'>
                        {
                            profileArt ?
                                <img src={profileArt} alt='profile art' className='mw5 center db outline black-10 link dim'/>
                            :
                                <i style={{ color: '#b3b3b3' }}>Cannot display image</i>
                        }
                    </a>

                    <dl className='mt3 mb5 f6 lh-copy'>
                        <dt className='clip'>Artist</dt>
                        <dd className='fw6 ml0 white truncate w-100'>{artistName}</dd>
                        <dt className='clip'>Popularity</dt>
                        <dd className='fw6 ml0 white truncate w-100'>Popularity: {popularity}%</dd>
                        <dt className='clip'>Time On Charts</dt>
                        <dd className='fw6 ml0 white truncate w-100'>Time on Charts: {timeOnCharts} weeks</dd>
                    </dl>
                    
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} md={4}>
                            <div className='mw6 center'>
                                <h3 className='mv4 title-text'>Top Songs</h3>
                                <ol>
                                    {
                                        songs.slice(0, 10).map(song => <li key={uuidv1()} className='tl mv3'>
                                            <span
                                                className='click-link pointer fw7'
                                                onClick={async () => {
                                                    updateCurrentSong({});
                                                    history.push(`/song/${convertLink(song.name, artistName)}`);
                                                    const songData = await fetch(`${process.env.REACT_APP_BACKEND_URL}/searchsongid`, {
                                                        method: 'post',
                                                        headers: {'Content-Type': 'application/json'},
                                                        body: JSON.stringify({ id: song._id })
                                                    });
                                                    const songJSON = await songData.json();
                                                    updateCurrentSong({
                                                        trackName: songJSON.name,
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
                                                {song.name}
                                            </span>
                                        </li>)
                                    }
                                </ol>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                            <div className='mw6 center'>
                                <h3 className='mv4 title-text'>Top Albums</h3>
                                <Grid container spacing={3}>
                                    {
                                        albums.slice(0, 10).map((album, ind) => <Grid key={uuidv1()} item xs={12} sm={6}>
                                            <a href={album.image.url} className='dib' target='_blank' rel='noopener noreferrer'>
                                                <img src={album.image.url} alt='profile art' className='mw4 center db outline black-10 link dim'/>
                                            </a>
                                            <p>
                                                {ind + 1}. <b>{album.name}</b>
                                            </p>
                                        </Grid>)
                                    }
                                </Grid>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                            <div className='mw6 center'>
                                <h3 className='mv4 title-text'>Charts Appeared In</h3>
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
                    </Grid>
                </div>
            </div>
        </article>
    );
};

const mapStateToProps = createStructuredSelector({
    currentArtistView: selectCurrentArtist
});

const mapDispatchToProps = dispatch => ({
    updateCurrentSong: song => dispatch(updateCurrentSong(song)),
    updateCurrentChart: chart => dispatch(updateCurrentChart(chart))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ArtistDisplay));
