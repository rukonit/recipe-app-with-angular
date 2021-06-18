import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import {map, tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class DataStorageService {
    constructor(private http: HttpClient, private recipeService: RecipeService) {

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
        .pipe(map(
            posts => {
                return posts.map(posts => {
                    return {...posts, ingredients: posts.ingredients ? posts.ingredients : []}
                })
            }
        ),
        tap(posts => {
            this.recipeService.overwriteRecipes(posts);
        })
        )
        
    }
}