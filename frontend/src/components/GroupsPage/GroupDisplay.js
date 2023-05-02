import { NavLink } from "react-router-dom";
export const GroupDisplay = (props) => {
    let group = props.group;
    return(
        <NavLink   className='list-item' key={group.id} to={`/groups/${group.id}`}>
            <div>
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
        </NavLink>
    )
}
