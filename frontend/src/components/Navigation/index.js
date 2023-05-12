import React from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const history = useHistory();

  return (
    <nav className='navbar'>
      <div className='home'>
        <div onClick={() => history.push('/')}> Meetup </div>
      </div>
      <div id='makegroup'>
        {sessionUser && <Link to='/groups/new'>Start a new Group</Link>}
        </div>
      {isLoaded && (
        <div className='profile'>

          <ProfileButton user={sessionUser} />
        </div>
      )}
    </nav>
  );
}

export default Navigation;
