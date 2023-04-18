import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transacciones-load',
  templateUrl: './transacciones-load.component.html',
})
export class TransaccionesLoadComponent implements OnInit {
  menu;
  constructor() { }

  ngOnInit(): void {
    this.menu = {
      modulo:"mdm",
      seccion: "clientesTransacLoad"
    };
  }

}
