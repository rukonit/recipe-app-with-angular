import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Ingredient } from "../shared/ingredients.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>();

    constructor(private shoppingListService: ShoppingListService) {}

   private recipes: Recipe[] = [
       
          new Recipe('Buffalo Chicken Dip',
         'This is the best buffalo chicken dip recipe!',
          'https://www.tasteofhome.com/wp-content/uploads/2018/01/Buffalo-Chicken-Dip_EXPS_FT21_34952_F_0115_1-2.jpg?resize=696,696', [new Ingredient("Chicken", 5), new Ingredient("Bread", 3)])
          ,
          new Recipe('Mini Brownie Treats',
         'I like to take these quick-and-easy treats to potlucks and family gatherings. ',
          'https://www.tasteofhome.com/wp-content/uploads/2018/01/Mini-Brownie-Treats_EXPS_DIYD20_19759_B01_14_2b-2.jpg?resize=696,696', [new Ingredient("Chicken", 5), new Ingredient("Bread", 3)])
          ,
          new Recipe('Chicken Biscuit Potpie',
         'This hearty meal in one takes just 10 minutes to assemble before popping it in the oven.',
          'https://www.tasteofhome.com/wp-content/uploads/2018/01/Chicken-Biscuit-Potpie_EXPS_FT21_10094_F_0205_1.jpg?resize=700,700', [new Ingredient("Chicken", 5), new Ingredient("Bread", 3)])
          ,
          new Recipe('Garlic Knots',
         'These novel knots are handy because they can be made ahead of time and re-heated when needed.',
          'https://www.tasteofhome.com/wp-content/uploads/2018/01/Garlic-Knots_EXPS_HCA21_39824_B01_29_1b-5.jpg?resize=696,696', [new Ingredient("Chicken", 5), new Ingredient("Bread", 3)]),
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
    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }


}