import { Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { Recipe } from '../recipe.model'
import { RecipeService } from '../recipe.service';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes!: Recipe[];

  recipeSubs!: Subscription;
  
  constructor(private recipeService: RecipeService, 
    private router: Router, 
    private route: ActivatedRoute, 
    private dataStorageService: DataStorageService,
    private store: Store<fromApp.AppState>
    ) { }

  ngOnInit(): void {
   
    this.recipeSubs = this.store.select('recipes')
    .pipe(map(recipesState=> {
      return recipesState.recipes;
    }))
    .subscribe(
      (recipes: Recipe[]) => {this.recipes = recipes;}
      )
    // this.recipeSubs = this.recipeService.recipesChanged.subscribe(
    // (recipes: Recipe[]) => {this.recipes = recipes;}
    // )
  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route})
  }

  ngOnDestroy(){
    this.recipeSubs.unsubscribe();
  }
 
}
