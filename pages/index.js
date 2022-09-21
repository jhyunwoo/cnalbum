import { useSession, signIn, signOut } from "next-auth/react";
import prisma from "../libs/prisma";
import Link from "next/link";
import {useEffect, useState} from "react";

export const getServerSideProps = async () => {
  const posts1 = await prisma.post.findMany({
    include: {
      like: true,
      author: true,
    },
  });
  const posts = JSON.stringify(posts1);
  return { props: { posts } };
};

export default function Main({ posts }) {
  const { data: session } = useSession();
  const [countLike, setCountLike] = useState()
  //serverside에서 받은 데이터 json으로 변환
  const postData = JSON.parse(posts);

  // Post 삭제 function
  async function deletePost(postId) {
    await fetch(`/api/deletePost`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    });
  }

  async function addLike(userEmail, postId) {
    await fetch(`/api/addLike`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail, postId }),
    });
  }

  function checkLiked(){
    // if(arguments.include(session.user.email)){
    //   return "text-red-300"
    // } else {
    //   return ""
    // }
  }
  if (session) {
    return (
      <div className="bg-slate-100 w-screen">
        <div className="flex justify-between p-4">
          <div className="text-4xl font-bold">CNAlbum</div>
          <div className="flex">
            <div className="my-auto ">
              <div
                className="m-2 bg-blue-500 hover:bg-blue-600 p-2 rounded-lg text-white"
                onClick={() => {
                  if (session) {
                    signOut();
                  } else {
                    signIn();
                  }
                }}
              >
                {session ? "로그아웃" : "로그인"}
              </div>
            </div>
            <Link href={"/post"}>
              <div className="my-auto bg-blue-500 hover:bg-blue-600 p-1 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </div>
            </Link>
          </div>
        </div>
        {postData.map((data, key) => (
          <div key={key}>
            <div className="bg-white m-4 w-80 mx-auto rounded-xl flex flex-col">
              <div className="h-14 flex">
                <div className="my-auto mx-6 text-lg">{data.author.name}</div>
              </div>
              <div
                className="w-80 h-80 bg-gray-200 bg-cover bg-center"
                style={{
                  backgroundImage: `url(
                  https://imagedelivery.net/p4TahxOLmTmIsMIJ7PpE9A/${data.img_url}/public
                )`,
                }}
              ></div>
              <div className="">
                <div className="flex my-2 mx-3">
                  <div
                    className="my-auto"
                    onClick={() => addLike(session.user.email, data.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className={`w-7 h-7 ${checkLiked(data)}`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>
                  </div>
                  <div className="mx-2 my-auto">{data.like.length} likes</div>
                </div>
                <div className=" mx-4 mb-4">
                  <div>{data.title}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="w-full h-10"></div>
      </div>
    );
  }
  return (
    <div className="w-screen h-screen flex">
      <div className="mx-auto my-auto flex flex-col">
        <div className="text-6xl font-semibold">CNAlbum</div>
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
