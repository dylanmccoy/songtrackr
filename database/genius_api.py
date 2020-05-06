#!/usr/bin/env
import requests
from bs4 import BeautifulSoup

def request_song_info(search_param):
    base_url = 'https://api.genius.com'
    headers = {'Authorization': 'Bearer ' + '19qlI77HvC4NV0_0f-V5O-TlFh-XKrNCI7ykYH4vCMFv-263Zbh26TOMNAqOTCzX'}
    search_url = base_url + '/search'
    params = {'q': search_param}
    response = requests.get(search_url, params=params, headers=headers)

    return response

def match_artist_to_song(response, artist_name):
    song_info = None
    json = response.json()

    for hit in json['response']['hits']:
        if artist_name.split(', ')[0].lower() in hit['result']['primary_artist']['name'].lower():
            song_info = hit
            break

    return song_info

def get_song_url(song_title, artist_name):
    song_info = None
    song_url = None
    song_title = format_song_title(song_title)

    response = request_song_info(song_title + ' ' + artist_name.split(' ')[0])
    song_info = match_artist_to_song(response, artist_name)

    if song_info:
        song_url = song_info['result']['url']
    return song_url

def format_song_title(song_title):
    song_title = song_title.lower()
    if 'feat' in song_title:
        song_title = song_title.replace('feat', 'ft')
    if '(with' in song_title:
        song_title = song_title.split('(with')[0]
    song_title = ''.join(ch for ch in song_title if (ch != '.' and ch != '(' and ch != ')'))

    return song_title

def scrape_song_lyrics(url):
    page = requests.get(url)
    if page.status_code == 404:
        return None

    html = BeautifulSoup(page.text, 'html.parser')
    lyrics = html.find('div', class_='lyrics').get_text()

    return lyrics

def get_song_lyrics(song_title, artist_name):
    url = get_song_url(song_title, artist_name)
    if url is not None:
        return scrape_song_lyrics(url)
    return None
