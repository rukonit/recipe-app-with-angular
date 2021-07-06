import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from "@angular/core";
import { Form, NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { error } from "protractor";
import { Observable, Subscription } from "rxjs";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceHolderDirective } from "../shared/placeholder/placeholder.directive";
import { AuthResponseData, AuthService } from "./auth.service";


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: []

})

export class AuthComponent implements OnDestroy {
    isLoginMode = true;
    isLoading = false;
    error: string = null;
    private closeSub: Subscription;
    
    @ViewChild(PlaceHolderDirective) alertHost: PlaceHolderDirective;

   

    constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) {

    }
    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
       
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return;
        }
        const email= form.value.email;
        const password = form.value.password;
        let authObs: Observable<AuthResponseData>;

        this.isLoading = true;
        if (this.isLoginMode) {
           authObs = this.authService.login(email, password)
        }

        else {
        
           authObs = this.authService.signUp(email, password)
        }

        authObs.subscribe((resData) => {
            console.log(resData);
            this.isLoading= false;
            this.router.navigate(['/recipes']);      
            }, 
            errorMessage => {
                this.error = errorMessage;
                this.showErrorAlert(errorMessage);
                this.isLoading = false;
            })
       
        form.reset();
        
    }

    onHandleError() {
        this.error= null;
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
        this.closeSub.unsubscribe();
    }

}