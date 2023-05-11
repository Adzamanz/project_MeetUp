import { useHistory } from "react-router-dom";
import './EventDisplay.css'


export const EventDisplay = (props) => {
    let event = props.event;
    const history = useHistory();
    const img = event.EventImages[0]

    const clickHandle = (e) => {
        //e.preventDefault()
        history.push(`/events/${event.id}`)
    }
    return(
        <div onClick={clickHandle} className='mainevnt'>
            <div className='image'>
                {img ? <img src={img.url}/> : <div>No Image</div>}
            </div>
            <div className="info">
                <div className='date'>
                    {event.startDate}
                </div>
                <div className='name'>
                    {event.name}
                </div>

                <div className='location'>
                    Platform 9 & 3/4
                </div>
            </div>
            <div className='desc'>
                description: {event.description}
            </div>
        </div>
    )
}
