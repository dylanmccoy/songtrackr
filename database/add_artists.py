#!/usr/bin/env
import sys
from pymongo import MongoClient
from utils import get_artist_names, create_mongo_client


if __name__ == "__main__":
    client = create_mongo_client()
    db = client.billboard

    artists = set()
    artist_exceptions = ["Tyler, The Creator"]

    db.artists.delete_many({})
    doc_songs = db.songs.find({})           # finds all songs in mongoDB

    for song in doc_songs:
        # check to see if artist with same name is in db
        
        artists = get_artist_names(song['artist'])
        if song['artist'] in artist_exceptions:
            artists = [song['artist']]
        for a in artists:
            artist = db.artists.find_one({'name': a})
            artist_id = None
            if artist == None:
                # insert new artist doc
                print('inserting new artist {}'.format(a))
                artist = {}
                artist['name'] = a
                artist['songs'] = [{'name': song['name'], '_id': song['_id'], 'uri': song['uri']}]
                if song['album_name'] is not None:
                    artist['albums'] = [{'name': song['album_name'], 'image': song['image'], 'uri': song['album_uri']}]
                else:
                    artist['albums'] = []
                artist['track_count'] = 1
                artist['avg_pop'] = 0 if song['popularity'] == None else song['popularity']
                artist['time_on_charts'] = song['duration']
                result = db.artists.insert_one(artist)
                artist_id = result.inserted_id
            else:
                print('updating {} in db with new song:{}'.format(a, song['name']))
                # update existing artist with song link
                song_in = False
                for item in artist['songs']:
                    if song['_id'] == item['_id']:
                        song_in = True
                if not song_in:
                    artist['songs'].append({'name': song['name'], '_id': song['_id'], 'uri': song['uri']})
                    if song['album_name'] is not None:
                        album_in = False
                        for item in artist['albums']:
                            if item['uri'] == song['album_uri']:
                                album_in = True
                        if not album_in:
                            artist['albums'].append({'name': song['album_name'], 'image': song['image'], 'uri': song['album_uri']})
                    pop_sum_prev = artist['avg_pop'] * artist['track_count']
                    artist['track_count'] += 1
                    pop_to_add = 0 if song['popularity'] == None else song['popularity']
                    artist['avg_pop'] = (pop_sum_prev + pop_to_add) / artist['track_count']
                    artist['time_on_charts'] += song['duration']

                    result = db.artists.update_one({'_id': artist['_id']}, {"$set": artist})
                artist_id = artist['_id']
        
        db.songs.update_one(song, {"$set": {'artist_id': artist_id}})
