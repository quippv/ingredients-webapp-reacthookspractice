import React, { useReducer, useEffect, useCallback, useMemo } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";
import useHttp from "../../hooks/http";

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter(
        (ingredient) => action.id !== ingredient.id
      );
    default:
      throw new Error("Should not get there!");
  }
};

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {
    loading,
    error,
    data,
    sendRequest,
    extra,
    identifier,
    clear,
  } = useHttp();

  useEffect(() => {
    if (!loading && !error && identifier === "DELETE_INGREDIENT") {
      dispatch({ type: "DELETE", id: extra });
    } else if (!loading && !error && identifier === "ADD_INGREDIENT") {
      dispatch({ type: "ADD", ingredient: { id: data.name, ...extra } });
    }
  }, [data, extra, identifier, loading, error]);

  const addIngredients = useCallback(
    (ingredients) => {
      sendRequest(
        "https://react-hooks-practice-38c65.firebaseio.com/ingredients.json",
        "POST",
        JSON.stringify(ingredients),
        ingredients,
        "ADD_INGREDIENT"
      );
    },
    [sendRequest]
  );

  const removeIngredients = useCallback(
    (id) => {
      sendRequest(
        `https://react-hooks-practice-38c65.firebaseio.com/ingredients/${id}.json`,
        "DELETE",
        null,
        id,
        "DELETE_INGREDIENT"
      );
    },
    [sendRequest]
  );

  const filterIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredients}
      />
    );
  }, [userIngredients, removeIngredients]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

      <IngredientForm onAddIngredients={addIngredients} loading={loading} />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
