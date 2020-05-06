'''
    To run test: move into same directory as spotify_api.py file
'''

import unittest
import spotify_api
import spotipy
import pandas as pd
from spotipy.oauth2 import SpotifyClientCredentials

client_id =  'ea776b5b86c54bd188d71ec087b194d3'         
client_secret = '1e0fcbac137c4d3eb2d4cc190693792a'    # keep this hidden
redirect_uri = 'http://localhost:'                    # will be changed

class TestSpotify(unittest.TestCase):

    client_credentials_manager = None
    sp = None

    @classmethod
    def setUpClass(cls):
        cls.client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
        cls.sp = spotipy.Spotify(client_credentials_manager=cls.client_credentials_manager)

    
    def testGetArtistInfoReturns(self):
        an_dict = dict()
        au_dict = dict()
        artist = "Bad Suns"
        info = spotify_api.get_artist_info(self.sp, artist, an_dict, au_dict)
        self.assertIsNotNone(info)

    def testGetArtistInfo(self):
        an_dict = dict()
        au_dict = dict()
        artist = "Bad Suns"
        info = spotify_api.get_artist_info(self.sp, artist, an_dict, au_dict)
        self.assertEqual(5, len(info)) # make sure the number of albums recorded is correct

    def testArtistToDF(self):
        
        an_dict = dict()
        au_dict = dict()
        artist = "Bad Suns"
        info = spotify_api.get_artist_info(self.sp, artist, an_dict, au_dict)
        df = spotify_api.artist_to_csv("Bad Suns", info)
        self.assertEqual(58, len(df)) # make sure the number of albums recorded is correct

    def testDFToDict(self):
        
        an_dict = dict()
        au_dict = dict()
        artist = "Bad Suns"
        info = spotify_api.get_artist_info(self.sp, artist, an_dict, au_dict)
        df = spotify_api.artist_to_csv("Bad Suns", info)
        d = spotify_api.artist_df_to_dict(df, "Bad Suns")
        self.assertEqual(13, len(d)) # make sure the number of albums recorded is correct

    def testDFToSongs(self):
        
        an_dict = dict()
        au_dict = dict()
        artist = "Bad Suns"
        info = spotify_api.get_artist_info(self.sp, artist, an_dict, au_dict)
        df = spotify_api.artist_to_csv("Bad Suns", info)
        songs = spotify_api.artist_df_to_songs(df, "Bad Suns")
        self.assertEqual(13, len(songs)) # make sure the number of albums recorded is correct


unittest.main()
