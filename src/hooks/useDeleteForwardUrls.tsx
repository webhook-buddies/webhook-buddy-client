import { gql, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import {
  AddForwardUrl,
  AddForwardUrlVariables,
} from './types/AddForwardUrl';
import {
  GetForwardUrls,
  GetForwardUrlsVariables,
} from './types/GetForwardUrls';

const DELETE_FORWARD_URLS = gql`
  mutation DeleteForwardUrls($input: DeleteForwardUrlInput!) {
    deleteForwardUrls(input: $input) {
      affectedRows
    }
  }
`;

const FORWARD_URL_FRAGMENT = gql`
  fragment ForwardUrl on ForwardUrl {
      url
    }
  }
  `;

const GET_FORWARD_URLS = gql`
  query GetForwardUrls($endpointId: ID!) {
    forwardUrls(endpointId: $endpointId) {
      ...ForwardUrl
    }
  }
  ${FORWARD_URL_FRAGMENT}
`;

const useDeleteForwardUrls = (endpointId: string) => {
  const [mutate] = useMutation<AddForwardUrl, AddForwardUrlVariables>(
    DELETE_FORWARD_URLS,
    {
      onError: error => toast.error(error.message), // Handle error to avoid unhandled rejection: https://github.com/apollographql/apollo-client/issues/6070
    },
  );

  const deleteForwardUrls = (url: string) => {
    mutate({
      variables: {
        input: {
          endpointId,
          url: url,
        },
      },
      // update: cache => {
      //   const data = cache.readQuery({
      //     query: GET_FORWARD_URLS,
      //     variables: {
      //       endpointId,
      //     },
      //   });

      //   cache.writeQuery({
      //     query: GET_FORWARD_URLS,
      //     variables: {
      //       endpointId,
      //     },
      //     data: {
      //       ...data,
      //       forwardUrls: {
      //         ...data?.forwardUrls,
      //         nodes: data?.forwardUrls.filter(
      //           n => !url.includes(n.url),
      //         ),
      //       },
      //     },
      //   });
      // },
      // optimisticResponse: {
      //   deleteForwardUrls: {
      //     __typename: 'DeleteWebhooksPayload,
      //     affectedRows: ids.length,
      //   },
      // },
    });
  };

  return {
    deleteForwardUrls,
  };
};

export default useDeleteForwardUrls;