import { useEffect, useState} from "react"
import { useDispatch, useSelector } from "react-redux";
import { updateGroupThunk, getGroupById } from "../../store/groups";
import { useHistory, useParams } from "react-router-dom";
import { GroupDisplay } from "./GroupDisplay";
import './UpdateGroup.css'

export const EditGroup = () => {
    const dispatch = useDispatch();
    const {id} = useParams();
    const oldGroup = useSelector(state => state.groups[id]);
    document.title = `Update ${oldGroup?.name}`;
    const [city, setCity] = useState(oldGroup?.city);
    const [state, setState] = useState(oldGroup?.state);
    const [name, setName] = useState(oldGroup?.name);
    const [about, setAbout] = useState(oldGroup?.about);
    const [type, setType] = useState(oldGroup?.type);
    const [privates, setPrivates] = useState(oldGroup?.private === 1);
    const [imgUrl, setImgUrl] = useState(oldGroup?.previewImage);
    const [group, setGroup] = useState({city, state, name, type, privates, imgUrl});
    const [errors, setErrors] = useState({});
    const user = useSelector(state => state.session.user)

    const history = useHistory();

    const verify = () => {
        let error = {};
        if(name?.length >= 60 || name?.length < 1) error.name = "Name must be 60 characters or less, but cannot be empty!";
        if(about?.length < 50) error.about = "About must be 50 characters or more";
        if(!(type == "Online" || type == "In Person")) error.type = "Type must be 'Online' or 'In Person'";
        if(typeof privates != "boolean") error.privates = "Private must be a boolean";
        if(!city) error.city = "City is required";
        if(!state)error.state = "State is required";
        setErrors(error);
    }
    useEffect(() => {
        dispatch(getGroupById(id))
        verify()
        setGroup({city, state, name, about, type, privates, imgUrl});
    }, [city, state, name, about, type, privates, imgUrl, dispatch])

    const submit = async (e) => {
        e.preventDefault();
        console.log(errors)
        if(!Object.values(errors).length){
            console.log("subitted", group)
            let resp = await dispatch(updateGroupThunk(group, id));

            history.push(`/groups/${id}`)
        }
    }
    if(oldGroup && user.id !== oldGroup.organizerId){
        history.push(`/`)
    }


    if(oldGroup && user.id === oldGroup.organizerId) return(
        <div id='UGmain'>
            <title>Start a New Group</title>
            <form onSubmit={submit} id='UGform'>

                <div id='UGlocation'>
                    <div id='UGlocationcaption'>
                        <h4>set your group's location</h4>
                    </div>
                    <div id='UGcity'>
                    <label>
                        <input
                        placeholder="City"
                        type="text"
                        name="city"
                        onChange={e => setCity(e.target.value)}
                        value={city}
                        />
                    </label>
                        {errors.city && <div className="errors errorcity"> {errors.city} </div>}
                    </div>

                    <div id='UGstate'>

                    <label>
                        <input
                        placeholder="state"
                        type="text"
                        name="state"
                        onChange={e => setState(e.target.value)}
                        value={state}
                        />
                    </label>
                        {errors.state && <div className="errors errorstate"> {errors.state} </div>}
                    </div>
                </div>


                <div id='UGname'>
                    <div id='UGnamecaption'>
                        <div>
                        <h4>What will your group's name be?</h4>
                        </div>
                    </div>
                    <label>
                        <input
                        placeholder="What is your group name?"
                        type="text"
                        name="name"
                        onChange={e => setName(e.target.value)}
                        value={name}
                        />
                    </label>
                        {errors.name && <div className="errors"> {errors.name} </div>}
                </div>

                <div id='UGabout'>
                    <div id='UGaboutcaption'>
                        <div>
                            <h4>Describe the purpose of your group.</h4>
                        </div>
                    </div>
                    <label>
                        <textarea
                        placeholder="Please write at least 30 characters."
                        name="about"
                        onChange={e => setAbout(e.target.value)}
                        value={about}
                        ></textarea>
                    </label>
                        {errors.about && <div className="errors"> {errors.about} </div>}
                </div>
                <div id='UGqualifycaption'>

                </div>
                <div id='UGqualify'>
                    <div id='UGtype'>
                        <div>
                            Is this an in-person or online group
                        </div>
                        <label>

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
                            {errors.type && <div className="errors"> {errors.type} </div>}
                    </div>
                    <div id='UGprivate'>
                        <div>
                        Is this group private or public?
                        </div>
                        <label>

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
                            {errors.privates && <div className="errors"> {errors.privates} </div>}
                    </div>
                </div>

                <div id='UGimage'>
                    <div>
                        Please add an image URL for your group below:
                    </div>
                    <label>

                        <input
                        placeholder="Image URL"
                        type="text"
                        name="URL"
                        onChange={e => setImgUrl(e.target.value)}
                        value={imgUrl}
                        />
                    </label>
                </div>
                <div id='UGsubmit'>
                    <button type="submit">Update Group</button>
                </div>
            </form>
        </div>
    //     <div>
    //         <form onSubmit={submit}>
    //             <div>
    //                 {errors.city && <div> {errors.city} </div>}
    //                 <label>
    //                     City
    //                     <input
    //                     type="text"
    //                     name="city"
    //                     onChange={e => setCity(e.target.value)}
    //                     value={city}
    //                     />
    //                 </label>
    //             </div>
    //             <div>
    //                 {errors.state && <div> {errors.state} </div>}
    //                 <label>
    //                     State
    //                     <input
    //                     type="text"
    //                     name="state"
    //                     onChange={e => setState(e.target.value)}
    //                     value={state}
    //                     />
    //                 </label>
    //             </div>
    //             <div>
    //                 {errors.name && <div> {errors.name} </div>}
    //                 <label>
    //                     Name
    //                     <input
    //                     type="text"
    //                     name="name"
    //                     onChange={e => setName(e.target.value)}
    //                     value={name}
    //                     />
    //                 </label>
    //             </div>
    //             <div>
    //                 {errors.about && <div> {errors.about} </div>}
    //                 <label>
    //                     About
    //                     <textarea
    //                     name="about"
    //                     onChange={e => setAbout(e.target.value)}
    //                     value={about}
    //                     ></textarea>
    //                 </label>
    //             </div>
    //             <div>
    //                 {errors.type && <div> {errors.type} </div>}
    //                 <label>
    //                     In Person or Online
    //                     <select onChange={e => setType(e.target.value)}
    //                     value={type}
    //                     >
    //                         <option
    //                         key={'NA'}
    //                         value={''}
    //                         >
    //                         choose a value
    //                         </option>
    //                         <option
    //                         key={'IP'}
    //                         value={'In Person'}
    //                         >
    //                         In Person
    //                         </option>
    //                         <option
    //                         key={'OL'}
    //                         value={'Online'}
    //                         >
    //                         Online
    //                         </option>
    //                     </select>
    //                 </label>
    //             </div>
    //             <div>
    //                 {errors.privates && <div> {errors.privates} </div>}
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
    //                 <input type="submit"/>
    //             </div>

    //         </form>
    //         <button onClick={() => console.log(group)}> log </button>
    //     </div>
    )
    else return(
        <div>
            You must be the group organizer to edit a group.
        </div>
    )
}
