import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import OpenModalMenuItem from '../../components/OpenModalButton/index';
import LoginFormModal from "../LoginFormModal";

export const CreateGroup = () => {
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [type, setType] = useState('In Person')
    const [privates, setPrivates] = useState(false);
    const [imgUrl, setImgUrl] = useState('');
    const [group, setGroup] = useState({city, state, name, type, privates, imgUrl});
    const [errors, setErrors] = useState({});
    const user = useSelector(state => state.session.user)

    const verify = () => {
        if(name.length >= 60 || name.length < 1) setErrors({...errors, name: "Name must be 60 characters or less, but cannot be empty!"});
        if(about.length < 50) setErrors({...errors, about: "About must be 50 characters or more"});
        if(!(type == "Online" || type == "In person")) setErrors({...errors, type: "Type must be 'Online' or 'In person'"});
        if(typeof privates != "boolean") setErrors({...errors, privates: "Private must be a boolean"});
        if(!city)setErrors({...errors, city: "City is required"});
        if(!state)setErrors({...errors, state: "State is required"});
    }
    useEffect(() => {
        setGroup({city, state, name, type, privates, imgUrl});
    }, [city, state, name, type, privates, imgUrl])
    const onSubmit = (e) => {
        e.preventDefault();
        if(!Object.values(errors)){

        }
    }

    if(user) return(
        <div>
            <form onSubmit={onSubmit}>
                <div>
                    <label>
                        City
                        <input
                        type="text"
                        name="city"
                        onChange={e => setCity(e.target.value)}
                        value={city}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        State
                        <input
                        type="text"
                        name="state"
                        onChange={e => setState(e.target.value)}
                        value={state}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Name
                        <input
                        type="text"
                        name="name"
                        onChange={e => setName(e.target.value)}
                        value={name}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        about
                        <input
                        type="textbox"
                        name="about"
                        onChange={e => setAbout(e.target.value)}
                        value={about}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        In Person or Online
                        <select onChange={e => setType(e.target.value)}
                        value={type}
                        >
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
                </div>
                <div>
                    <label>
                        Private or Public?
                        <select onChange={e => setPrivates(e.target.value)}
                        value={privates}
                        >
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
            </form>
        </div>
    )
    else return(
        <div>
            You must be Logged in to create a group.
        </div>
    )
}
