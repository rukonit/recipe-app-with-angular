import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer'
import * as fromAuth from './store/auth.actions'


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
    user = new BehaviorSubject<User>(null)
    token: string = null;
    private tokenExipirationTimer: any;

    constructor(private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>) {}
    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey, 
        {email: email, password: password, returnSecureToken: true}, {headers: {'content-type' : 'application/json'}})
        .pipe(catchError(this.handleError), tap(resData=>{
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }));
        

    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+ environment.firebaseAPIKey, 
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
        this.store.dispatch(new fromAuth.AuthenticateSuccess({email: user.email, userId: user.id, token: user.token, expirationDate: expirationDate}))
        // this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user))
    }

    logout() {
        this.store.dispatch(new fromAuth.Logout)
        // this.user.next(null);
        this.router.navigate(['/login'])
        localStorage.removeItem('userData')
        if(this.tokenExipirationTimer) {
            clearTimeout(this.tokenExipirationTimer);
        }
    }

    autoLogin() {
        const userData: {
            email: string,
            id: string
            _token: string,
            _tokenExpirationDate: string

        } = JSON.parse(localStorage.getItem('userData'))
        if (!userData) {
            return;
        }

        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

        if (loadedUser.token) {
            this.store.dispatch(new fromAuth.AuthenticateSuccess({email: loadedUser.email, userId: loadedUser.id, token: loadedUser.token, expirationDate: new Date(userData._tokenExpirationDate)}))
            // this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }

    }

    autoLogout(expirationDuration: number) {
       this.tokenExipirationTimer = setTimeout(() => {this.logout()}, expirationDuration)
    }
}