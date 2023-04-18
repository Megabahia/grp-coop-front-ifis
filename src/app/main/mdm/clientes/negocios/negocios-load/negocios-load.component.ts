import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-negocios-load',
  templateUrl: './negocios-load.component.html',
})
export class NegociosLoadComponent implements OnInit {

  menu;
  constructor() { }

  ngOnInit(): void {
    this.menu = {
      modulo:"mdm",
      seccion: "negociosLoad"
    };
  }
}
