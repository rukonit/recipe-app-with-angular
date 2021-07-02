import { Component } from "@angular/core";
import { Form, NgForm } from "@angular/forms";
import { AuthService } from "./auth.service";


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: []

})

export class AuthComponent {
    isLoginMode = true;
    isLoading = false;
    error: string = '';

    constructor(private authService: AuthService) {

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

        this.isLoading = true;
        if (this.isLoginMode) {}

        else {
        
            this.authService.signUp(email, password).subscribe((resData) => {console.log(resData);
            setTimeout(()=>{ this.isLoading= false;
                
            }, 2000)
           
            
          
            }, errorMessage => {
                this.error = errorMessage
                this.isLoading = false;
            })
        }
       
        form.reset();
        
    }

}