import { csrfFetch } from "../../store/csrf";
export const createGroupImage = async (group, url) => {
    let imgResp = await csrfFetch(`/api/groups/${group.id}/images`,{
        method:'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: {
        groupId: group.id,
        url: url,
        preview: true
        }
    }).then(res => res.json());

    return imgResp;
}

export const getGroupImages = async (id) => {
    let imgResp = await csrfFetch(`/api/groups/${id}`);
    if(imgResp.ok){
        let details = await imgResp.json();
        return details.GroupImages;
    }
}
