import { gql } from '@apollo/client';
import {
  USER_FRAGMENT,
  ENDPOINT_FRAGMENT,
  WEBHOOK_FRAGMENT,
  FORWARD_URL_FRAGMENT,
} from './fragments';

export const GET_ENDPOINTS = gql`
  query GetEndpoints {
    endpoints {
      ...Endpoint
    }
  }
  ${ENDPOINT_FRAGMENT}
`;

export const GET_WEBHOOKS = gql`
  query GetWebhooks($endpointId: ID!, $after: Int) {
    webhooks(endpointId: $endpointId, after: $after)
      @connection(key: "webhooks", filter: ["endpointId"]) {
      nodes {
        ...Webhook
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${WEBHOOK_FRAGMENT}
`;

export const GET_FORWARD_URLS = gql`
  query GetForwardUrls($endpointId: ID!) {
    forwardUrls(endpointId: $endpointId) {
      ...ForwardUrl
    }
  }
  ${FORWARD_URL_FRAGMENT}
`;

export const ADD_FORWARD_URL = gql`
  mutation AddForwardUrl($input: AddForwardUrlInput!) {
    addForwardUrl(input: $input) {
      forwardUrl {
        ...ForwardUrl
      }
    }
  }
  ${FORWARD_URL_FRAGMENT}
`;

export const DELETE_FORWARD_URLS = gql`
  mutation DeleteForwardUrls($input: DeleteForwardUrlInput!) {
    deleteForwardUrls(input: $input) {
      affectedRows
    }
  }
`;

export const ADD_FORWARD = gql`
  mutation AddForward($input: AddForwardInput!) {
    addForward(input: $input) {
      webhook {
        ...Webhook
      }
    }
  }
  ${WEBHOOK_FRAGMENT}
`;

export const DELETE_WEBHOOKS = gql`
  mutation DeleteWebhooks($input: DeleteWebhooksInput!) {
    deleteWebhooks(input: $input) {
      affectedRows
    }
  }
`;

export const WEBHOOK_CREATED = gql`
  subscription WebhookCreated($endpointId: ID!) {
    webhookCreated(endpointId: $endpointId) {
      webhook {
        ...Webhook
      }
    }
  }
  ${WEBHOOK_FRAGMENT}
`;

export const WEBHOOK_UPDATED = gql`
  subscription WebhookUpdated($endpointId: ID!) {
    webhookUpdated(endpointId: $endpointId) {
      webhook {
        ...Webhook
      }
    }
  }
  ${WEBHOOK_FRAGMENT}
`;

export const WEBHOOKS_DELETED = gql`
  subscription WebhooksDeleted($endpointId: ID!) {
    webhooksDeleted(endpointId: $endpointId) {
      webhookIds
    }
  }
`;

export const READ_WEBHOOK = gql`
  mutation ReadWebhook($input: ReadWebhookInput!) {
    readWebhook(input: $input) {
      webhook {
        ...Webhook
      }
    }
  }
  ${WEBHOOK_FRAGMENT}
`;

export const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

export const REGISTER_USER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      ...User
    }
  }
  ${USER_FRAGMENT}
`;

export const CREATE_ENDPOINT = gql`
  mutation CreateEndpoint($input: CreateEndpointInput!) {
    createEndpoint(input: $input) {
      endpoint {
        ...Endpoint
      }
    }
  }
  ${ENDPOINT_FRAGMENT}
`;

export const DELETE_ENDPOINT = gql`
  mutation DeleteEndpoint($input: DeleteEndpointInput!) {
    deleteEndpoint(input: $input) {
      affectedRows
    }
  }
`;
