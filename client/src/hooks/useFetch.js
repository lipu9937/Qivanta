import { useEffect, useState } from "react";
import api, { errMsg } from "../services/api";

export default function useFetch(url, params) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const key = JSON.stringify(params || {});

  useEffect(() => {
    let live = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    api.get(url, { params: JSON.parse(key) })
      .then((r) => {
        if (!live) return;
        // NEW: if the server answered with a web page (text) instead of JSON, the API address or the backend version is wrong
        if (typeof r.data === "string") {
          return setState({ data: null, loading: false, error: "The server sent a web page instead of data. Check that the backend is running the latest version." });
        }
        setState({ data: r.data, loading: false, error: null });
      })
      .catch((e) => live && setState({ data: null, loading: false, error: errMsg(e, "Could not load this content.") }));
    return () => { live = false; };
  }, [url, key]);

  return state;
}
