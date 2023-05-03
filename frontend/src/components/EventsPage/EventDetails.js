import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEventsThunk } from "../../store/events";
import { useParams } from "react-router-dom";

export const EventDetails = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const event = useSelector(state => state.events[id]);

    useEffect(() => {
        dispatch(getEventsThunk());

    }, [id, dispatch]);
    const MiniEventDetails = () => {
        return(
            <div>
                <div>
                    name: {event && event.name}
                </div>
                <div>
                    description: {event && event.description}
                </div>
            </div>

        )
    }
    return(
        <div>
            <h1> event details page </h1>
            <div>
                <MiniEventDetails />
            </div>


        </div>


    )
}
