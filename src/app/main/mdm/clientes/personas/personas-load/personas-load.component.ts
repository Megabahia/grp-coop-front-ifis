import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-personas-load',
  templateUrl: './personas-load.component.html',
})
export class PersonasLoadComponent implements OnInit {
  menu;
  constructor() { }

  ngOnInit(): void {
    this.menu = {
      modulo:"mdm",
      seccion: "clientesLoad"
    };
  }

}
