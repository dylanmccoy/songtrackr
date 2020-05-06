#!/usr/bin/env
import sys
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import spotipy.util as util
import time
import numpy as np
import pandas as pd
import re
from pymongo import MongoClient
import billboard
import csv
import genius_api
import string
from utils import get_artist_names, create_mongo_client

def get_lyrics_genius(doc):
    name = doc['name']
    artist = get_artist_names(doc['artist'])[0]
    lyrics = genius_api.get_song_lyrics(name, artist)
    return lyrics

def update_doc_lyrics(doc, lyrics, client):
    doc_id = doc['_id']
    x = client.billboard.songs.update_one({'_id' : doc_id}, 
                                        { "$set": {"lyrics" : lyrics}})
    return x

client = create_mongo_client()
song_list = client.billboard.songs.find({})

success = 0
count = 0
for song in song_list:
    print('getting lyrics for', song['name'], 'artist:', song['artist'], 'success:', success, 'total:', count)
    lyrics = get_lyrics_genius(song)
    if lyrics is not None:
        print('updating doc for', song['name'], 'id:', song['_id'])
        result = update_doc_lyrics(song, lyrics, client)
        if result.matched_count > 0:
            success += 1
    count += 1