import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredients.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: true}) slForm!: NgForm;

  subscription!: Subscription;
  editMode =false;
  editedItemIndex!: number;
  editedItem!: Ingredient;

  constructor(private shoppingListService: ShoppingListService) {}

    
  

  ngOnInit(): void {
   this.subscription = this.shoppingListService.startedEditing.subscribe(
     (index: number) => {
      this.editMode = true;
      this.editedItemIndex = index;
      this.editedItem = this.shoppingListService.getIngredeint(index);
      this.slForm.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount
      })
     }
   );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit(form: NgForm){
    const name = form.value.name;
    const amount = form.value.amount;
  if(this.editMode==true) {
    this.editedItem.name = name;
    this.editedItem.amount = amount;
    this.shoppingListService.updateIngredient(this.editedItemIndex, this.editedItem)
    this.editMode = false;
  }
  else {
    this.shoppingListService.addIngredient({name: name, amount: amount});
  }
  this.editMode = false;
  form.reset();
    
  }

  onClear() {
    this.editMode = false;
    this.slForm.reset();
  }

  onDelete() {

    this.onClear();
    this.shoppingListService.deleteIngredeint(this.editedItemIndex);
  }
  

}
