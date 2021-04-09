import { useMutation } from '@apollo/client';
import {
  AddForwardUrl,
  AddForwardUrlVariables,
} from 'schema/types/AddForwardUrl';
import {
  GetForwardUrls,
  GetForwardUrlsVariables,
} from 'schema/types/GetForwardUrls';
import { GET_FORWARD_URLS } from './useFetchForwardUrls';
import { DELETE_FORWARD_URLS } from 'schema/queries';

const useDeleteForwardUrls = (endpointId: string) => {
  const [mutate] = useMutation<AddForwardUrl, AddForwardUrlVariables>(
    DELETE_FORWARD_URLS,
    {
      onError: () => {}, // Handle error to avoid unhandled rejection: https://github.com/apollographql/apollo-client/issues/6070
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
      update: (cache, { data }) => {
        const forwardUrl = data?.addForwardUrl.forwardUrl;
        if (!forwardUrl) return;

        const forwardUrlData = cache.readQuery<
          GetForwardUrls,
          GetForwardUrlsVariables
        >({
          query: GET_FORWARD_URLS,
          variables: {
            endpointId,
          },
        });
        cache.writeQuery({
          query: GET_FORWARD_URLS,
          variables: {
            endpointId,
          },
          data: {
            ...forwardUrlData,
            forwardUrls: [
              forwardUrlData?.forwardUrls.filter(
                n => !forwardUrl.url.includes(n.url),
              ) || [],
            ],
          },
        });
      },
      optimisticResponse: {
        addForwardUrl: {
          __typename: 'AddForwardUrlPayload',
          forwardUrl: { url, __typename: 'ForwardUrl' },
        },
      },
    });
  };

  return {
    deleteForwardUrls,
  };
};

export default useDeleteForwardUrls;
