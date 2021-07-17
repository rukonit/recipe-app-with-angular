import { ShoppingListState,  shoppingListReducer, State } from './shopping-list.reducer';
import { ActionReducerMap } from '@ngrx/store';


export const rootReducer = {};

export interface AppState {
    shoppingList: State;
};


export const reducers: ActionReducerMap<AppState, any> = {
    shoppingList: shoppingListReducer
};