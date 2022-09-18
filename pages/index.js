import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
export default function Main() {
  const [img_url, setImg_url] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const submitData = async (e) => {
    e.preventDefault();
    try {
      const body = { img_url, authorEmail };
      await fetch(`/api/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error(error);
    }
  };
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
            onChange={(e) => setAuthorEmail(e.target.value)}
            placeholder="Author (email address)"
            type="text"
            value={authorEmail}
          />
          <input
            disabled={!img_url || !authorEmail}
            type="submit"
            value="Create"
          />
        </form>
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
