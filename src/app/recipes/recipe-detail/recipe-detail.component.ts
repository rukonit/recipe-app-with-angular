import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import * as ShoppingListActions from 'src/app/shopping-list/store/shopping-list.actions'
import * as fromApp from 'src/app/store/app.reducer';
import { map, switchMap } from 'rxjs/operators';
import * as fromRecipeActions from '../store/recipes.actions'

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe!: Recipe;
  id!: number;
  constructor(private recipeService: RecipeService, 
    private route: ActivatedRoute, private router: Router, 
    private store: Store<fromApp.AppState>
    ) { }

  ngOnInit(): void {
    let id: number;
    this.route.params.pipe(map(params => {
            return params['id'];
     }), switchMap(id=> {
       this.id = id;
       return this.store.select('recipes')
     }),
     map((recipeState => {
      return recipeState.recipes.find((recipe, index) => {return index == this.id})
     }))).subscribe((recipe =>{
      
      this.recipe = recipe;
     }))

    
  }

  onAddToShoppingList(){

    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients))
  }

  onEditRecipe(){
    this.router.navigate(['edit'], {relativeTo: this.route})

  }

  onDelete() {
    this.store.dispatch(new fromRecipeActions.DeleteRecipe(this.id))
    // this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['../'], {relativeTo: this.route})
  }
  
}
