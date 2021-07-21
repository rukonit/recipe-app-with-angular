import { Component, OnDestroy, OnInit} from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";


import * as fromApp from '../store/app.reducer';
import * as fromAuthActions from '../auth/store/auth.actions';
import * as fromRecipeActions from '../recipes/store/recipes.actions';

@Component(
    {
        selector: 'app-header',
        templateUrl: './header.component.html'
    }
)
export class HeaderComponent implements OnInit, OnDestroy {
    private userSub: Subscription;
    isAuthenticated = false;
    demo: string | Promise<string> | null = "Welcome to the page" 
    
    constructor(private store: Store<fromApp.AppState>) {
      
    }


 
    onSaveRecipe() {
        this.store.dispatch(new fromRecipeActions.StoreRecipes)
    }

    onFetchRecipe() {
        this.store.dispatch(new fromRecipeActions.FetchRecips())
    }

    ngOnInit() {
        this.store.select('auth').pipe(map(authState => {return authState.user})).subscribe((user) =>
        {
            this.isAuthenticated = !!user;
            console.log(!user)
            console.log(!!user)
        });

       }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }

    onLogout() {
        this.store.dispatch(new fromAuthActions.Logout())
       
        }
  
}