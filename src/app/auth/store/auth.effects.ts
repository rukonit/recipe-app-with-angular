import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of} from "rxjs";
import { catchError, exhaustMap, map, switchMap, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth.service";
import { User } from "../user.model";
import * as fromAuthActions from './auth.actions'

export interface AuthResponseData {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean;
    

}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
    
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return  new fromAuthActions.AuthenticateSuccess({
       email: email,
       userId: userId,
        token: token,
        expirationDate: expirationDate,
        redirect: true

    });



}

const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occured'
    if (!errorRes.error || !errorRes.error.error) {
        return of(new fromAuthActions.AuthenticateFail(errorMessage))
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
return of(new fromAuthActions.AuthenticateFail(errorMessage));
}

@Injectable()
export class AuthEffects {
    @Effect()
    authSignup = this.actions$.pipe(
        ofType(fromAuthActions.SIGNUP_START),
        switchMap((signupAction: fromAuthActions.SignUpStart) => {
            return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey, 
            {email: signupAction.payload.email, password: signupAction.payload.password, returnSecureToken: true}, {headers: {'content-type' : 'application/json'}})
            .pipe(
                tap((resData)=>{
                    this.authService.setLogoutTimer(+resData.expiresIn);
                }),
                map(resData=>{
                return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)
            }),
            catchError(errorRes => {
                return handleError(errorRes)
            })
            
            );
            
        })
    );

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(fromAuthActions.LOGIN_START),
        exhaustMap((authData: fromAuthActions.LoginStart) => {
            return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+ environment.firebaseAPIKey, 
            {email: authData.payload.email, password: authData.payload.password, returnSecureToken: true}
            ).pipe(
                tap((resData)=>{
                    this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                }),
                map(resData => {
                  return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)
                })
                ,catchError(errorRes => {
                   return handleError(errorRes)
            }))

        })
        
    )

    @Effect({dispatch: false})
    authLogout = this.actions$.pipe(ofType(fromAuthActions.LOGOUT), tap(()=> {
    
        localStorage.removeItem('userData');
        this.authService.clearLogoutTimer();
        this.router.navigate(['/login'])

    })
    )

    @Effect()
    autoLogin = this.actions$.pipe(ofType(fromAuthActions.AUTO_LOGIN), map(() => {
        const userData: {
            email: string,
            id: string
            _token: string,
            _tokenExpirationDate: string

        } = JSON.parse(localStorage.getItem('userData'))
       console.log(userData);
       
        if (!userData) {
            return { type: 'DUMMY'};
        }
  

        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

        if (loadedUser.token) {
     
            
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
    
            this.authService.setLogoutTimer(expirationDuration);
        
          return new fromAuthActions.AuthenticateSuccess({email: loadedUser.email, userId: loadedUser.id, token: loadedUser.token, expirationDate: new Date(userData._tokenExpirationDate), redirect: true})
      
            // this.user.next(loadedUser);
            
            // this.autoLogout(expirationDuration);

        }
    return { type: 'DUMMY'}
     
     
    }))

    @Effect({dispatch: false})
    authRedirect = this.actions$.pipe(ofType(fromAuthActions.AUTHENTICATE_SUCCESS), tap((authSuccessAction: fromAuthActions.AuthenticateSuccess)=> {
        console.log("loadedUser");
        if (authSuccessAction.payload.redirect) {
        
        this.router.navigate(['/'])
    }
    }))

    constructor(private actions$: Actions, private http: HttpClient, private router:Router, private authService: AuthService) {
}
}