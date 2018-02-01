import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { BaseHttpService } from './base.http.service';
import { ToDo, CsError } from '../models';

import { appConstants } from '../../shared/app-constants';

import { AuthenticationService } from './authentication.service';
import { HttpHeaders } from '@angular/common/http';


@Injectable()
export class ToDoService extends BaseHttpService {

    private toDoListCurrentValue: Array<ToDo> = []; 
    private toDoListSubject = new BehaviorSubject<Array<ToDo>>(this.toDoListCurrentValue);
    private refreshSubscription;
    private isRefreshing = false;

    STATUS_COMPLETED = "Completed";

    private headers;

    constructor(private http: HttpClient,
        private authenticationService: AuthenticationService) {
        super();
    }

    setHeaders() {
        this.headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authenticationService.getToken()
        });
    }

    getToDoList() {
        return this.toDoListSubject.asObservable();
    }

    refresh(): void {

        if ( this.isRefreshing )
            return;

        this.setHeaders();
        this.isRefreshing = true;
        this.refreshSubscription = this.getAllToDos()
          .subscribe(
            toDoList => {
                this.toDoListCurrentValue = toDoList;
                this.onToDoListChange();
            },
            (error: CsError) => {
                console.log("[Etdl]: " + error.message );
            }
          );
    }

  private getAllToDos( ): Observable<Array<ToDo>> {

    this.setHeaders();
    return this.http.get<ToDo>(this.endpoint(appConstants.urlAPITodos), {headers: this.headers})
      .retry(2)
      .catch(this.handleError);
  }

  private onToDoListChange() {
    // send immutable data to push
    if ( this.refreshSubscription ){
        this.refreshSubscription.unsubscribe();
        this.isRefreshing = false;
    }

    const value = [...this.toDoListCurrentValue];
    this.toDoListSubject.next(value);
  }

    addToDo( content: string ) {

        if ( !content ){
            return;
        }

        this.setHeaders();
        this.http.post<Array<ToDo>>(this.endpoint(appConstants.urlAPITodos), { "content": content, "status": "" }, {headers: this.headers})
            .subscribe( toDoList => {
                if ( toDoList != null ){
                    this.toDoListCurrentValue = toDoList;
                    this.onToDoListChange();
                }
            },
            (error: CsError) => {
                console.log("[Etdl]: " + error.message );
            });
    }

    removeToDo( id: string ) {
        this.setHeaders();
        this.http.delete<Array<ToDo>>(this.endpoint(appConstants.urlAPITodos + "/" + id), {headers: this.headers})
            .subscribe( toDoList => {
                if ( toDoList != null ){
                    this.toDoListCurrentValue = toDoList;
                    this.onToDoListChange();
                }
            },
            (error: CsError) => {
                console.log("[Etdl]: " + error.message );
            });
    }

    completedToDo( id: string ) {
        this.http.put<Array<ToDo>>(this.endpoint(appConstants.urlAPITodos), { "id" : id, "status": this.STATUS_COMPLETED }, {headers: this.headers})
            .subscribe( toDoList => {
                if ( toDoList != null ){
                    this.toDoListCurrentValue = toDoList;
                    this.onToDoListChange();
                }
            },
            (error: CsError) => {
                console.log("[Etdl]: " + error.message );
            });
    }

}
