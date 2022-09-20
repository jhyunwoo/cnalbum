import { useForm } from "react-hook-form";
import {useSession} from "next-auth/react";

export default function Post(){
    const { data: session } = useSession();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    async function transferPost(data){
        if (data.image && data.image.length > 0) {
            const {uploadURL} = await (await fetch(`/api/uploadImages`)).json()
            const form = new FormData();
            form.append("file", data.image[0]);
            const request = await (await fetch(uploadURL, {
                method: "POST",
                body: form,
            })).json()
            console.log(request.result.id)
            const img_url = request.result.id
            const title = data.title
            const authorEmail = session.user.email
            const body = {img_url, authorEmail, title };
            await fetch(`/api/createPost`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            }).then((e)=>console.log(e))
        }
        console.log(data)
    }

    return (
        <div>
            <div>Post page</div>
            <form onSubmit={handleSubmit(transferPost)}>
                <input {...register("image", {
                    required: "이미지를 업로드하세요.",
                })} type={"file"} accept="image/*" />
                <input {...register("title")} type={"text"} placeholder={"title"}/>
                <button type={"submit"}>Submit</button>
            </form>


            {/*<ul>*/}
            {/*    {tags.map((data, key) => (*/}
            {/*        <li key={key}>{data}</li>*/}
            {/*    ))}*/}
            {/*</ul>*/}
        </div>
    )
}