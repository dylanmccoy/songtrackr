export const convertLink = (song, artist) => {
    const songString = song.trim().toLowerCase().replace(/ /g, '-');
    const artistString = artist.trim().toLowerCase().replace(/ /g, '-');
    return songString + '-by-' + artistString;
};

export const findSpotifySong = async songAndArtist => {
    const trackAndArtist = songAndArtist.replace(/-/g, ' ').replace(/'/g, '').split(' by ');
    if (trackAndArtist[1].includes(' featuring ')) {
        trackAndArtist[1] = trackAndArtist[1].split(' featuring ')[0];
    }
    if (trackAndArtist[1].includes(' x ')) {
        trackAndArtist[1] = trackAndArtist[1].split(' x ')[0];
    }
    if (trackAndArtist[1].includes(' & ')) {
        trackAndArtist[1] = trackAndArtist[1].split(' & ')[0];
    }
    try {
        const trackData = await fetch(`${process.env.REACT_APP_BACKEND_URL}/searchtrack`, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ track: trackAndArtist[0], artist: trackAndArtist[1] })
        });
        const trackInfo = await trackData.json();
        return {
            trackName: trackInfo.track,
            artistNames: trackInfo.artists.join(', '),
            albumName: trackInfo.album,
            albumArt: trackInfo.albumArt,
            trackUrl: trackInfo.trackUrl
        };
    } catch(err) {
        console.log(err);
    }
};
