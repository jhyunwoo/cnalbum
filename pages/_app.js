import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import BottomBar from "../components/bottomBar";
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <BottomBar />
    </SessionProvider>
  );
}
