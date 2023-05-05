import { useHistory } from "react-router-dom";


export const EventDisplay = (props) => {
    let event = props.event;
    const history = useHistory();
    const clickHandle = (e) => {
        //e.preventDefault()
        history.push(`/events/${event.id}`)
    }
    return(
        <div onClick={clickHandle}>
            <div>
                name: {event.name}
            </div>
            <div>
                description: {event.description}
            </div>
        </div>
    )
}
