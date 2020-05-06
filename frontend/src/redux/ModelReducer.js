import ModelActionTypes from './ModelTypes';

const INITIAL_STATE = {};

const modelReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case ModelActionTypes.UPDATE_SONG_LIST:
            return {
                ...state,
                songList: action.payload
            };
        case ModelActionTypes.UPDATE_ARTIST_LIST:
            return {
                ...state,
                artistList: action.payload
            };
        case ModelActionTypes.UPDATE_CHART_LIST:
            return {
                ...state,
                chartList: action.payload
            };
        case ModelActionTypes.UPDATE_CURRENT_SONG:
            return {
                ...state,
                currentSongView: action.payload
            };
        case ModelActionTypes.UPDATE_CURRENT_ARTIST:
            return {
                ...state,
                currentArtistView: action.payload
            };
        case ModelActionTypes.UPDATE_CURRENT_CHART:
            return {
                ...state,
                currentChartView: action.payload
            };
        default:
            return state;
    }
};

export default modelReducer;
