import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './components/Home/Header';
import SongTable from './components/Songs/SongTable';
import SongGrid from './components/Songs/SongGrid';
import ArtistTable from './components/Artists/ArtistTable';
import ArtistGrid from './components/Artists/ArtistGrid';
import ChartInstance from './components/Charts/ChartInstance';
import ChartGrid from './components/Charts/ChartGrid';
import About from './components/About/About';
import Footer from './components/Home/Footer';
import SongInstance from'./components/Songs/SongInstance';
import ArtistInstance from './components/Artists/ArtistInstance';
import HomeCarousel from './components/Home/HomeCarousel';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

class App extends Component {
    render() {
        return (
            <div className='App'>
                <Header />
                <Switch>
                    {/* HOME & ABOUT */}
                    <Route exact path='/'>
                        <HomeCarousel />
                    </Route>

                    <Route path='/about'>
                        <About />
                    </Route>


                    {/* SONGS */}
                    <Route path='/songs/table'>
                        <SongTable />
                    </Route>

                    <Route path='/songs/page/:pageNum' render={props => <SongGrid {...props} />} />


                    {/* ARTISTS */}
                    <Route path='/artists/table'>
                        <ArtistTable />
                    </Route>

                    <Route path='/artists/page/:pageNum' render={props => <ArtistGrid {...props} />} />


                    {/* CHARTS */}
                    <Route path='/charts/page/:pageNum' render={props => <ChartGrid {...props} />} />


                    {/* INSTANCES */}
                    <Route path='/song/:songID' render={props => <SongInstance {...props} />} />

                    <Route path='/artist/:artistName' render={props => <ArtistInstance {...props} />} />

                    <Route path='/chart/:chartDate' render={props => <ChartInstance {...props} />} />
                </Switch>
                <Footer />
            </div>
        );
    }
}

export default App;
