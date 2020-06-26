import React, { useState, useEffect, useRef } from "react";
import useHttp from "../../hooks/http";

import Card from "../UI/Card";
import ErrorModal from "../UI/ErrorModal";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadIngredients } = props;
  const [enterSearch, setEnterSearch] = useState("");
  const inputRef = useRef();
  const { sendRequest, loading, error, data, clear } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enterSearch === inputRef.current.value) {
        const query =
          enterSearch.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enterSearch}"`;
        sendRequest(
          "https://react-hooks-practice-38c65.firebaseio.com/ingredients.json" +
            query,
          "GET"
        );
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [enterSearch, sendRequest, inputRef]);

  useEffect(() => {
    if (!loading && !error && data) {
      const arrayIngredients = [];
      for (const key in data) {
        arrayIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount,
        });
      }
      onLoadIngredients(arrayIngredients);
    }
  }, [data, loading, error, onLoadIngredients]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {loading && <span>Loading...</span>}
          <input
            ref={inputRef}
            type="text"
            onChange={(event) => setEnterSearch(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
