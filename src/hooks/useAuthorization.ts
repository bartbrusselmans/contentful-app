import { KnownSDK } from "@contentful/app-sdk";
import qs from "qs";

import useFetch from "./useFetch";

interface IData {
  [key: string]: unknown;
}

interface IAuthorizationData extends IData {
  refresh_token_expires_in: string;
  api_product_list: string;
  api_product_list_json: string[];
  organization_name: string;
  "developer.email": string;
  token_type: string;
  issued_at: string;
  client_id: string;
  access_token: string;
  application_name: string;
  scope: string;
  expires_in: string;
  refresh_count: string;
  status: string;
}

interface IAuthorization {
  data: IAuthorizationData | null;
  loading: boolean;
  error: unknown;
}

const useAuthorization = (sdk: KnownSDK): IAuthorization => {
  const body = qs.stringify({
    client_id: sdk.parameters.installation.clientId,
    client_secret: sdk.parameters.installation.clientSecret,
    grant_type: "client_credentials",
  });

  const config = {
    method: "post",
    url: sdk.parameters.installation.authEndpoint,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: body,
  };

  const { data, loading, error } = useFetch(config, true);

  return { data: data as IAuthorizationData, loading, error };
};

export default useAuthorization;
