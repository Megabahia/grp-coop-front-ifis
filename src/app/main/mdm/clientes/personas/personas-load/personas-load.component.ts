import {Component, OnInit} from '@angular/core';

/**
 * COOP
 * ifis
 * Esta pantalla sirve para cargar personas
 * Rutas:
 * No tiene llamados a rutas
 */

@Component({
    selector: 'app-personas-load',
    templateUrl: './personas-load.component.html',
})
export class PersonasLoadComponent implements OnInit {
    menu;

    constructor() {
    }

    ngOnInit(): void {
        this.menu = {
            modulo: 'mdm',
            seccion: 'clientesLoad'
        };
    }

}
