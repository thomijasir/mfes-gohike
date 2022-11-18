// import 'react-app-polyfill/stable';
import React, {
  FC,
  useContext,
  useLayoutEffect,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import ReactDOM from 'react-dom/client';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import Router from './services/Router';
import ClearCache from './ClearCache';
import AppProvider, { AppContext } from './store/AppProvider';
import LoadingGeneral from './components/LoadingGeneral/LoadingGeneral.comp';
import ErrorGeneral from './components/ErrorGeneral/ErrorGeneral.comp';
import useStorage from './hooks/useStorage';
import { getParamURL } from './utils/Helper';
import APIFetch from './services/ApiFetch';
import './assets/app.css';

const queryClient = new QueryClient();

const App: FC = () => {
  // ? SET FALSE IF YOU REQUIRED FETCH DATA BEFORE RENDER ROUTER
  const [appReady] = useState<boolean>(true);
  const context = useContext(AppContext);
  const [token, setToken] = useStorage('access_token_gohike');
  const getAuthCode = useMemo(() => getParamURL('auth_code'), []);
  const fetchToken = useQuery(
    ['token', getAuthCode],
    APIFetch.getTokenService,
    {
      enabled: false,
      onSuccess: (responses: any) => {
        const [userData] = responses.data.users;
        if (userData) {
          setToken(JSON.stringify(userData));
          context.setContext(userData, 'SET_USER');
        } else {
          redirectToAuth(
            `//${process.env.MFES_AUTH}?appid=gohike&redirect=${window.location.host}`,
          );
        }
      },
    },
  );

  const redirectToAuth = useCallback((redirectUrl: string) => {
    window.location.replace(redirectUrl);
  }, []);

  useLayoutEffect(() => {
    if (!token && getAuthCode) {
      fetchToken.refetch();
    } else if (!token) {
      redirectToAuth(
        `//${process.env.MFES_AUTH}?appid=gohike&redirect=${window.location.host}`,
      );
    }
  }, []);

  useEffect(() => {
    // * IT WILL USE IF APP REQUIRED FETCH DATA BEFORE RENDER CONTAINER
    // ? FOR SOME CASE THAT APP NEED TOKEN BEFORE RENDER
    // ! setAppReady(true);
  }, []);

  // * MEMOIZE ROUTER CAN HELP INCREASE INDEX PERFORMANCE APP
  const renderRouter = useMemo(() => appReady && <Router />, [appReady]);

  if (token) {
    return (
      <>
        <LoadingGeneral {...context.loadingState} />
        <ErrorGeneral {...context.errorState} />
        {renderRouter}
      </>
    );
  }
  return null;
};

ReactDOM.createRoot(
  document.getElementById('root') || document.createDocumentFragment(),
).render(
  <ClearCache>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <App />
      </AppProvider>
    </QueryClientProvider>
  </ClearCache>,
);
