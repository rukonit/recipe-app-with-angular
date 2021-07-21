import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import * as fromRecipeActions from '../store/recipes.actions'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id!: number;
  editMode = false;
  recipeForm!: FormGroup;
  recipeSub : Subscription;
  constructor(private route: ActivatedRoute,
 
    private router: Router,
    private store: Store<fromApp.AppState>) { }
    
ngOnDestroy() {
  if(this.recipeSub) {
  this.recipeSub.unsubscribe();
  }
}
  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
       this.id = params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    )
  }

  private initForm() {
    
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if(this.editMode){
      // const recipe = this.recipeService.getRecipesByID(this.id);
      let recipe: Recipe;
      this.recipeSub = this.store.select('recipes').pipe(map((recipeState=> {
        return recipeState.recipes.find((recipe, index)=> {return index == this.id})
      }))).subscribe((recipe=>{
        recipeName = recipe.name;
        recipeImagePath = recipe.imagePath;
        recipeDescription = recipe.description;
        if(recipe['ingredients']) {
            for (let ingredient of recipe.ingredients) {
              recipeIngredients.push(
                new FormGroup({
                  'name': new FormControl(ingredient.name,  Validators.required),
                  'amount': new FormControl(ingredient.amount,  [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
                })
              )
            }
        }
      }))
    
    }
    this.recipeForm = new FormGroup(
      {
        'name': new FormControl(recipeName, Validators.required),
        'imagePath': new FormControl(recipeImagePath,  Validators.required),
        'description': new FormControl(recipeDescription,  Validators.required),
        'ingredients': recipeIngredients
      }
    )
  }

  onSubmit(){
   
    if(this.editMode) {
      this.store.dispatch(new fromRecipeActions.UpdateRecipe({index: this.id, newRecipe: this.recipeForm.value}))
      // this.recipeService.updateRecipe(this.id, this.recipeForm.value)
    }
    else {
      this.store.dispatch(new fromRecipeActions.AddRecipe(this.recipeForm.value))
      // this.recipeService.addRecipe(this.recipeForm.value)
    }

    this.onCancel();
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]) 
      })
    )
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route})
  }

  onDeleteIngredient(ingredientID: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(ingredientID)
  }

}
