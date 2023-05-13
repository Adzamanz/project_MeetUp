import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import './DeleteItemModal.css'
import { getEventsThunk } from "../../store/events";
import { getGroupsThunk } from "../../store/groups";

export const DeleteItemModal = (props) => {
        const {action, target, landing} = props
        const dispatch = useDispatch();
        const { closeModal } = useModal();
        const history = useHistory()

        const handleSubmit = async () => {
            dispatch(action(target));
            await dispatch(getEventsThunk());
            await dispatch(getGroupsThunk());
            history.push(landing);
            closeModal();
        }
        return(
            <div className="deletemain">
                <h3>Are you sure you want to delete?</h3>
                <div>
                    <button id='yesbutton' onClick={() => handleSubmit()}>
                        YES
                    </button>
                    <button id='nobutton' onClick={() => closeModal()}>
                        NO
                    </button>
                </div>

            </div>
        )
}
