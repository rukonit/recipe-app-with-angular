import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredients.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {

  @ViewChild('nameInput', {static: true}) name!: ElementRef;
  @ViewChild('amountInput', {static: true}) amount!: ElementRef;

  constructor(private shoppingListService: ShoppingListService) {}

    
  

  ngOnInit(): void {
  }

  onAddItem(){
  
    this.shoppingListService.addIngredient({name: this.name.nativeElement.value, amount: this.amount.nativeElement.value});
    
  }

}
