'''
    To run test: move into same directory as genius_api.py file
'''

import unittest
import ../genius_api

class TestGeniusLyrics(unittest.TestCase):

    def testFirstLyric(self):
        lyrics = genius_api.get_song_lyrics('Nurse Joy', 'Charmer')
        start = find_start(lyrics)
        self.assertEqual(lyrics[start:start+3], 'Are')

    def testInstrumental(self):
        lyrics = genius_api.get_song_lyrics('You Know I Should Be Leaving Soon', 'American Football')
        start = find_start(lyrics)
        self.assertEqual(lyrics[start:start+14], '[Instrumental]')

    def testLastLyric(self):
        lyrics = genius_api.get_song_lyrics('Amarillo', 'J Balvin')
        end = find_end(lyrics)
        self.assertEqual(lyrics[len(lyrics)-end-17:len(lyrics)-end],'Yo no me complico')

    def testForeignSong(self):
        lyrics = genius_api.get_song_lyrics('电动少女 (Electronic Girl)', 'Chinese Football')
        end = find_end(lyrics)
        self.assertEqual(lyrics[len(lyrics)-end-4:len(lyrics)-end], '就跟我转')

    def testMultipleArtists(self):
        lyrics = genius_api.get_song_lyrics('St Tropez', 'Skepta, Chip & Young Adz')
        start = find_start(lyrics)
        self.assertEqual(lyrics[start:start+16], '[Chorus: M.I.A.]')

    def testInvalidSong(self):
        
        lyrics = genius_api.get_song_lyrics('Not a real song', 'Not a real artist')


# find index of first character of lyrics
def find_start(lyrics):
    
    idx = 0
    while lyrics[idx] == '\n':
        idx += 1
    return idx

# find index of last character of lyrics
def find_end(lyrics):
    
    idx = 0
    while lyrics[len(lyrics)-idx-1] == '\n':
        idx += 1
    return idx

unittest.main()
