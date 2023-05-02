export const ItemDisplay = (props) => {
    let item = props.group;
    return(
        <div>
            <div>
                name: {item.name}
            </div>
            <div>
                details: {item.about}
            </div>
            <div>
                location: {item.city}, {item.state}
            </div>
        </div>
    )
}
