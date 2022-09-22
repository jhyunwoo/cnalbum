import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";

export default function Post() {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function transferPost(data) {
    setLoading(true);
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
    setLoading(false);
    await router.push("/");
  }

  return (
    <div className={"h-screen w-screen "}>
      <div className={" flex justify-between"}>
        <div className={"text-2xl m-2 font-semibold my-3"}>
          CNAlbum Post Page
        </div>
        <Link href={"/"}>
          <button
            className={"bg-blue-400 p-1 m-2 my-auto rounded-lg text-white px-2"}
          >
            Main
          </button>
        </Link>
      </div>
      <div className="h-5/6  flex flex-col">
        <form
          onSubmit={handleSubmit(transferPost)}
          className="my-auto  m-2 flex flex-col"
        >
          <input
            {...register("image", {
              required: {
                value: true,
                message: "사진을 업로드 해야합니다.",
              },
            })}
            type={"file"}
            accept="image/*"
            className="file:bg-blue-400 file:text-white file:border-transparent file:p-1 file:px-2 file:rounded-xl  text-black mx-auto rounded-lg placeholder-blue-400"
          />
          {errors.image && (
            <span className=" text-white bg-red-500 p-1 rounded-lg my-2 px-2 mx-auto">
              {errors.image.message}
            </span>
          )}
          <input
            {...register("title")}
            type={"text"}
            placeholder={"제목"}
            className="bg-blue-50 ring-2 ring-blue-400 p-2 m-2 rounded-lg mx-10 placeholder-blue-300"
          />
          <button
            type={"submit"}
            className="bg-blue-400 text-white p-2 m-2 rounded-xl mx-10"
          >
            {loading ? (
              <div className="flex mx-auto justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 animate-spin mx-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                <div className="mx-1">Loading...</div>
              </div>
            ) : (
              <div>Post</div>
            )}
          </button>
        </form>
      </div>
    </div>
    // <div>

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
