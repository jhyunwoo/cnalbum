import { useSession, signIn, signOut } from "next-auth/react";

import prisma from "../libs/prisma";
import {useRouter} from "next/router";
import Link from "next/link";


export const getServerSideProps = async () => {
  const posts1 = await prisma.post.findMany({
      include: {
          like: true,
      }
    }
  )
  const posts = JSON.stringify(posts1)
  return { props: { posts } }
}

export default function Main({posts}) {
  const { data: session } = useSession();
  const postData = JSON.parse(posts)
    const router = useRouter()
    if (session) {
    return (
      <div>
        <div>{session.user.name}님 안녕하세요</div>
        <div onClick={() => signOut()}>로그아웃</div>
          <Link href={"/post"}>
              <div>Post page</div>
          </Link>
        <div>
          <div>
            {postData.map((post, key) => (
              <div key={key}>
                <img src={`https://imagedelivery.net/p4TahxOLmTmIsMIJ7PpE9A/${post.img_url}/public`}/>
                <div>{post.title}</div>
                  <button onClick={async ()=>{
                      const userEmail = session.user.email
                        const postId = post.id
                      await fetch(`/api/addLike`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({userEmail, postId}),
                      })
                      await router.replace(router.asPath)
                  }}>add like</button>
                  <button onClick={async ()=>{
                      const postId = post.id
                      await fetch(`/api/deletePost`, {
                          method: "DELETE",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({postId}),
                      })
                      await router.replace(router.asPath)
                  }}>delete post</button>
                  <div>{post.like.length}</div>

              </div>

            ))}
          </div>
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
