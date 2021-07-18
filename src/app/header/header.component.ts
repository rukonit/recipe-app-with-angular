import { Component, OnDestroy, OnInit} from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { promise } from "protractor";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../shared/data-storage.service";
import * as fromApp from '../store/app.reducer'

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
    
    constructor(private dataStoreService: DataStorageService, private authService: AuthService, private store: Store<fromApp.AppState>) {
      
    }


 
    onSaveRecipe() {
        this.dataStoreService.storeRecipe()
    }

    onFetchRecipe() {
        this.userSub = this.dataStoreService.fetchRecipe().subscribe();
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
        this.authService.logout();
       
        }
  
}