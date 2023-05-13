import { useEffect, useState} from "react"
import { useDispatch, useSelector } from "react-redux";
import { createGroupThunk } from "../../store/groups";
import { useHistory } from "react-router-dom";
import './CreateGroup.css'

export const CreateGroup = () => {
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [type, setType] = useState('')
    const [privates, setPrivates] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [group, setGroup] = useState({city, state, name, type, privates, imgUrl});
    const [errors, setErrors] = useState({});
    const user = useSelector(state => state.session.user)
    const dispatch = useDispatch()
    const history = useHistory();

    const verify = () => {
        let error = {};
        if(name.length >= 60 || name.length < 1) error.name = "Name must be 60 characters or less, but cannot be empty!";
        if(about.length < 50) error.about = "About must be 50 characters or more";
        if(!(type == "Online" || type == "In Person")) error.type = "Type must be 'Online' or 'In Person'";
        if(typeof privates != "boolean") error.privates = "You must select a value.";
        if(!city) error.city = "City is required";
        if(!state)error.state = "State is required";
        setErrors(error);
    }
    useEffect(() => {
        document.title = "Start a New Group"
        setGroup({city, state, name, about, type, privates, imgUrl});
    }, [city, state, name, about, type, privates, imgUrl])

    const submit = async (e) => {
        e.preventDefault();
        verify();
        if(!Object.values(errors).length){
            console.log("subitted", group)
            let resp = await dispatch(createGroupThunk(group));

            history.push(`/groups/${resp.id}`)
        }
    }


    if(user) return(
        <div id='CGmain'>
            <title>Start a New Group</title>
            <form onSubmit={submit} id='CGform'>
                <div id='CGlocationcaption'>
                    <div> <h4>set your group's location</h4></div>
                    <div>Meetup groups meet locally, in person, and online. We'll connect you with people in your area</div>
                </div>
                <div id='CGlocation'>
                    <div id='CGcity'>
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

                    <div id='CGstate'>

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
                <div id='CGnamecaption'>
                    <div>
                       <h4>What will your group's name be?</h4>
                    </div>
                    <div>
                        Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.
                    </div>
                </div>

                <div id='CGname'>

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
                <div id='CGaboutcaption'>
                    <div>
                        <h4>Describe the purpose of your group.</h4>
                    </div>
                    <div>
                    People will see this when we promote your group, but you'll be able to add to it later, too. 1. What's the purpose of the group? 2. Who should join? 3. What will you do at your events?
                    </div>
                </div>
                <div id='CGabout'>

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
                <div id='CGqualifycaption'>

                </div>
                <div id='CGqualify'>
                    <div id='CGtype'>
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
                    <div id='CGprivate'>
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

                <div id='CGimage'>
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
                <div id='CGsubmit'>
                    <button type="submit">Create Group</button>
                </div>
            </form>
        </div>
    )
    else return(
        <div>
            You must be Logged in to create a group.
        </div>
    )
}
