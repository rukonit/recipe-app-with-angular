import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredients.model';
import * as ShoppingListActions from '../store/shopping-list.actions'
import * as fromApp from '../../store/app.reducer';


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: true}) slForm!: NgForm;

  subscription!: Subscription;
  editMode = false;
  editedItem!: Ingredient;

  constructor(private store: Store<fromApp.AppState>) {}

    
  

  ngOnInit(): void {

   this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredeintIndex > - 1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })

      }
      else {
        this.editMode = false;
      }
    })

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit)
  }

  onSubmit(form: NgForm){
    const name = form.value.name;
    const amount = form.value.amount;
  if (this.editMode==true) {
    this.store.dispatch(new ShoppingListActions.UpdateIngredient(new Ingredient(name, amount)))
    this.editMode = false;
  }
  else {
    this.store.dispatch(new ShoppingListActions.AddIngredient({name: name, amount: amount}))
  }
  this.editMode = false;
  form.reset();
    
  }

  onClear() {
    this.store.dispatch(new ShoppingListActions.StopEdit)
    this.editMode = false;
    this.slForm.reset();
  }

  onDelete() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient())
    this.onClear();

  }
  

}
