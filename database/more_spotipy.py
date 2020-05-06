#!/usr/bin/env
import sys
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from pymongo import MongoClient
from utils import get_artist_names, create_spotify_client, create_mongo_client

key_class = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

def get_audio_features(track_response):
    f = {}
    f['album_name'] = track_response['album']['name']
    f['image'] = track_response['album']['images'][0]
    f['ext_url'] = track_response['external_urls'].get("spotify", None)
    f['popularity'] = track_response['popularity']
    f['uri'] = track_response['uri']
    audio_f = sp.audio_features(track_response['uri'])[0]
    f['key'] = key_class[audio_f['key']] if audio_f['key'] != -1 else None
    return f

if __name__ == "__main__":
    client = create_mongo_client()
    statusResult = client.billbaord.command("serverStatus")

    sp = create_spotify_client()

    col_songs = client.billboard.songs.find({})
    artists = []
    for song in col_songs:
        artists = get_artist_names(song['artist'])
        q = 'track:{} artist:{}'.format(song['name'], artists[0])
        result = sp.search(q=q, limit=1)
        if len(result['tracks']['items']) == 0:
            print("\n\nNO SONGS FOUND FOR", song['name'], song['artist'])
            print(q)
            print("\n\n")
        else:
            for item in result['tracks']['items']:
                print(song['name'], item['name'], item['artists'][0]['name'], song['artist'])
            feats = get_audio_features(result['tracks']['items'][0])
            client.billboard.songs.update_one(song, {"$set": feats})

        # done updating song field, now must update/create corresponding artist

    