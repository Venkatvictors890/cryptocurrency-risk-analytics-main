import { useEffect, useState } from "react";

export function useCryptoData(fetchFn) {
  const [data, setData] = useState([]);

  useEffect(() => {
    let intervalId;

    const fetchData = async () => {
      const res = await fetchFn();
      setData(res);
    };

    fetchData();

    intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [fetchFn]);

  return data;
}