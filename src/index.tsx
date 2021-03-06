import { StrictMode } from 'react';
import ReactDOM from 'react-dom';

import {
  ApolloProvider,
  ApolloClient,
  ApolloLink,
  createHttpLink,
  split,
  InMemoryCache,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

import {
  CachePersistor,
  PersistentStorage,
} from 'apollo3-cache-persist';
import localForage from 'localforage';

import { PersistorContextProvider } from 'context/persistor-context';
import { changeLoginState } from 'services/login-state';

import { typeDefs, resolvers } from 'schema/resolvers';

import { UserProvider } from 'context/user-context';

import { isLoggedInVar } from 'cache';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import './index.css';

import App from './App';
import * as serviceWorker from './serviceWorker';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn: {
          read: () => isLoggedInVar(),
        },
        endpoints: {
          // Without this, we get a `Cache data may be lost when replacing the endpoints field of a Query object.` warning. More info: https://www.apollographql.com/docs/react/caching/cache-field-behavior/#merging-non-normalized-objects
          merge: (_, incoming) => incoming,
        },
      },
    },
  },
});

const persistor = new CachePersistor({
  cache,
  storage: localForage as PersistentStorage,
});

const httpLink = createHttpLink({
  uri: `${process.env.REACT_APP_API_ORIGIN}/graphql`,
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    'x-token': localStorage.getItem('x-token') || '',
  },
}));

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (
        err.extensions &&
        err.extensions.code === 'UNAUTHENTICATED'
      ) {
        localStorage.removeItem('x-token');
        changeLoginState(client, persistor, false);
      } else if (err.extensions)
        console.log(`${err.extensions?.code} error`);
    }
  }

  if (networkError) console.log('networkError', networkError);
});

const httpWithErrorLink = ApolloLink.from([
  errorLink,
  authLink,
  httpLink,
]);

const wsLink = new WebSocketLink({
  uri: `${process.env.REACT_APP_WS_ORIGIN}/graphql`,
  options: {
    reconnect: true,
    connectionParams: () => ({
      'x-token': localStorage.getItem('x-token') || '',
    }),
  },
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink, // route here for subscription operations
  httpWithErrorLink, // route here for everything else (e.g. query and mutation)
);

const client = new ApolloClient({
  link,
  cache,
  typeDefs,
  resolvers,
});

persistor.restore().then(() => {
  ReactDOM.render(
    <StrictMode>
      <ApolloProvider client={client}>
        <PersistorContextProvider value={persistor}>
          <UserProvider>
            <App />
          </UserProvider>
        </PersistorContextProvider>
      </ApolloProvider>
    </StrictMode>,
    document.getElementById('root'),
  );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
