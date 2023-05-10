import { useHistory } from "react-router-dom";
import './EventDisplay.css'


export const EventDisplay = (props) => {
    let event = props.event;
    const history = useHistory();
    const img = event.EventImages[0]
    if(img) console.log(img.url)

    const getEventImage = async () => {
        //TODO add image grab from getEventById
    }


    const clickHandle = (e) => {
        //e.preventDefault()
        history.push(`/events/${event.id}`)
    }
    return(
        <div onClick={clickHandle} className='main'>
            <div id='image'>
                {img && <img src={img.url}/>}
            </div>
            <div className="info">
                <div id='start'>
                    {event.startDate}
                </div>
                <div id='name'>
                    name: {event.name}
                </div>
                <div id='desc'>
                    description: {event.description}
                </div>
                <div id='location'>
                    Platform 9 & 3/4
                </div>
            </div>
        </div>
    )
}
