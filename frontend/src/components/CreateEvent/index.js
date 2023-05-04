//

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { createEventThunk, } from "../../store/events";
import { getGroups, getGroupsThunk } from "../../store/groups";
import { getGroupById } from "../../store/groups";

export const CreateEvent = () => {
    const {id} = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getGroupsThunk())
        //console.log('deeets',group)
    }, [id, dispatch])
    const group = useSelector(state => state.groups[id]) || {};
    const user = useSelector(state => state.session.user);
    const history = useHistory();

    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [privates, setPrivates] = useState('');
    const [price, setPrice] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [description, setDescription] = useState('');
    const [event, setEvent] = useState({name, type, privates, price, description, startDate, endDate})
    const [errors, setErrors] = useState({});

    const verify = () => {
        let error = {}
        const currDate = new Date();
        // if(!venue) error.venue = "Venue does not exist";
        if(name.length < 5)error.name = "Name must be at least 5 characters";
        if(!(type == "Online" || type == "In Person")) error.type = "Type must be 'Online' or 'In person'";
        // if(capacity < 0)error.capacity = "Capacity must be a positive integer";
        if(price < 0)error.price = "Price is invalid";
        if(!description) error.description = "Description is required";
        if(!startDate || startDate < currDate) error.startDate = "Start date must be in the future";
        if(!endDate || endDate < startDate) error.endDate = "End date is less than start date";
        setErrors(error);
    }
    useEffect(() => {
        verify();
        setEvent({name, type, privates, price, description, startDate, endDate});
        console.log(errors)
    }, [name, type, privates, price, description, startDate, endDate, dispatch])


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(errors)
        if(!Object.values(errors)){
        const resp = dispatch(createEventThunk(event))
        history.push(`/events/${resp.id}`)
        }
    }
    // dispatch(getGroupsThunk());
    // dispatch(getGroupById(id));

    return group.organizerId == user.id ? <div>
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Name
                    <input
                    type='text'
                    name='name'
                    onChange={e => setName(e.target.value)}
                    value={name}
                    />
                </label>
                {errors.name && <div> {errors.name} </div>}
            </div>
            <div>
            <label>
                In Person or Online
                <select onChange={e => setType(e.target.value)}
                value={type}
                >
                    <option
                    key={'NA'}
                    value={''}
                    >
                    choose a value
                    </option>
                    <option
                    key={'IP'}
                    value={'In Person'}
                    >
                    In Person
                    </option>
                    <option
                    key={'OL'}
                    value={'Online'}
                    >
                    Online
                    </option>
                </select>
            </label>
            {errors.type && <div> {errors.type} </div>}

            </div>
            <div>
                <label> price
                    <input
                    type='number'
                    name='price'
                    onChange={e => setPrice(e.target.value)}
                    value={price}
                    />
                </label>
                {errors.price && <div> {errors.price} </div>}

            </div>
            <div>
                <label>
                    Private or Public?
                    <select onChange={e => setPrivates(e.target.value === 'true')}
                    value={privates}
                    >
                        <option
                        key={'NA'}
                        value={''}
                        >
                        choose a value
                        </option>
                        <option
                        key={'private'}
                        value={true}
                        >
                        Private
                        </option>
                        <option
                        key={'public'}
                        value={false}
                        >
                        Public
                        </option>
                    </select>
                </label>
                {errors.privates && <div> {errors.privates} </div>}
            </div>
            <div>
                <label>
                    Start Date
                    <input
                    type='date'
                    name='startDate'
                    onChange={e => setStartDate(e.target.value)}
                    value={startDate}
                    />
                </label>
                {errors.startDate && <div> {errors.startDate} </div>}

            </div>
            <div>
                <label>
                    End Date
                    <input
                    type='date'
                    name='endDate'
                    onChange={e => setEndDate(e.target.value)}
                    value={endDate}
                    />
                </label>
                {errors.endDate && <div> {errors.endDate} </div>}
            </div>

            <div>
                <label>
                    image URL
                    <input
                    type="text"
                    name="URL"
                    onChange={e => setImgUrl(e.target.value)}
                    value={imgUrl}
                    />
                </label>
            </div>
            <div>
                <label>
                    About
                    <textarea
                    name="about"
                    onChange={e => setDescription(e.target.value)}
                    value={description}
                    ></textarea>
                </label>
                {errors.about && <div> {errors.about} </div>}
            </div>
            <div><button type='submit'>submit</button></div>
        </form>
    </div> : <div>You are not the organizer for this group</div>
    // if(group.organizerId == user.id){
    //     return(
    //     <div>
    //         <form onSubmit={handleSubmit}>
    //             <div>
    //                 <label>
    //                     Name
    //                     <input
    //                     type='text'
    //                     name='name'
    //                     onChange={e => setName(e.target.value)}
    //                     value={name}
    //                     />
    //                 </label>
    //                 {errors.name && <div> {errors.name} </div>}
    //             </div>
    //             <div>
    //             <label>
    //                 In Person or Online
    //                 <select onChange={e => setType(e.target.value)}
    //                 value={type}
    //                 >
    //                     <option
    //                     key={'NA'}
    //                     value={''}
    //                     >
    //                     choose a value
    //                     </option>
    //                     <option
    //                     key={'IP'}
    //                     value={'In Person'}
    //                     >
    //                     In Person
    //                     </option>
    //                     <option
    //                     key={'OL'}
    //                     value={'Online'}
    //                     >
    //                     Online
    //                     </option>
    //                 </select>
    //             </label>
    //             {errors.type && <div> {errors.type} </div>}

    //             </div>
    //             <div>
    //                 <label> price
    //                     <input
    //                     type='number'
    //                     name='price'
    //                     onChange={e => setPrice(e.target.value)}
    //                     value={price}
    //                     />
    //                 </label>
    //                 {errors.price && <div> {errors.price} </div>}

    //             </div>
    //             <div>
    //                 <label>
    //                     Private or Public?
    //                     <select onChange={e => setPrivates(e.target.value === 'true')}
    //                     value={privates}
    //                     >
    //                         <option
    //                         key={'NA'}
    //                         value={''}
    //                         >
    //                         choose a value
    //                         </option>
    //                         <option
    //                         key={'private'}
    //                         value={true}
    //                         >
    //                         Private
    //                         </option>
    //                         <option
    //                         key={'public'}
    //                         value={false}
    //                         >
    //                         Public
    //                         </option>
    //                     </select>
    //                 </label>
    //                 {errors.privates && <div> {errors.privates} </div>}
    //             </div>
    //             <div>
    //                 <label>
    //                     Start Date
    //                     <input
    //                     type='date'
    //                     name='startDate'
    //                     onChange={e => setStartDate(e.target.value)}
    //                     value={startDate}
    //                     />
    //                 </label>
    //                 {errors.startDate && <div> {errors.startDate} </div>}

    //             </div>
    //             <div>
    //                 <label>
    //                     End Date
    //                     <input
    //                     type='date'
    //                     name='endDate'
    //                     onChange={e => setEndDate(e.target.value)}
    //                     value={endDate}
    //                     />
    //                 </label>
    //                 {errors.endDate && <div> {errors.endDate} </div>}
    //             </div>

    //             <div>
    //                 <label>
    //                     image URL
    //                     <input
    //                     type="text"
    //                     name="URL"
    //                     onChange={e => setImgUrl(e.target.value)}
    //                     value={imgUrl}
    //                     />
    //                 </label>
    //             </div>
    //             <div>
    //                 <label>
    //                     About
    //                     <textarea
    //                     name="about"
    //                     onChange={e => setDescription(e.target.value)}
    //                     value={description}
    //                     ></textarea>
    //                 </label>
    //                 {errors.about && <div> {errors.about} </div>}
    //             </div>
    //             <div><button type='submit'>submit</button></div>
    //         </form>
    //     </div>
    //     )}
    // else {
    //     return(
    //     <div>
    //     You are not the organizer for this group
    //     </div>
    // )}
}
