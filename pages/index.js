import { useSession, signIn, signOut } from "next-auth/react";
import prisma from "../libs/prisma";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

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
  const router = useRouter();
  //serverside에서 받은 데이터 json으로 변환
  const postData = JSON.parse(posts).reverse();

  const [deleting, setDeleting] = useState(-1);

  // Post 삭제 function
  async function deletePost(postId, userEmail) {
    setDeleting(postId);
    await fetch(`/api/deletePost`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, userEmail }),
    });
    //await router.replace("/");
    setDeleting(-1);
  }

  async function addLike(userEmail, postId, key) {
    await fetch(`/api/addLike`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail, postId }),
    });
    postData[key].like.push({ likedPerson: userEmail });
  }

  function checkLiked(key) {
    let step;
    let likedArray = [];
    // 우리가 데이터 베이스에서 가져온 postData에서 like 한 사람을 찾기 위해 각 게시물의 번호를 가져오고 그 다음에 각 게시물의 postdata에 있는 좋아요 한사람의 이메일을 가져와서 likedArray에 저장, 그 다름에 그 array에 현재 로그된 사용자가 있으면 true를 리턴하고 아니면 false를 리턴
    for (step = 0; step < postData[key].like.length; step++) {
      likedArray.push(postData[key].like[step].likedPerson);
    }
    if (likedArray.includes(session.user.email)) {
      return true;
    } else {
      return false;
    }
  }

  if (session) {
    return (
      <div className="bg-slate-50 w-screen">
        <div className="p-2 fixed top-0 left-0 w-full bg-slate-50 rounded-br-lg rounded-bl-lg">
          <div className={"flex justify-between w-full"}>
            <div
              className="text-4xl font-bold my-auto"
              onClick={() => console.log(postData[0].like)}
            >
              CNAlbum
            </div>
            <div className="flex">
              <div className="my-auto ">
                <div
                  className="m-2 bg-blue-500 hover:bg-blue-600 p-1 px-2 rounded-lg text-white"
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
                    className="w-6 h-6 text-white"
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
        </div>
        <div className={"h-20"}></div>
        {postData.map((data, key) => (
          <div key={key}>
            <div className="bg-white m-4 w-80 mx-auto rounded-xl flex flex-col">
              <div className="h-14 flex justify-between">
                <div
                  className="my-auto mx-6 text-lg"
                  onClick={() => checkLiked(key)}
                >
                  {data.author.name}
                </div>

                {session.user.email === data.author.email ? (
                  !(deleting === data.id) ? (
                    <button
                      className={
                        "my-auto mr-4 bg-blue-400 text-white p-1 rounded-lg hover:bg-blue-500"
                      }
                      onClick={() => deletePost(data.id, session.user.email)}
                    >
                      삭제
                    </button>
                  ) : (
                    <div className="my-auto mr-4 bg-blue-400 text-white p-1 rounded-lg hover:bg-blue-500">
                      <div className="mx-1 text-base">삭제 중...</div>
                    </div>
                  )
                ) : (
                  ""
                )}
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
                    onClick={() => addLike(session.user.email, data.id, key)}
                  >
                    {checkLiked(key) ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-7 h-7 text-red-500"
                        >
                          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className={`w-7 h-7 `}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                          />
                        </svg>
                      </>
                    )}
                  </div>
                  <div className="mx-2 my-auto">{data.like.length} Like(s)</div>
                </div>
                <div className=" mx-4 mb-4">
                  <div className="break-words">{data.title}</div>
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
