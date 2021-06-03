import { EventEmitter, Injectable } from "@angular/core";
import { Ingredient } from "../shared/ingredients.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService {
    public recipeSelected  = new EventEmitter<Recipe>()

    constructor(private shoppingListService: ShoppingListService) {}

   private recipes: Recipe[] = [
        new Recipe('Burger',
         'A bread sandwitch', 
         'https://media.phillyvoice.com/media/images/Screen_Shot_2016-04-04_at_12.20.11.2e16d0ba.fill-735x490.png', [new Ingredient("Bread", 2), new Ingredient("Meat", 1)]),
        new Recipe('Apple Pie',
         'Pie Made with Apple',
          'https://i.ytimg.com/vi/RoHWiA6pogg/maxresdefault.jpg', [new Ingredient("Apple", 5), new Ingredient("Bread", 3)])
      ];


    getRecipes() {
        return this.recipes.slice();
    }

    getRecipesByID(id: number) {
        return this.recipes[id];
    }


    addIngredientToShoppingList(ingredeints: Ingredient[]) {
        this.shoppingListService.addIngredeints(ingredeints);
    }
}