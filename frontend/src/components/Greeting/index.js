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
                <div id="da" onClick={() => handleClick('/groups')}>
                        <img id='da-icon' src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Person_icon_BLACK-01.svg/1924px-Person_icon_BLACK-01.svg.png' />
                       See All Groups
                </div>
                <div id="db" onClick={() => handleClick('/events')}>
                    <img id='db-icon' src='https://cdn-icons-png.flaticon.com/512/104/104542.png' />
                    See All Events
                </div>
                <div id="dc" onClick={() => handleClick('/groups/new')}>
                <img id='dc-icon' src='https://icons-for-free.com/iconfiles/png/512/new+year+party+price+star+icon-1320185815358079337.png' />
                    Start a new group
                </div>
            </div>
            <div id="e">
            <button  onClick={() => alert('No, it doesnt do anything')}>"Join Meetup"</button>
            </div>
        </div>
    )
}
export default Greeting;
