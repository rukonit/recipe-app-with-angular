import { Ingredient } from "src/app/shared/ingredients.model";
import * as ShoppingListActions from "./shopping-list.actions";

export interface ShoppingListState{
    ingredients: Ingredient[];
  
}

export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredeintIndex: number;
}

const initialState: State = {
   ingredients : [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatos', 10)
      ],
      editedIngredient: null,
      editedIngredeintIndex: -1
}

export function shoppingListReducer(state: State = initialState, action: ShoppingListActions.IngredientActions) : State {

    switch(action.type) {
        case ShoppingListActions.ADD_INGREDIENT: 
         return {
            ...state,
            ingredients: [...state.ingredients, action.payload]
            };

        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state, 
                ingredients: [...state.ingredients, ...action.payload]
            }

        case ShoppingListActions.UPDATE_INGREDIENT:
          
            const ingredient = state.ingredients[state.editedIngredeintIndex]
            const updatedIngredient = {
                ...ingredient,
                ...action.payload
            }

            const updatedIngredients = [...state.ingredients]
            updatedIngredients[state.editedIngredeintIndex] = updatedIngredient

            return {
                ...state,
                ingredients: updatedIngredients,
                editedIngredient: null,
                editedIngredeintIndex: -1
            }
        case ShoppingListActions.DELETE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.filter((ingredient, ingredientIndex)=> ingredientIndex !== state.editedIngredeintIndex),
                editedIngredient: null,
                editedIngredeintIndex: -1
            }

        case ShoppingListActions.START_EDIT:
            return {
                ...state,
                editedIngredeintIndex : action.payload,
                editedIngredient: {...state.ingredients[action.payload]}
            };
        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedIngredient: null,
                editedIngredeintIndex: -1
            }

        default: 
            return state;
            
    }

  

}

