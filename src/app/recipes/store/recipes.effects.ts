import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import { Recipe } from "../recipe.model";
import * as fromRecipesActions from '../store/recipes.actions'
import * as fromApp from '../../store/app.reducer'
import { Store } from "@ngrx/store";

@Injectable()
export class RecipeEffects {
    @Effect()
    fetchRecipes = this.actions$.pipe(ofType(fromRecipesActions.FETCH_RECIPES),
    switchMap(()=> {
        return this.http.get<Recipe[]>('https://recipe-backend-60ec6-default-rtdb.firebaseio.com/recipes.json')
    }),
    map(
        recipes => {
        
            return recipes.map(recipes => {
                return {...recipes, ingredients: recipes.ingredients ? recipes.ingredients : []}
            })
        
        }
    ),
    map((recipes => {
        return new fromRecipesActions.SetRecipes(recipes);
    }))
    )

    @Effect({dispatch: false}) 
 storeRecipes = this.actions$.pipe(ofType(fromRecipesActions.STORE_RECIPES), 
 withLatestFrom(this.store.select('recipes')),
 switchMap(([actionData, recipesState])=>{
    return this.http.put('https://recipe-backend-60ec6-default-rtdb.firebaseio.com/recipes.json', recipesState.recipes)

}))

    constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) {}

}

