import ModelActionTypes from './ModelTypes';

export const updateSongList = songList => ({
    type: ModelActionTypes.UPDATE_SONG_LIST,
    payload: songList
});

export const updateArtistList = artistList => ({
    type: ModelActionTypes.UPDATE_ARTIST_LIST,
    payload: artistList
});

export const updateChartList = chartList => ({
    type: ModelActionTypes.UPDATE_CHART_LIST,
    payload: chartList
});

export const updateCurrentSong = currentSong => ({
    type: ModelActionTypes.UPDATE_CURRENT_SONG,
    payload: currentSong
});

export const updateCurrentArtist = currentArtist => ({
    type: ModelActionTypes.UPDATE_CURRENT_ARTIST,
    payload: currentArtist
});

export const updateCurrentChart = currentChart => ({
    type: ModelActionTypes.UPDATE_CURRENT_CHART,
    payload: currentChart
});
