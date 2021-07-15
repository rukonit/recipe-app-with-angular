import { Ingredient } from "src/app/shared/ingredients.model";
import * as ShoppingListActions from "./shopping-list.actions";

export interface ShoppingListState{
    ingredients: Ingredient[];
}

const initialState = {
   ingredients : [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatos', 10)
      ]
}

export function shoppingListReducer(state = initialState, action: ShoppingListActions.AddIngredient) : ShoppingListState {

    switch(action.type) {
        case ShoppingListActions.ADD_INGREDIENT: 
         return {
            ...state,
            ingredients: [...state.ingredients, action.payload]
            };
        default: 
            return state;
            
    }

  

}