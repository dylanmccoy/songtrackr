import React from "react";
import ReactDOM from "react-dom";
import { act, findRenderedDOMComponentWithClass, scryRenderedDOMComponentsWithClass } from "react-dom/test-utils";
import { renderIntoDocument} from 'react-dom/test-utils';
import { expect } from "chai";
const jsdom = require("mocha-jsdom");

global.document = jsdom({
  url: "http://localhost:3000/"
});

// import About from './components/About';
// import ProfileCard from "./components/ProfileCard";
// import Charts from "./components/Charts";
// import SongPage from "./components/SongPage";

let rootContainer;

beforeEach(() => {
  rootContainer = document.createElement("div");
  document.body.appendChild(rootContainer);
});

afterEach(() => {
  document.body.removeChild(rootContainer);
  rootContainer = null;
});

// describe('Front End', function() {
//   it("About page h1 content test", () => {
//     act(() => {
//       ReactDOM.render(<About />, rootContainer);
//     });
//     const h1 = rootContainer.querySelector("h1");
//     expect(h1.textContent).to.equal("Project Members");
//   });

//   it("Profile card should display passed information variables", () => {
//     let mockInformation = {
//       "imgUrl": "j4.png",
//       "name": "Jarvan IV",
//       "username": "jarvanthefourth",
//       "commits": 4,
//       "issues" : 4
//     }
//     act(() => {
//       ReactDOM.render(<ProfileCard {...mockInformation}/>, rootContainer);
//     });
//     const nameAndUser = rootContainer.querySelector("h1");
//     expect(nameAndUser.textContent).to.equal("Jarvan IV (@jarvanthefourth)");
//     const issuesAndCommits = rootContainer.querySelectorAll("p");
//     expect(issuesAndCommits[0].textContent).to.equal("Commits: 4");
//     expect(issuesAndCommits[1].textContent).to.equal("Issues: 4");
//   });

//   it("Song page should only display loader when no album art", () => {
//     act(() => {
//       ReactDOM.render(<SongPage />, rootContainer);
//     });
//     expect(rootContainer.children.length).to.equal(1);
//   });
// });

import About from './components/About/About';
import ArtistGrid from './components/Artists/ArtistGrid';
import ChartTable from './components/Charts/ChartTable';

describe("Front end", () => {
    it("Should display the correct number of total commits, issues, and tests for our team on the about page", () => {
        const teammates = {
            "diana": {
                "commits": 10,
                "issues": 5,
                "numTests": 5
            },
            "jerry": {
                "commits": 10,
                "issues": 5,
                "numTests": 5
            },
            "matt": {
                "commits": 10,
                "issues": 5,
                "numTests": 5
            },
            "dylan": {
                "commits": 10,
                "issues": 5,
                "numTests": 5
            },
            "ryuichi": {
                "commits": 10,
                "issues": 5,
                "numTests": 5
            },
            "kevin": {
                "commits": 10,
                "issues": 5,
                "numTests": 5
            },
        };
        const about = new About();
        const totals = about.getTotals(teammates);
        expect(totals.commits).to.equal(60);
        expect(totals.issues).to.equal(30);
        expect(totals.numTests).to.equal(30);
    });

    it("Should compare names and popularities in the correct sorting manner", () => {
        const grid = new ArtistGrid();
        artists = [
            {
                "name": "kevin",
                "avg_pop": 0.8
            },
            {
                "name": "Jerry",
                "avg_pop": 0.9
            }
        ]
        expect(grid.byName(artists[0], artists[1])).to.equal(-1);
        expect(grid.byPopularity(artists[0], artists[1])).to.equal(1);
    });

    it("Should display the right week for each billboard date", () => {
        const chartTable = new ChartTable();
        const testDate = new Date(2015, 11, 17, 3, 24, 0);
        const result = chartTable.convertDateToBillboardWeek(testDate);
        expect(result).to.equal('2015-12-17');
    });
});