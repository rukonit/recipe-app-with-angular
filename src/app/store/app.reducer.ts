import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromRecipes from '../recipes/store/recipes.reducer'
import { ActionReducerMap } from '@ngrx/store';
import { Recipe } from '../recipes/recipe.model';


export const rootReducer = {};

export interface AppState {
    shoppingList: fromShoppingList.State;
    auth: fromAuth.State;
    recipes: fromRecipes.State

};


export const reducers: ActionReducerMap<AppState, any> = {
    shoppingList: fromShoppingList.shoppingListReducer,
    auth: fromAuth.authReducer,
    recipes: fromRecipes.recipeReducer
};