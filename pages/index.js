import { useSession, signIn, signOut } from "next-auth/react";
import {useEffect, useState} from "react";
import prisma from "../libs/prisma";
import {useRouter} from "next/router";


export const getServerSideProps = async () => {
  const posts1 = await prisma.post.findMany()
  const posts = JSON.stringify(posts1)
  return { props: { posts } }
}

export default function Main({posts}) {
  const [img_url, setImg_url] = useState("");
  const [postData, setPostData] = useState()
  const router = useRouter()
  const submitData = async (e) => {
    e.preventDefault();
    try {
      const authorEmail = session.user.email
      const body = { img_url, authorEmail };
      await fetch(`/api/createPost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setImg_url("")
      await router.replace(router.asPath)
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(()=> {
    setPostData(JSON.parse(posts))
  }, [posts])
  const { data: session } = useSession();
  if (session) {
    return (
      <div>
        <div>{session.user.name}님 안녕하세요</div>
        <div onClick={() => signOut()}>로그아웃</div>
        <form onSubmit={submitData}>
          <h1>Create Draft</h1>
          <input
            autoFocus
            onChange={(e) => setImg_url(e.target.value)}
            placeholder="img_url"
            type="text"
            value={img_url}
          />
          <input
            type="submit"
            value="Create"
          />
        </form>
        <div>
          <ul>
            {postData.map((post) => (
              <li key={post.id}>{post.img_url}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div>로그인 필요</div>
      <div onClick={() => signIn()}>로그인 하러가기</div>
    </div>
  );
}
