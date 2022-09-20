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
  const { data: session } = useSession();
  const postData = JSON.parse(posts)
  if (session) {
    return (
      <div>
        <div>{session.user.name}님 안녕하세요</div>
        <div onClick={() => signOut()}>로그아웃</div>
        <div>
          <div>
            {postData.map((post, key) => (
              <div key={key}>
                <img src={`https://imagedelivery.net/p4TahxOLmTmIsMIJ7PpE9A/${post.img_url}/public`}/>
                <div>{post.title}</div>
                <div>{post.like}</div>
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
