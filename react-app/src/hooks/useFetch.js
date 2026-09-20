import { useEffect, useState } from "react";

export default function useFetch(request) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    request()
      .then(result => {
        if (active) setData(result);
      })
      .catch(err => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [request]);

  return { data, loading, error };
}
