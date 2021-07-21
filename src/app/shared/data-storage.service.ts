import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import {exhaustMap, map, take, tap} from 'rxjs/operators';
import * as fromApp from '../store/app.reducer'
import * as fromRecipesActions from '../recipes/store/recipes.actions'

import { Store } from "@ngrx/store";

@Injectable({providedIn: 'root'})
export class DataStorageService {
    constructor(private http: HttpClient, private recipeService: RecipeService, private store: Store<fromApp.AppState>) {

    }

    storeRecipe() {
        const recipes = this.recipeService.getRecipes();
        this.http.put('https://recipe-backend-60ec6-default-rtdb.firebaseio.com/recipes.json', recipes)
        .subscribe(
            response => {console.log(response);
            }
        );
    }

    fetchRecipe() {
    
            return this.http.get<Recipe[]>('https://recipe-backend-60ec6-default-rtdb.firebaseio.com/recipes.json')
        .pipe(
        map(
            posts => {
                return posts.map(posts => {
                    return {...posts, ingredients: posts.ingredients ? posts.ingredients : []}
                })
            }
        ),
        tap(recipes => {
            // this.recipeService.overwriteRecipes(posts);
            this.store.dispatch(new fromRecipesActions.SetRecipes(recipes))
        })
        )
       
        
       
        
    }
}