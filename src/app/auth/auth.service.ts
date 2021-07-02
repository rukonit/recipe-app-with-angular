import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { error } from "protractor";

interface AuthResponseData {
    kind: string,
    idToken: string
    email: string,
    refreshToken: string,
    expiresIn: string
    localId: string
    
}

@Injectable({providedIn: 'root'})
export class AuthService {

    constructor(private http: HttpClient) {}
    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCgn1gbgJqHlg8ekd0zjFWhK2ZpjGp_ss8', 
        {email: email, password: password, returnSecureToken: true}, {headers: {'content-type' : 'application/json'}})
        .pipe(catchError(errorRes => {
            let errorMessage = 'An unknown error occured'
            if (!errorRes.error || !errorRes.error.error) {
                return throwError(errorMessage)
            }
            
            switch (errorRes.error.error.message) {
                case 'EMAIL_EXISTS':
                errorMessage = 'This email already exists'
            }
            return throwError(errorMessage);
        } ) );
        

    }
}