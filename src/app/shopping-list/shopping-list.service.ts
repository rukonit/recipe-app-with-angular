import { EventEmitter } from "@angular/core";
import { Ingredient } from "../shared/ingredients.model";

export class ShoppingListService {
    ingredientChanged = new EventEmitter<Ingredient[]>()
    private  ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatos', 10)
      ];


      addIngredient(ingredient: {name: string, amount: number}){
        this.ingredients.push(new Ingredient(ingredient.name, ingredient.amount))
        this.ingredientChanged.emit(this.ingredients.slice())
      }

      getIngredients(){
          return this.ingredients.slice();
      }

      addIngredeints(ingredeints: Ingredient[]){

        // for(let ingredient of ingredeints){
        //     this.ingredients.push(ingredient);
        // }

        this.ingredients.push(...ingredeints);
        this.ingredientChanged.emit(this.ingredients.slice());
      }
    

}