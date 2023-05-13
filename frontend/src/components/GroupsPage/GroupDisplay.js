import { useDispatch,} from "react-redux";
import { useHistory } from "react-router-dom";
export const GroupDisplay = (props) => {
    const {group, events} = props;
    // console.log('fllaaaaaaaaaag',events)
    const dispatch = useDispatch();
    const history = useHistory();

    return(

            <div className='groupmain' onClick={() => history.push(`/groups/${group.id}`)}>
                {group.previewImage ? <div className="img">
                     <img  src={`${group.previewImage}`}/>
                    </div> :
                    <div className="img">No Image</div>}
                <div className="groupinfo">
                    <div className="groupname">
                    {group.name}
                    </div>
                    <div className="groupdescription">
                        {group.about}
                    </div>
                    <div className="grouplocation">
                        {group.city}, {group.state}
                    </div>
                    <div className="groupdetails">
                         {events.length} events
                        ·
                        {group.private ? ' private' : ' public'}
                    </div>
                </div>


            </div>
    )
}
