import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredients.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('nameInput', {static: true}) name!: ElementRef;
  @ViewChild('amountInput', {static: true}) amount!: ElementRef;



  @Output('ingredientAdded') ingredient = new EventEmitter<{name:string, amount: number}>()
  constructor() {
    
  }

  ngOnInit(): void {
  }

  onAddItem(){
  
    this.ingredient.emit({name: this.name.nativeElement.value, amount: this.amount.nativeElement.value})
  }

}
