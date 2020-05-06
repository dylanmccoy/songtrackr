import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import art1 from '../../assets/a1.png';
import art2 from '../../assets/a2.png';
import art3 from '../../assets/a3.png';
import art4 from '../../assets/a4.png';
import art5 from '../../assets/a5.png';
import art6 from '../../assets/a6.png';
import art7 from '../../assets/a7.png';
import art8 from '../../assets/a8.png';
import art9 from '../../assets/a9.png';

const HomeCarousel = ({ history }) => (
    <Carousel>
        <Carousel.Item>
            <Row className='pointer' onClick={() => history.push('/songs/page/1')}>
                <Col xs='6' sm ='4'>
                    <img
                        className='db w-100'
                        src={art1}
                        alt='First slide'
                    />
                </Col>
                <Col xs='6' sm ='4'>
                    <img
                        className='db w-100'
                        src={art2}
                        alt='First slide'
                    />
                </Col>
                <Col xs='6' sm ='4'>
                    <img
                        className='dn db-ns w-100-ns'
                        src={art3}
                        alt='First slide'
                    />
                </Col>
            </Row>
            <Row>
                <Carousel.Caption>
                    <div className='dib' style={{ backgroundColor:'rgba(0, 0, 0, 0.5)', padding: '10px 20px 0' }}>
                        <h3 className='fw6'>SongTrackr</h3>
                        <p>Find Your Favorite Songs</p>
                    </div>
                </Carousel.Caption>
            </Row>
        </Carousel.Item>

        <Carousel.Item>
            <Row className='pointer' onClick={() => history.push('/artists/page/1')}>
                <Col xs='6' sm ='4'>
                    <img
                        className='db w-100'
                        src={art4}
                        alt='Second slide'
                    />
                </Col>
                <Col xs='6' sm ='4'>
                    <img
                        className='db w-100'
                        src={art5}
                        alt='Second slide'
                    />
                </Col>
                <Col xs='6' sm ='4'>
                    <img
                        className='dn db-ns w-100-ns'
                        src={art6}
                        alt='Second slide'
                    />
                </Col>
            </Row>
            <Row>
            <Carousel.Caption>
                    <div className='dib' style={{ backgroundColor:'rgba(0, 0, 0, 0.5)', padding: '10px 20px 0' }}>
                        <h3 className='fw6'>SongTrackr</h3>
                        <p>Find Your Top Artists</p>
                    </div>
                </Carousel.Caption>
            </Row>
        </Carousel.Item>

        <Carousel.Item>
            <Row className='pointer' onClick={() => history.push('/charts/page/1')}>
                <Col xs='6' sm ='4'>
                    <img
                        className='db w-100'
                        src={art7}
                        alt='Third slide'
                    />
                </Col>
                <Col xs='6' sm ='4'>
                    <img
                        className='db w-100'
                        src={art8}
                        alt='Third slide'
                    />
                </Col>
                <Col xs='6' sm ='4'>
                    <img
                        className='dn db-ns w-100-ns'
                        src={art9}
                        alt='Third slide'
                    />
                </Col>
            </Row>
            <Row>
            <Carousel.Caption>
                    <div className='dib' style={{ backgroundColor:'rgba(0, 0, 0, 0.5)', padding: '10px 20px 0' }}>
                        <h3 className='fw6'>SongTrackr</h3>
                        <p>Look at Top Charts</p>
                    </div>
                </Carousel.Caption>
            </Row>
        </Carousel.Item>
    </Carousel>
);

export default withRouter(HomeCarousel);
