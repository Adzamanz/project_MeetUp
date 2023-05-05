import './Greeting.css';
import { useHistory } from 'react-router-dom';
import SignupFormModal from '../SignupFormModal/index';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import { useSelector } from 'react-redux';
// import greetingImage1 from '../../../public/images/snip.png'
const Greeting = () => {
    const user = useSelector(state => state.session)
    let ooga = false
    const history = useHistory();
    const handleClick = (where) => history.push(where);
    console.log(user)
    return(
        <div id="greeting-page">
            <div id="a">
                    The people platform- Where interests become friendships.
                </div>
            <div id="b">
                <img src="../../../public/images/snip.png" alt='image'/>
            </div>
            <div id="c">
                How Meetup works
            </div>
            <div id="d">
                <div id="da" >
                <button onClick={() => handleClick('/groups')}>
                       See All Groups
                </button>

                </div>
                <div id="db">
                    <button onClick={() => handleClick('/events')}>
                        See All Events
                    </button>
                </div>
                <div id="dc" >
                    <button onClick={() => handleClick('/groups/new')}>
                        Start a new group
                    </button>
                </div>
            </div>
            <div id="e">
            <button  onClick={() => alert('No, it doesnt do anything')}>"Join Meetup"</button>
            </div>
        </div>
    )
}
export default Greeting;
