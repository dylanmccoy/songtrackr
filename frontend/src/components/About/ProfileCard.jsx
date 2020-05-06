import React from 'react';

const ProfileCard = ({ imgUrl, name, username, commits, issues, bio, majorAndTrack, responsibilities, numTests }) => (
    <article className='mw6 center br3 pa3 pa4-ns mv3 ba' style={{ backgroundColor: '#282828', borderColor: '#131313' }}>
        <div className='tc'>
            <img src={imgUrl} alt='Profile' className='br-100 h3 w3 dib' title='Profile' />
            <h1 className='f4'>
                {name} (
                <a className='click-link' href={`https://github.com/${username}`} target='_blank' rel='noopener noreferrer'>
                    @{username}
                </a>
                )
            </h1>
            <hr className='mw3 bb bw1' style={{ color: '#b3b3b3' }} />
        </div>
        <p className='lh-copy measure center f6'>
            Commits: {commits}
        </p>
        <p className='lh-copy measure center f6'>
            Issues: {issues}
        </p>
        <p className='lh-copy measure center f6'>
            Unit Tests: {numTests}
        </p>
        <p className='tl'>
            <b>Bio: </b>{bio}
        </p>
        <p className='tl'>
            <b>Major/Track: </b>{majorAndTrack}
        </p>
        <p className='tl'>
            <b>Responsibilities: </b>{responsibilities}
        </p>
    </article>
);

export default ProfileCard;
