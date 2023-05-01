import './Greeting.css';
import { useHistory } from 'react-router-dom';
const Greeting = () => {
    const history = useHistory();
    const handleClick = (where) => history.replace(where);
    return(
        <div id="greeting-page">
            <div id="a">
                    The people platform- Where interests become friendships.
                </div>
            <div id="b">
                <img src="../../images/snip.PNG" alt='image'/>
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
                "Join Meetup" button here
            </div>
        </div>
    )
}
export default Greeting;
