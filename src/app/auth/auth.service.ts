import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

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
        {email: email, password: password, returnSecureToken: true}, {headers: {'content-type' : 'application/json'}});
        

    }
}