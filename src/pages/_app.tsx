import Layout from "@/Layout/Index";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../Redux/store";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      
        <Component {...pageProps} />
      
    </Provider>
  );
}
