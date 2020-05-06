require('dotenv').config({ path: './.env' });
const { getCommits, getIssues } = require('./octokit');
const { getModel, getInstance } = require('./query');
const { MongoClient } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const url = process.env.MONGODB_URL;

const app = express();
app.use(bodyParser.json());
app.use(cors());

MongoClient.connect(url, (err, client) => {
    if (err) console.log(err);

    const billboardDB = client.db('billboard');

    // Model Endpoints
    app.get('/songs', (req, res) => getModel(billboardDB, 'songs', res));
    app.get('/artists', (req, res) => getModel(billboardDB, 'artists', res));
    app.get('/charts', (req, res) => getModel(billboardDB, 'charts', res));

    // Instance Endpoints 
    app.post('/searchsongid', async (req, res) => getInstance(billboardDB, 'songs', req, res));
    app.post('/searchartistid', async (req, res) => getInstance(billboardDB, 'artists', req, res));
    app.post('/searchchartid', async (req, res) => getInstance(billboardDB, 'charts', req, res));
    app.post('/searchlyricsid', async (req, res) => getInstance(billboardDB, 'lyrics', req, res));

    // GitHub Endpoints
    app.get('/commits', async (req, res) => {
        const numCommits = await getCommits();
        res.json(numCommits);
    });
    app.get('/issues', async (req, res) => {
        const numIssues = await getIssues();
        res.json(numIssues);
    });
    
    app.listen(process.env.PORT || 5000, () => {
        console.log(`App is running on port ${process.env.PORT || 5000}`);
    });
});