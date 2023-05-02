export const ItemDisplay = (props) => {
    let item = props.event;
    return(
        <div>
            <div>
                name: {item.name}
            </div>
            <div>
                description: {item.description}
            </div>
        </div>
    )
}
