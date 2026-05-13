import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { AppProps } from "next/app";
import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthUserContext";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "@/client";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  return <ApolloProvider client={client}><AuthProvider>{getLayout(<Component {...pageProps} />)}</AuthProvider></ApolloProvider>;
};

export default App;
