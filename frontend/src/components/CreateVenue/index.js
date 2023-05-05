import { useState } from "react"

export const CreateVenue = () => {
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');

    return (
        <div>
            <form>
                <div>
                    <label>
                        <input
                        type='decimal'
                        name='address'
                        onChange={(e) => setAddress(e.target.value)}
                        />
                    </label>
                </div>
            </form>
        </div>
    )
}
