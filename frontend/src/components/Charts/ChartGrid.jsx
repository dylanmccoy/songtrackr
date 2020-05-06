import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';
import { v1 as uuidv1 } from 'uuid';
import { cloneDeep } from 'lodash';
import TextField from '@material-ui/core/TextField';
import Loader from 'react-loader-spinner';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectChartList } from '../../redux/ModelSelectors';
import { updateCurrentChart, updateChartList } from '../../redux/ModelActions';

import '../../styles/Pagination.css';

const styles = {
    root: {
        '& label.Mui-focused': {
            color: '#b3b3b3'
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#b3b3b3'
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#b3b3b3'
            },
            '&:hover fieldset': {
                borderColor: '#b3b3b3'
            },
            '&.Mui-focused fieldset': {
                borderColor: '#20b954'
            }
        }
    },
    input: {
        color: '#b3b3b3'
    }
};

class ChartGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            searchField: '',
            startDateField: '',
            endDateField: ''
        };
    }

    async componentDidMount() {
        let { chartList, updateChartList, match } = this.props;
        if (!chartList || !chartList.length) {
            const chartData = await fetch(`${process.env.REACT_APP_BACKEND_URL}/charts`);
            chartList = await chartData.json();
            updateChartList(chartList);
        }
        this.setState({ currentPage: match.params.pageNum });
    }

    componentDidUpdate(prevProps) {
        const { pageNum: prevPageNum } = prevProps.match.params;
        const { pageNum: nextPageNum } = this.props.match.params;
        if (prevPageNum !== nextPageNum) {
            this.setState({ currentPage: nextPageNum });
        }
    }

    handlePageChange = (e, value) => {
        this.props.history.push(`/charts/page/${value}`);
        window.scroll(0, 0);
    };

    handleSearch = event => {
        this.setState({ searchField: event.target.value, currentPage: 1 });
    };

    handleStartDate = event => {
        this.setState({ startDateField: event.target.value, currentPage: 1 });
    };

    handleEndDate = event => {
        this.setState({ endDateField: event.target.value, currentPage: 1 });
    };

    render() {
        const { currentPage, searchField, startDateField, endDateField } = this.state;
        const { classes, chartList, updateCurrentChart, history } = this.props;

        let filteredList = cloneDeep(chartList);
        filteredList = filteredList ? filteredList.filter(chart => (
            chart.date.includes(searchField)
        )) : null;

        if (!isNaN(Date.parse(startDateField))) {
            filteredList = filteredList ? filteredList.filter(chart => (
                Date.parse(chart.date) > Date.parse(startDateField)
            )) : null;
        }
        if (!isNaN(Date.parse(endDateField))) {
            filteredList = filteredList ? filteredList.filter(chart => (
                Date.parse(chart.date) < Date.parse(endDateField)
            )) : null;
        }

        return (
            <div style={{ overflowX: 'hidden', overflowY: 'hidden' }}>
                <h1 className='mt5 title-text'>Weekly Billboard Charts</h1>
                {
                    chartList && chartList.length ?
                        <div>
                            <div className='db mt5 mb4'>
                                <span>Search for a date: </span>
                                <TextField
                                    id='outlined-basic'
                                    label='YYYY-MM-DD'
                                    variant='outlined'
                                    multiline
                                    rows={1}
                                    size='small'
                                    onChange={this.handleSearch}
                                    className={classes.root}
                                    InputLabelProps={{ style: { color: '#b3b3b3' } }}
                                    InputProps={{ style: {color: '#b3b3b3'} }}
                                />
                            </div>
                            <div className='db mt5 mb4'>
                                <h3 className='title-text mv3'>Filter Between Dates</h3>
                                <div className='mv3'> 
                                    <span>Start: </span>
                                    <TextField
                                        id='outlined-basic'
                                        label='YYYY-MM-DD'
                                        variant='outlined'
                                        multiline
                                        rows={1}
                                        size='small'
                                        onChange={this.handleStartDate}
                                        className={classes.root}
                                        InputLabelProps={{ style: { color: '#b3b3b3' } }}
                                        InputProps={{ style: {color: '#b3b3b3'} }}
                                    />
                                </div>
                                <div className='mv3'>
                                    <span>End: </span>
                                    <TextField
                                        id='outlined-basic'
                                        label='YYYY-MM-DD'
                                        variant='outlined'
                                        multiline
                                        rows={1}
                                        size='small'
                                        onChange={this.handleEndDate}
                                        className={classes.root}
                                        InputLabelProps={{ style: { color: '#b3b3b3' } }}
                                        InputProps={{ style: {color: '#b3b3b3'} }}
                                    />
                                </div>
                            </div>
                            <Pagination className='dib ma4' page={parseInt(currentPage)} onChange={this.handlePageChange} count={Math.ceil(filteredList.length / 9)} />
                            <Grid container spacing={3}>
                                {
                                    filteredList.slice((currentPage - 1) * 9, currentPage * 9).map(chart => (
                                        <Grid key={uuidv1()} item xs={12} sm={6} md={4}>
                                            <table
                                                onClick={() => {
                                                    history.push(`/chart/${chart.date}`);
                                                    updateCurrentChart({
                                                        chartDate: chart.date,
                                                        songs: chart.songs
                                                    });
                                                }}
                                                className='center mv3 click-link pointer'
                                                cellSpacing='0'
                                                cellPadding='0'
                                                border='0'
                                            >
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <img alt='' src={chart.top_songs[0]} className='mw4' />
                                                        </td>
                                                        <td>
                                                            <img alt='' src={chart.top_songs[1]} className='mw4' />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <img alt='' src={chart.top_songs[2]} className='mw4' />
                                                        </td>
                                                        <td>
                                                            <img alt='' src={chart.top_songs[3]} className='mw4' />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <p>Hot 100</p>
                                            <p>{chart.date}</p>
                                        </Grid>
                                    ))
                                }
                            </Grid>
                            <Pagination className='dib ma4' page={parseInt(currentPage)} onChange={this.handlePageChange} count={Math.ceil(filteredList.length / 9)} />
                        </div>
                    :
                        <Loader className='mv6' type='ThreeDots' color='white' height={80} width={80} />
                }
            </div>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    chartList: selectChartList
});

const mapDispatchToProps = dispatch => ({
    updateCurrentChart: chart => dispatch(updateCurrentChart(chart)),
    updateChartList: chartList => dispatch(updateChartList(chartList))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ChartGrid)));
