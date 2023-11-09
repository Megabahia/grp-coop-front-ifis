import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {QueEsService} from './que-es.service';
import {DomSanitizer} from '@angular/platform-browser';

/**
 * COOP
 * PErsonas
 * Esta pantalla sirve para mostrar informacion de la
 * Rutas:
 * `${environment.apiUrl}/central/param/listOne/${id}`,
 */

@Component({
    selector: 'app-que-es',
    templateUrl: './que-es.component.html',
    styleUrls: ['./que-es.component.scss']
})
export class QueEsComponent implements OnInit, OnDestroy {
    public videos = [];
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _queEsService: QueEsService,
        private sanitizer: DomSanitizer
    ) {
        this._unsubscribeAll = new Subject();

    }

    ngOnInit(): void {
        this._queEsService.obtenerVideos('6163955465432c4c06934fa4').subscribe(info => {
            this.videos = JSON.parse(info.config);
        });
    }

    obtenerURL(i) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.videos[i].url);

    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}
