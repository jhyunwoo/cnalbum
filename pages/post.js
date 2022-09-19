import {useEffect} from "react";

export default function Post(){
    async function getImageUploadURL(){
        const {id, uploadURL} = await (await fetch(`/api/uploadImages`)).json()
        console.log(uploadURL)
    }
    useEffect(()=> getImageUploadURL, [])
    return (
        <div>
            <div>Post page</div>
        </div>
    )
}