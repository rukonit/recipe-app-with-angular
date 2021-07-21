import { from } from "rxjs";
import { Recipe } from "../recipe.model";
import * as fromRecipesActions from "./recipes.actions";

export interface State {
    recipes: Recipe[]
}

const initialState: State = {
    recipes: [new Recipe("Ketcup", "It turns out ketchup's origins are anything but American. Ketchup comes from the Hokkien Chinese word, kê-tsiap, the name of a sauce derived from fermented fish.", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_T_gD7-2C5w7K_THvEuLS9MrNPvPaBGqjc68CA2RDeOv7RFDrOGzVF-sG8yTvfCYONV0&usqp=CAU", null)]
}

export function recipeReducer(state : State = initialState, action: fromRecipesActions.RecipeActions) {

    switch(action.type) {
        case fromRecipesActions.SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload]
            }

        case fromRecipesActions.ADD_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes, action.payload]
            }

        case fromRecipesActions.UPDATE_RECIPES:
            const updatedRecipe = {...state.recipes[action.payload.index], ...action.payload.newRecipe}

            const updatedRecipes = [...state.recipes]
            updatedRecipes[action.payload.index] = updatedRecipe

        
            return {
                ...state,
                recipes: updatedRecipes
            }

        case fromRecipesActions.DELETE_RECIPES:
           
            return {
                ...state,
                recipes: [...state.recipes.filter((recipe, index)=> {
                    return index !== action.payload;
                })]
            }
    
    default:
    return state;
}
}