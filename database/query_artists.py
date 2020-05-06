#!/usr/bin/env
import sys
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from pymongo import MongoClient
from utils import get_artist_names, create_spotify_client, create_mongo_client


if __name__ == "__main__":
    client = create_mongo_client()
    statusResult = client.billbaord.command("serverStatus")

    sp = create_spotify_client()

    col_artists = client.billboard.artists.find({})
    for artist in col_artists:
        artist_d = {}
        artist_name = get_artist_names(artist['name'])[0]
        q = 'artist:' + artist_name
        result = sp.search(q=q, type='artist', limit=1)
        if len(result['artists']['items']) == 0:
            print("\n\n\n", q, "resulted in no hits \n \n \n")
            artist_d['uri'] = None
            artist_d['images'] = None
            artist_d['genres'] = None
            artist_d['href'] = None
        else:
            print(artist['name'])
            artist_d['uri'] = result['artists']['items'][0]['uri']
            artist_d['images'] = result['artists']['items'][0]['images']
            artist_d['genres'] = result['artists']['items'][0]['genres']
            artist_d['href'] = result['artists']['items'][0]['href']
        client.billboard.artists.update_one({'_id': artist['_id']}, {"$set": {"genres" : artist_d["genres"]}})

