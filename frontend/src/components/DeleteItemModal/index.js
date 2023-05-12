import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";

export const DeleteItemModal = (props) => {
        const {action, target, landing} = props
        const dispatch = useDispatch();
        const { closeModal } = useModal();
        const history = useHistory()

        const handleSubmit = () => {
            dispatch(action(target));
            history.push(landing);
            closeModal();
        }
        return(
            <div>
                <h3>Are you sure you want to delete?</h3>
                <button onClick={() => handleSubmit()}>
                    YES
                </button>
                <button onClick={() => closeModal()}>
                    NO
                </button>
            </div>
        )
}
