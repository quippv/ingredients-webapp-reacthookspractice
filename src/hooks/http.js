import { useReducer, useCallback } from "react";

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.reqIdentifier,
      };
    case "RESPONSE":
      return {
        ...httpState,
        loading: false,
        data: action.responseData,
        extra: action.reqExtra,
      };
    case "ERROR":
      return { ...httpState, loading: false, error: action.errorMessage };
    case "CLEAR":
      return initialState;
    default:
      throw new Error("Should not get reach!");
  }
};

const useHttp = () => {
  const [httpState, dispatchHtttp] = useReducer(httpReducer, initialState);

  const clearHandler = useCallback(() => {
    dispatchHtttp({ type: "CLEAR" });
  }, []);

  const sendRequest = useCallback(
    (url, method, body, reqExtra, reqIdentifier) => {
      dispatchHtttp({ type: "SEND", reqIdentifier: reqIdentifier });
      fetch(url, {
        method: method,
        body: body,
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          return response.json();
        })
        .then((responseData) => {
          dispatchHtttp({
            type: "RESPONSE",
            responseData: responseData,
            reqExtra: reqExtra,
          });
        })
        .catch((error) => {
          dispatchHtttp({ type: "ERROR", errorMessage: error.message });
        });
    },
    []
  );

  return {
    loading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    extra: httpState.extra,
    sendRequest: sendRequest,
    identifier: httpState.identifier,
    clear: clearHandler,
  };
};

export default useHttp;
