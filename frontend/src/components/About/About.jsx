import React, { Component } from 'react';
import ProfileCard from './ProfileCard';
import TeamStats from './TeamStats';
import  { getCommits, getIssues } from '../../services/octokit';
import Grid from '@material-ui/core/Grid';
import { v1 as uuidv1 } from 'uuid';

import Teammates from '../../data/teammates.json';
import jerry from '../../assets/jerry.png';
import matt from '../../assets/matt.png';
import dylan from '../../assets/dylan.png';
import ryuichi from '../../assets/ryuichi.png';
import diana from '../../assets/diana.png';
import kevin from '../../assets/kevin.png';

import '../../styles/About.css';

class About extends Component {
    profilePics = [jerry, matt, dylan, ryuichi, diana, kevin];

    constructor(props) {
        super(props);
        this.state = {
            members: Teammates
        };
    }

    async componentDidMount() {
        try {
            const commits = await getCommits();
            const issues = await getIssues();
            const currStats = this.state.members;
            commits.forEach(commit => {
                currStats[commit.userName] = { ...currStats[commit.userName], commits: commit.commitCount };
            });
            Object.keys(issues).forEach(user => {
                currStats[user] = { ...currStats[user], issues: issues[user] };
            });
            this.setState({ members: currStats });
        } catch(err) {
            console.log(err);
        }
    }

    getTotals = teammates => {
        const total = {};
        total.commits = Object.keys(teammates).reduce((acc, curr) => (acc + teammates[curr].commits), 0);
        total.issues = Object.keys(teammates).reduce((acc, curr) => (acc + teammates[curr].issues), 0);
        total.numTests = Object.keys(teammates).reduce((acc, curr) => (acc + teammates[curr].numTests), 0);
        return total;
    }

    render() {
        const { members } = this.state;
        const totals = this.getTotals(members);

        return (
            <div className='pa4'>
                <div className='center mw7'>
                    <h1 className='title-text'>Our Project</h1>
                    <p className='tl'>An Online database storing information about Billboard Top Hits and various songs and artists. This web app can be used to find more information about any song or chart, and it’s intended for anyone with an interest in music. Using the three models’ disparate data sets, we have been able to create a useful tool for researching the relationship between a song, its artist, and their relative success throughout the ages.</p>
                    <p className='tl fw7'>Github Repo (private): <a className='click-link' href='https://github.com/dylanmccoy/ee-461l-idb' target='_blank' rel='noopener noreferrer'>https://github.com/dylanmccoy/ee-461l-idb</a></p>
                    <hr className='w-50 bw1 mv5' style={{ backgroundColor: '#b3b3b3' }} />
                </div>

                <h1 className='title-text'>Project Members</h1>
                <Grid container spacing={3}>
                    {Object.values(members).map((member, ind) => (
                        <Grid key={uuidv1()} item xs={12} sm={6}>
                            <ProfileCard {...member} imgUrl={this.profilePics[ind]} />
                        </Grid>
                    ))}
                </Grid>

                <TeamStats {...totals} />

                <div className='center mw7'>
                    <hr className='w-50 bw1 mv5' style={{ backgroundColor: '#b3b3b3' }} />
                    <h1 className='title-text'>Interesting Challenges</h1>
                    <ul className='tl'>
                        <li>We had to account for different ways of storing information between data sources.</li>
                        <li>We needed to be flexible in tools used to parse/modify data items</li>
                    </ul>
                    <hr className='w-50 bw1 mv5' style={{ backgroundColor: '#b3b3b3' }} />
                </div>

                <div className='center mw7'>
                    <h1 className='title-text'>Data</h1>
                    <ul className='tl'>
                        <li>Spotify: To scrape data from Spotify, we used Spotipy, a Python library for the Spotify Web API</li>
                        <li>Billboard: To scrape data from the Billboard Charts, we used billboard, a Python library</li>
                        <li>Genius: To scrape data from Genius, we queried lyrics using Genius API and used BeautifulSoup to parse and format the data</li>
                    </ul>
                    <hr className='w-50 bw1 mv5' style={{ backgroundColor: '#b3b3b3' }} />
                </div>

                <div className='center mw7'>
                    <h1 className='title-text'>Tools</h1>
                    <ul className='tl'>
                        <li>Frontend: JavaScript (React)</li>
                        <li>Data Scraping/unit testing: Python</li>
                        <li>Frontend Testing: Mocha</li>
                        <li>GUI Testing: Selenium</li>
                        <li>API Testing: Postman</li>
                    </ul>
                    <hr className='w-50 bw1 mv5' style={{ backgroundColor: '#b3b3b3' }} />
                </div>
            </div>
        );
    }
};

export default About;
