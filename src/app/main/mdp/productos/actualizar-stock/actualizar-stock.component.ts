import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../productos.service';

@Component({
  selector: 'app-actualizar-stock',
  templateUrl: './actualizar-stock.component.html'
})
export class ActualizarStockComponent implements OnInit {
  menu;
  archivo: FormData = new FormData();

  constructor(
    private productosService: ProductosService,
    
  ) { }

  ngOnInit(): void {
    this.menu = {
      modulo:"mdp",
      seccion: "stockAct"
    };
  }
  cargarArchivo(event){
    this.archivo = new FormData();
    this.archivo.append('documento',event.target.files[0]);
  }
  cargarStock(){
    this.productosService.cargarStock(this.archivo).subscribe((info)=>{
      console.log(info);
    });
  }
}
