import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject} from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";
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

    constructor(private store: Store<fromApp.AppState>) {}

   setLogoutTimer(expirationDuration: number) {
       this.tokenExipirationTimer = setTimeout(() => {this.store.dispatch(new fromAuth.Logout())}, expirationDuration)
    }

    clearLogoutTimer() {
        if (this.tokenExipirationTimer) {
            clearTimeout(this.tokenExipirationTimer)
        }
    }
}