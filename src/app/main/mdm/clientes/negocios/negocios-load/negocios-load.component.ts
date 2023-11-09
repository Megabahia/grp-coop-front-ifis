import {Component, OnInit} from '@angular/core';

/**
 * COOP
 * Ifis
 * Esta pantalla sirve para cargar negocios en base a csv o excel
 */

@Component({
    selector: 'app-negocios-load',
    templateUrl: './negocios-load.component.html',
})
export class NegociosLoadComponent implements OnInit {

    menu;

    constructor() {
    }

    ngOnInit(): void {
        this.menu = {
            modulo: 'mdm',
            seccion: 'negociosLoad'
        };
    }
}
