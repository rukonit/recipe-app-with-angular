import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredients.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients!: Observable<{ingredients : Ingredient[]}> ;

  private subShoppingListCh!: Subscription;


  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<{shoppingList: {ingredients: Ingredient[]}}>
    ) { }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
     // this.ingredients = this.shoppingListService.getIngredients();
    // this.subShoppingListCh = this.shoppingListService.ingredientChanged.subscribe(
    //   ()=>{this.ingredients = this.shoppingListService.getIngredients()})
    
  }

  //destroy subscription via unsubscribe
  ngOnDestroy() {
    // this.subShoppingListCh.unsubscribe();
  }

  onEditItem(index: number) {
    this.shoppingListService.startedEditing.next(index);
  }
}
