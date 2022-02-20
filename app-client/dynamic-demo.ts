import { BSDataTable, BSDataTableColDefinition, BSDataTableDataSource, BSDataTableOptions, BSDataTablePagingMetaData } from "bs-datatable";

export class DynamicDemo {
    static run(containerId: string, initData) {
        console.log('running dynamic demo');


        var bookingLines = initData.data;
        var bookingLinesMetadata = initData.metaData;

        /*
        var bookingLine = {
              "lineNbr": index,
              "desc": 'Car part-' + index,
              "qty": 5 + index,
              "cost": 120 + index,
              "extCost": (5 + index) * (120 + index)
            };
        */

        var cols = [];

        cols.push(new BSDataTableColDefinition("Line nbr", "number", "80px", "lineNbr", true));
        cols.push(new BSDataTableColDefinition("Description", "text", "220px", "desc", false));
        cols.push(new BSDataTableColDefinition("Quantity", "number", "80px", "qty", false));
        cols.push(new BSDataTableColDefinition("Unit cost", "number", "120px", "cost", false));
        cols.push(new BSDataTableColDefinition("Cost", "number", "120px", "extCost", false));

        var dataSource = new BSDataTableDataSource('lines', {
            initData: bookingLines, metaData: bookingLinesMetadata
        }, true, (page) => {
            var url = 'http://localhost:3000/api/bookinglines?page=' + page;
            console.log('Url: ', url);
            return url;
        });

        var bs = new BSDataTableOptions("bookingLines", containerId, cols, dataSource);
        var grid = new BSDataTable(bs);
        grid.registerCallbacks();
        grid.render();
    }
}