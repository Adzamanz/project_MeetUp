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
                <img src="https://imgur.com/URwNK0d.png" alt='image'/>
            </div>
            <div id="c">
                <div id='ca'>How Meetup works</div>
                <div id='cb'> ya d ah yada yahadha adjahyahdahda ahdbs;dlsf faadfA </div>
            </div>
            <div id="d">
                <div id="da" >
                <div onClick={() => handleClick('/groups')}>
                       See All Groups
                </div>

                </div>
                <div id="db">
                    <div onClick={() => handleClick('/events')}>
                        See All Events
                    </div>
                </div>
                <div id="dc" >
                    <div onClick={() => handleClick('/groups/new')}>
                        Start a new group
                    </div>
                </div>
            </div>
            <div id="e">
            <button  onClick={() => alert('No, it doesnt do anything')}>"Join Meetup"</button>
            </div>
        </div>
    )
}
export default Greeting;
