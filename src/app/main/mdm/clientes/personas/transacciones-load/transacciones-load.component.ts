import {Component, OnInit} from '@angular/core';

/**
 * COOP
 * ifis
 * ESta pantalla sirve para cargar las transacciones
 * Rutas:
 * no tiene llamado a rutas
 */

@Component({
    selector: 'app-transacciones-load',
    templateUrl: './transacciones-load.component.html',
})
export class TransaccionesLoadComponent implements OnInit {
    menu;

    constructor() {
    }

    ngOnInit(): void {
        this.menu = {
            modulo: 'mdm',
            seccion: 'clientesTransacLoad'
        };
    }

}
