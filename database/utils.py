#!/usr/bin/env
import sys
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import spotipy.util as util
import re
from pymongo import MongoClient

client_id =  'ea776b5b86c54bd188d71ec087b194d3'         
client_secret = "its secret"    # keep this hidden
redirect_uri = 'http://localhost:'                    # will be changed


def get_artist_names(s, seps = ['Featuring', ',', '&', 'Presents', 'X', 'Duet With', 'x']):
    artists = re.split('|'.join(seps), s)
    for i in range(len(artists)):
        artists[i] = artists[i].strip()
    return artists

def create_spotify_client():
    client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
    return sp

def create_mongo_client():
    return MongoClient("this is secret too")

def add_top_song_images(db):
    charts_docs = db.charts.find({})

    for chart in charts_docs:
        print(chart['date'])
        top_songs = []
        i = 0
        count = 0
        while count < 4:
            song = db.songs.find_one({"_id" : chart["songs"][i]["song_id"]})
            if (song['image'] != None):
                top_songs.append(song['image']['url'])
                count += 1
            i += 1
        db.charts.update_one({"_id" : chart["_id"]}, {"$set" : {"top_songs" : top_songs}})

def charts_artist_link(db):
    charts_docs = db.charts.find({})

    for chart in charts_docs:
        print('\n\n', chart['date'])
        for song in chart['songs']:
            print(song['name'])
            song_doc = db.songs.find_one({'_id': song['song_id']})
            artist_doc = db.artists.find_one({'_id': song_doc['artist_id']})
            if 'charts_in' in artist_doc:
                charts_in = artist_doc['charts_in']
            else:
                charts_in = []
            if chart['_id'] not in charts_in:
                charts_in.append(chart['_id'])
            song['artist_id'] = artist_doc['_id']
            db.artists.update_one({'_id' : artist_doc['_id']}, {"$set" : {'charts_in' : charts_in}})
        db.charts.update_one({'_id' : chart['_id']}, {"$set" : {'songs' : chart['songs']}})
