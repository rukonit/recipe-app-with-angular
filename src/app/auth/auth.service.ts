import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { Subject, throwError } from "rxjs";
import { User } from "./user.model";


export interface AuthResponseData {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean;
    

}

@Injectable({providedIn: 'root'})
export class AuthService {
    user = new Subject<User>()
    constructor(private http: HttpClient) {}
    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCgn1gbgJqHlg8ekd0zjFWhK2ZpjGp_ss8', 
        {email: email, password: password, returnSecureToken: true}, {headers: {'content-type' : 'application/json'}})
        .pipe(catchError(this.handleError), tap(resData=>{
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }));
        

    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCgn1gbgJqHlg8ekd0zjFWhK2ZpjGp_ss8', 
        {email: email, password: password, returnSecureToken: true})
        .pipe(catchError(this.handleError), tap(resData=>{
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }));
    }

    private handleError(errorRes: HttpErrorResponse) {

        let errorMessage = 'An unknown error occured'
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage)
        }
        
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
            errorMessage = 'This email already exists'
            break;
            case 'EMAIL_NOT_FOUND':
            errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted'
            break;
            case 'INVALID_PASSWORD':
            errorMessage = 'The password is invalid or the user does not have a password.'
        }
        return throwError(errorMessage);

    }

    handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
            
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
    }
}