/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteForwardUrlInput } from "./../../types/global-types";

// ====================================================
// GraphQL mutation operation: DeleteForwardUrls
// ====================================================

export interface DeleteForwardUrls_deleteForwardUrls {
  __typename: "DeleteForwardUrlPayload";
  affectedRows: number;
}

export interface DeleteForwardUrls {
  deleteForwardUrls: DeleteForwardUrls_deleteForwardUrls;
}

export interface DeleteForwardUrlsVariables {
  input: DeleteForwardUrlInput;
}
