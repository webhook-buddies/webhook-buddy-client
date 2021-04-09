import { gql } from '@apollo/client';

export const FORWARD_URL_FRAGMENT = gql`
  fragment ForwardUrl on ForwardUrl {
    url
  }
`;

export const GET_FORWARD_URLS = gql`
  query GetForwardUrls($endpointId: ID!) {
    forwardUrls(endpointId: $endpointId) {
      ...ForwardUrl
    }
  }
  ${FORWARD_URL_FRAGMENT}
`;
