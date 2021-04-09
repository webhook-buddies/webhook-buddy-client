/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface AddForwardInput {
  webhookId: string;
  url: string;
  method: string;
  statusCode: number;
  headers: KeyValueInput[];
  query: KeyValueInput[];
  body?: string | null;
}

export interface AddForwardUrlInput {
  endpointId: string;
  url: string;
}

export interface CreateEndpointInput {
  name: string;
}

export interface DeleteEndpointInput {
  id: string;
}

export interface DeleteForwardUrlInput {
  endpointId: string;
  url: string;
}

export interface DeleteWebhooksInput {
  webhookIds: string[];
  endpointId: string;
}

export interface KeyValueInput {
  key: string;
  value?: string | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ReadWebhookInput {
  id: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
