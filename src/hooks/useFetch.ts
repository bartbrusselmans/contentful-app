import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { config } from "process";

interface IData {
  [key: string]: unknown;
}

interface IFetch {
  trigger: () => void;
  data: unknown;
  loading: boolean;
  error: AxiosError | null;
}

interface IUseFetchConfig {
  immediate: boolean;
}

const useFetch = (
  config: AxiosRequestConfig,
  { immediate }: IUseFetchConfig = { immediate: false }
): IFetch => {
  const [data, setData] = useState<IData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const trigger = useCallback(() => {
    setLoading(true);
    setError(null);
    setData(null);

    axios(config)
      .then((response) => setData(response.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [config]);

  useEffect(() => {
    immediate && trigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { trigger, data, loading, error };
};

export default useFetch;
