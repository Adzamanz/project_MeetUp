import { NavLink, useHistory } from "react-router-dom";
export const GroupDisplay = (props) => {
    let group = props.group;
    const history = useHistory()
    return(

            <div onClick={() => history.push(`/groups/${group.id}`)}>
                <div>
                    name: {group.name}
                </div>
                <div>
                    details: {group.about}
                </div>
                <div>
                    location: {group.city}, {group.state}
                </div>
                <div>
                    private: {group.private ? 'true' : 'false'}
                </div>
            </div>
    )
}
