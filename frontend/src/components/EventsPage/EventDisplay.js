import { useHistory } from "react-router-dom";
import './EventDisplay.css'


export const EventDisplay = (props) => {
    let event = props.event;
    const history = useHistory();
    console.log('event', event);
    console.log('event images', event?.EventImages)
    const img = event?.EventImages? event?.EventImages[0] : ''

    const clickHandle = (e) => {
        //e.preventDefault()
        history.push(`/events/${event.id}`)
    }
    return(
        <div onClick={clickHandle} className='mainevnt'>
            <div className='image'>
                {img ? <img src={img?.url}/> : <div>No Image</div>}
            </div>
            <div className="info">
                <div className='date'>
                    {event?.startDate?.split('T').join('·').slice(0, -8)}
                </div>
                <div className='name'>
                    {event.name}
                </div>

                <div className='location'>
                    Platform 9 & 3/4
                </div>
            </div>
            <div className='desc'>
                {event.description}
            </div>
        </div>
    )
}
