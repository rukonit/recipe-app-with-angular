import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";

import { Subscription } from "rxjs";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceHolderDirective } from "../shared/placeholder/placeholder.directive";
import { AuthService } from "./auth.service";
import * as fromApp from '../store/app.reducer'
import * as fromAuthActions from './store/auth.actions'


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: []

})

export class AuthComponent implements OnDestroy, OnInit {
    isLoginMode = true;
    isLoading = false;
    error: string = null;
    private closeSub: Subscription;
    private storeSub: Subscription;
    
    @ViewChild(PlaceHolderDirective) alertHost: PlaceHolderDirective;

   

    constructor(private authService: AuthService, 
        private router: Router, 
        private componentFactoryResolver: ComponentFactoryResolver,
        private store: Store<fromApp.AppState>) {

    }
    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
       
    }

    ngOnInit() {
        this.storeSub = this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.loading;
            this.error = authState.authError;
        if (this.error) {
            this.showErrorAlert(this.error)
        }
        })
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return;
        }
        const email= form.value.email;
        const password = form.value.password;
     

        this.isLoading = true;
        if (this.isLoginMode) {
            this.store.dispatch(new fromAuthActions.LoginStart({email: email, password: password}))
        //    authObs = this.authService.login(email, password)
        }

        else {
        
            this.store.dispatch(new fromAuthActions.SignUpStart({email: email, password: password}))

        }

      

        // authObs.subscribe((resData) => {
        //     console.log(resData);
        //     this.isLoading= false;
        //     this.router.navigate(['/recipes']);      
        //     }, 
        //     errorMessage => {
        //         this.error = errorMessage;
        //         this.showErrorAlert(errorMessage);
        //         this.isLoading = false;
        //     })
       
        form.reset();
        
    }

    onHandleError() {
        this.store.dispatch(new fromAuthActions.ClearError())
    }

    private showErrorAlert(message: string) {

        const alertCompFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();

        const  componentRef = hostViewContainerRef.createComponent(alertCompFactory)
        componentRef.instance.message = message;
        this.closeSub = componentRef.instance.close.subscribe(()=>{
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        })
    } 

    ngOnDestroy() {
        if(this.closeSub) {
        this.closeSub.unsubscribe();
        this.storeSub.unsubscribe();
    }
    }

}