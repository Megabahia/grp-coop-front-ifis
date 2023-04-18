import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
const CSV_TYPE='text/csv;charset=utf-8';
const CSV_EXTENSION='.csv';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }


  public exportExcel(excelData) {
    ​
        //Title, Header & Data
        const title = excelData.title;
        const header = excelData.headers;
        const data = excelData.data;
    ​
        //Create a workbook with a worksheet
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Reporte');
    ​
    ​
        //Add Row and formatting
        // worksheet.mergeCells('C1', 'F4');
        // let titleRow = worksheet.getCell('C1');
        // titleRow.value = title;
        // titleRow.font = {
        //   name: 'Calibri',
        //   size: 16,
        //   underline: 'single',
        //   bold: true,
        //   // color: {argb: '0085A3'}
        // };
        // titleRow.alignment = {vertical: 'middle', horizontal: 'center'};
    ​
        // Date
        // worksheet.mergeCells('G1:H4');
        // let d = new Date();
        // let date = d.getDate() + '-' + (d.getMonth()+1) + '-' + d.getFullYear();
        // let dateCell = worksheet.getCell('G1');
        // dateCell.value = date;
        // dateCell.font = {
        //   name: 'Calibri',
        //   size: 12,
        //   bold: true
        // };
        // dateCell.alignment = {vertical: 'middle', horizontal: 'center'};
    ​
        //Add Image
        // let myLogoImage = workbook.addImage({
        //   base64: logo.imgBase64,
        //   extension: 'png',
        // });
        // worksheet.mergeCells('A1:B4');
        // worksheet.addImage(myLogoImage, 'A1:B4');
    ​
        //Blank Row
        // worksheet.addRow([]);
    ​
        //Adding Header Row
        let headerRow = worksheet.addRow(header);
        headerRow.eachCell((cell, number) => {
          worksheet.getColumn(number).width = 20;

          // cell.fill = {
          //   type: 'pattern',
          //   pattern: 'solid',
          //   // fgColor: {argb: '4167B8'},
          //   // bgColor: {argb: ''}
          // };
          // cell.font = {
          //   bold: true,
          //   color: {argb: 'FFFFFF'},
          //   size: 12
          // };
        });
    ​
        // Adding Data with Conditional Formatting
        data.forEach((d,i )=> {
            let row = worksheet.addRow(d);

          }
        );
    ​
        // worksheet.getColumn(1).width = 30;
        // worksheet.getColumn(2).width = 20;
        // worksheet.getColumn(3).width = 20;
        // worksheet.getColumn(4).width = 20;
        // worksheet.getColumn(5).width = 20;
        // worksheet.getColumn(7).width = 20;
        // worksheet.getColumn(8).width = 20;
        // worksheet.getColumn(9).width = 20;
        // worksheet.getColumn(10).width = 20;
        // worksheet.getColumn(11).width = 20;
        // worksheet.getColumn(12).width = 20;
        // worksheet.getColumn(13).width = 20;
        // worksheet.getColumn(14).width = 20;
        // worksheet.getColumn(15).width = 20;
        // worksheet.getColumn(16).width = 20;
        // worksheet.addRow([]);
    ​
        //Merge Cells
    ​
        //Generate & Save Excel File
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          FileSaver.saveAs(blob, title + '.xlsx');
        });
    ​
      }
}
