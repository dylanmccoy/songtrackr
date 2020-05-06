import { createSelector } from 'reselect';

const getSongList = state => state.model.songList;
const getArtistList = state => state.model.artistList;
const getChartList = state => state.model.chartList;
const getCurrentSong = state => state.model.currentSongView;
const getCurrentArtist = state => state.model.currentArtistView;
const getCurrentChart = state => state.model.currentChartView;

export const selectSongList = createSelector(
    [getSongList],
    songList => songList
);

export const selectArtistList = createSelector(
    [getArtistList],
    artistList => artistList
);

export const selectChartList = createSelector(
    [getChartList],
    chartList => chartList
);

export const selectCurrentSong = createSelector(
    [getCurrentSong],
    currentSong => currentSong
);

export const selectCurrentArtist = createSelector(
    [getCurrentArtist],
    currentArtist => currentArtist
);

export const selectCurrentChart = createSelector(
    [getCurrentChart],
    currentChart => currentChart
);
