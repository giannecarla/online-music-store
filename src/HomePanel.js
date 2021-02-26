import './App.css';
import React, { Fragment } from 'react';

export default function HomePanel(){
    return (
        <Fragment>
            <Top10Albums />
            <Top10SongsPlayed />
        </Fragment>
    )
}

function Top10Albums(){
    return (
        <div>
            Top 10 Best Selling Albums
        </div>
    )
}

function Top10SongsPlayed(){
    return (
        <div>
            Top 10 Most Played Songs All-Time
        </div>
    )
}