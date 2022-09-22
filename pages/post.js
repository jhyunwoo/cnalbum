import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import Head from "next/head";

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
  if (session) {
    return (
      <div className={"h-screen w-screen "}>
        <Head>
          <title>CNAlbum Post</title>
        </Head>
        <div className={"flex justify-between p-2"}>
          <img
            className="object-contain h-10 w-40 my-auto"
            src="CNAlbum_logo.png"
          />{" "}
          <Link href={"/"}>
            <button
              className={
                "bg-blue-400 p-1 m-2 my-auto rounded-lg text-white px-2"
              }
            >
              취소
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
              {...register("title", {
                maxLength: {
                  value: 80,
                  message: "제목의 최대 글자수는 80입니다.",
                },
              })}
              type={"text"}
              placeholder={"제목"}
              className="bg-blue-50 ring-2 ring-blue-400 p-2 m-2 rounded-lg mx-10 placeholder-blue-300"
            />
            {errors.title && (
              <span className=" text-white bg-red-500 p-1 rounded-lg my-2 px-2 mx-auto">
                {errors.title.message}
              </span>
            )}

            {!loading ? (
              <button
                type={"submit"}
                className="bg-blue-400 text-white p-2 m-2 rounded-xl mx-10"
              >
                <div className="flex mx-auto justify-center">
                  <div className="mx-1">사진 업로드</div>
                </div>
              </button>
            ) : (
              <div className="flex  justify-center bg-blue-400 text-white p-2 m-2 rounded-xl mx-10">
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
                <div className="mx-1">업로드 중...</div>
              </div>
            )}
          </form>
          <div className="mx-auto my-10">
            <img
              className="object-contain h-14 w-14 mx-auto flex"
              src="CNAlbum_icon.png"
            />
            <p className="text-lg font-semibold">CNAlbum</p>
            <p className="text-base">Beatus 2022</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-screen h-screen flex">
      <div className="mx-auto my-auto flex flex-col">
        {/* <div className="text-6xl font-semibold">CNAlbum</div> */}
        <img
          className="object-contain h-10 w-40 my-auto"
          src="CNAlbum_logo.png"
        />
        <div
          className="mx-auto my-4 bg-blue-500 text-white p-2 px-4 rounded-xl hover:bg-blue-600 transition"
          onClick={() => signIn()}
        >
          로그인
        </div>
      </div>
    </div>
  );
}
