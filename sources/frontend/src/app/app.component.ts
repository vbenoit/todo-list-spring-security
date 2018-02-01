import { Component, Output, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Todo list app (Angular5 + Spring boot + Spring security + H2)';

  ngOnInit() {
    //init some stuffs
  }
  
}
