import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
//import {NgForm} from '@angular/forms';
 
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ToDoService } from '../../../core/services/todo.service';
 
@Component({
    //moduleId: module.id,
    selector: 'em-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})
 
export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    error = '';
    loadingSubcription;
    tokenSubcription;
    username;
    password;
    token: string;
 
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private toDoService: ToDoService) { }
 
    ngOnInit() {
        // reset login status
        this.authenticationService.logout();

        this.loadingSubcription = this.authenticationService.getLoading()
            .subscribe( ( pLoading ) => { 
                this.loading = pLoading 
            } );

        this.tokenSubcription = this.authenticationService.getTokenValue()
            .subscribe( ( pToken ) => { 
                this.token = pToken 
                if ( pToken !== "" ){
                    console.log( "[Tdl]: login ok - " + this.username + " - " + this.password + " - " + this.token );
                    this.toDoService.refresh();
                }
            } );
    }

    ngOnDestroy() {
        this.loadingSubcription.unsubscribe();
        this.tokenSubcription.unsubscribe();
    }

    setUserName( value: string ) {

        this.username = value;
    }

    setPassword( value: string ) {
        this.password = value;
    }
 
    login() {
        this.loading = true;
        this.authenticationService.login(this.username, this.password);
    }

    logout() {
        this.authenticationService.logout();
        this.token = "";
        this.username = "";
        this.password = "";
    }
}