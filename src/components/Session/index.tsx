import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { useSetMe } from 'context/user-context';
import { USER_FRAGMENT } from 'schema/fragments';
import Error from 'components/Error';
import Loading from 'components/Loading';
import { User } from 'schema/types';

export const GET_Me = gql`
  query getMe {
    me {
      ...user
    }
  }
  ${USER_FRAGMENT}
`;

export interface MePayload {
  me: User;
}

const Session = () => {
  const setMe = useSetMe();
  const { loading, error, refetch } = useQuery<MePayload>(GET_Me, {
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ me }) => {
      setMe(me);
    },
  });

  const retry = () => refetch().catch(() => {}); // Unless we catch, a network error will cause an unhandled rejection: https://github.com/apollographql/apollo-client/issues/3963

  if (error)
    return (
      <Error error={error}>
        <button className="btn btn-primary" onClick={retry}>
          Try again!
        </button>
      </Error>
    );

  if (loading) return <Loading />;

  return <div>Almost ready...</div>;
};

export default Session;