import { Action } from "@ngrx/store"
import { Recipe } from "../recipe.model"

export const SET_RECIPES = '[Recipes] Set Recipes'
export const ADD_RECIPE = '[Recipes] ADD Recipe'
export const UPDATE_RECIPES = '[Recipes] UPDATE Recipes'
export const DELETE_RECIPES = '[Recipes] DELETE Recipes'
export const FETCH_RECIPES = '[Recipes] Fetch Recipes'

export class SetRecipes implements Action {
    readonly type = SET_RECIPES;

    constructor(public payload: Recipe[]) {}
}

export class FetchRecips implements Action {
    readonly type = FETCH_RECIPES;
}

export class AddRecipe implements Action {
    readonly type = ADD_RECIPE;

    constructor(public payload: Recipe) {}
}

export class UpdateRecipe implements Action {
    readonly type = UPDATE_RECIPES;

    constructor(public payload: {index: number, newRecipe: Recipe}) {}
}

export class DeleteRecipe implements Action {
    readonly type = DELETE_RECIPES;

    constructor(public payload: number) {}
}
export type RecipeActions = SetRecipes | FetchRecips | AddRecipe | UpdateRecipe | DeleteRecipe;