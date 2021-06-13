import { EventEmitter } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredients.model";

export class ShoppingListService {

    startedEditing = new Subject<number>();
    ingredientChanged = new Subject<Ingredient[]>()
    private  ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatos', 10)
      ];


      addIngredient(ingredient: {name: string, amount: number}){
        this.ingredients.push(new Ingredient(ingredient.name, ingredient.amount))
        // this.ingredientChanged.emit(this.ingredients.slice())
        this.ingredientChanged.next(this.ingredients.slice());
      }

      getIngredients(){
          return this.ingredients.slice();
      }

      addIngredeints(ingredeints: Ingredient[]){

        // for(let ingredient of ingredeints){
        //     this.ingredients.push(ingredient);
        // }

        this.ingredients.push(...ingredeints);
        this.ingredientChanged.next(this.ingredients.slice());
      }

      getIngredeint(index: number){
        return this.ingredients[index];
      }
    
      updateIngredient(index: number, newIngredient: Ingredient) {
        this.ingredients[index] = newIngredient;
        this.ingredientChanged.next(this.ingredients.slice());
      }

      deleteIngredeint(index: number) {
        this.ingredients.splice(index, 1);
        this.ingredientChanged.next(this.ingredients.slice());
      }

}