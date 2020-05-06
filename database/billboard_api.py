#!/usr/bin/env
import billboard
from pymongo import MongoClient
from utils import create_mongo_client

def chart_to_dict(chart):
    chart_dict = dict()
    chart_dict['name'] = str(chart.name)
    chart_dict['date'] = str(chart.date)
    chart_dict['songs'] = list()
    for chart_entry in chart:
        chart_dict['songs'].append({'name': chart_entry.title, 'artist': chart_entry.artist})
    return chart_dict

def delete_all_billboard_songs(db):
    x = db.songs.delete_many({})
    return x

def add_song_data(chart, doc_id):
    songs_added = []
    song_count = 0
    songs_updated = 0
    for x in range(len(chart)):
        s = chart[x]
        song = {
            'name':s.title,
            'artist':s.artist,
            'peakPos':s.peakPos,
            'rank':s.rank,
            'duration':s.weeks,
            'charts_in':[doc_id],
        }
        query = {}
        query['name'] = s.title
        query['artist'] = s.artist
        result = db.songs.update_one(query, {'$setOnInsert': song}, upsert=True)        # $setOnInsert - only inserts, no update, upsert checks if doc already exists based on filter
        if result.upserted_id != None:
            songs_added.append(result.upserted_id)
            song_count += 1
        else:
            song_doc = db.songs.find_one(query)
            songs_added.append(song_doc['_id'])
            songs_updated += update_song_data(song_doc, doc_id)

    print("songs added:", song_count)
    print("songs updated", songs_updated)
    return songs_added

def update_song_data(song, doc_id):
    query = {'_id' : song['_id']}
    if 'charts_in' in song:
        charts_in = song['charts_in']
    else:
        charts_in = []
    charts_in.append(doc_id)
    result = db.songs.update_one(query, {"$set": {"charts_in" : charts_in}})
    return result.matched_count

def add_chart_data(chart):
    chart_dict = chart_to_dict(chart)
    result = db.charts.update_one({'name': chart_dict['name'], 'date': chart_dict['date']}, {'$setOnInsert': chart_dict}, upsert=True)
    return result

def add_song_ids_to_chart(chart_id, song_ids):
    chart = db.charts.find_one({'_id': chart_id})
    result = None
    if chart is not None:
        songs = chart['songs']
        for i in range(len(songs)):
            songs[i]['song_id'] = song_ids[i]
        result = db.charts.update_one({'_id':chart['_id']}, {'$set': {"songs": songs}})
    else:
        print ("no chart with this id")
    return result


if __name__ == "__main__":
    client = create_mongo_client()
    db = client.billboard
    statusResult = db.command("serverStatus")
    chart_name = 'hot-100'
    chart = billboard.ChartData(chart_name)
    for i in range(100):
        result = add_chart_data(chart)
        if result.upserted_id != None:      # a document was inserted 
            print("chart", i, "not in db, add songs")
            songs_added = add_song_data(chart, result.upserted_id)
            add_song_ids_to_chart(result.upserted_id, songs_added)
        else:
            result = db.charts.find_one({'date':chart.date})
            update_song_data(chart, result['_id'])
            print("chart", i, "in db, updating with new chart id")
    chart = billboard.ChartData(chart_name, date = chart.previousDate, fetch = True, timeout = 25)

