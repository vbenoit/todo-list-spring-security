
import { ResponseWithToken } from '../models';
import { HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { BaseHttpService } from './base.http.service';
import { CsError } from '../models';
 
@Injectable()
export class AuthenticationService extends BaseHttpService {
    private authUrl = 'http://localhost:8888/auth';
    private headers = new HttpHeaders({'Content-Type': 'application/json'});

    private loadingSubject = new BehaviorSubject<boolean>(false);
    private tokenSubject = new BehaviorSubject<string>("");
 
    constructor(private http: HttpClient) {
        super();
    }

    getLoading() {
        return this.loadingSubject.asObservable();
    }

    getTokenValue() {
        return this.tokenSubject.asObservable();
    }
 
    login(username: string, password: string)/*: Observable<boolean>*/ {
        return this.http.post<ResponseWithToken>(this.authUrl, JSON.stringify({username: username, password: password}), {headers: this.headers})
            .subscribe((response: ResponseWithToken) => {
                // login successful if there's a jwt token in the response
                let token = response.token;
                if (token) {
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));

                    this.loadingSubject.next(false);
                    this.tokenSubject.next( token );

                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    this.loadingSubject.next(false);
                    return false;
                }
            },
            (error: CsError) => {
                console.log("[Tdl]: " + error.message );
                this.loadingSubject.next(false);
            })
    }
 
    getToken(): String {
      var currentUser = JSON.parse(localStorage.getItem('currentUser'));
      var token = currentUser && currentUser.token;
      return token ? token : "";
    }
 
    logout(): void {
        // clear token remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}