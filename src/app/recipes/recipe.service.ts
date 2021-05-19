import { Recipe } from "./recipe.model";

export class RecipeService {
   private recipes: Recipe[] = [
        new Recipe('A Test Recipe', 'A test path', 'https://www.eatwell101.com/wp-content/uploads/2019/04/chicken-and-asparagus-skillet-recipe-2.jpg'),
        new Recipe('A Second Test Recipe', 'A second test path', 'https://www.eatwell101.com/wp-content/uploads/2019/04/chicken-and-asparagus-skillet-recipe-2.jpg')
      ];


    getRecipes() {
        return this.recipes.slice();
    }
}