import { useQuery } from '@apollo/client';
import { GET_FORWARD_URLS } from 'schema/queries';
import { distinct } from 'services/ids';
import {
  GetForwardUrls,
  GetForwardUrlsVariables,
} from 'schema/types/GetForwardUrls';

const useForwardUrls = (endpointId: string) => {
  const { data } = useQuery<GetForwardUrls, GetForwardUrlsVariables>(
    GET_FORWARD_URLS,
    {
      variables: {
        endpointId,
      },
      fetchPolicy: 'cache-and-network',
    },
  );

  return {
    forwardUrls: distinct(data?.forwardUrls.map(f => f.url) || []),
  };
};

export default useForwardUrls;
