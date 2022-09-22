import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Post() {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  async function transferPost(data) {
    if (data.image && data.image.length > 0) {
      const { uploadURL } = await (await fetch(`/api/uploadImages`)).json();
      const form = new FormData();
      form.append("file", data.image[0]);
      const request = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();
      console.log(request.result.id);
      const img_url = request.result.id;
      const title = data.title;
      const authorEmail = session.user.email;
      const body = { img_url, authorEmail, title };
      await fetch(`/api/createPost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((e) => console.log(e));
    }
    await router.push("/");
  }

  return (
      <div className={"h-screen w-screen bg-orange-100"}>
        <div className={"bg-orange-200 flex justify-between h-12"}>
          <div className={"text-2xl m-2 my-auto font-semibold"}>CNAlbum Post Page</div>
          <Link href={"/"}>
            <button className={"bg-blue-400 p-1 m-2 my-auto rounded-lg text-white px-2"}>Main</button>
          </Link>
        </div>
        <div></div>
      </div>
    // <div>
    //   <div>Post page</div>
    //   <form onSubmit={handleSubmit(transferPost)}>
    //     <input
    //       {...register("image", {
    //         required: "이미지를 업로드하세요.",
    //       })}
    //       type={"file"}
    //       accept="image/*"
    //     />
    //     <input {...register("title")} type={"text"} placeholder={"title"} />
    //     <button type={"submit"}>Submit</button>
    //   </form>
    // </div>
  );
}
