import { appDataEvents, BSDataTable, BSDataTableColDefinition, BSDataTableDataSource, BSDataTableInput, BSDataTableOptions, BSFieldUpdatedEvent } from "bs-datatable";

export class DynamicDemo {
    static run(containerId: string, initData) {
        console.log('running dynamic demo');


        var bookingLines = initData.data;
        var bookingLinesMetadata = initData.metaData;

        var cols = [];

        cols.push(new BSDataTableColDefinition("Line nbr", "number", "80px", "lineNbr", true));
        cols.push(new BSDataTableColDefinition("Description", "text", "220px", "desc", false));
        cols.push(new BSDataTableColDefinition("Quantity", "number", "80px", "qty", false));
        cols.push(new BSDataTableColDefinition("Unit cost", "number", "120px", "cost", false));
        cols.push(new BSDataTableColDefinition("Cost", "number", "120px", "extCost", false));


        var dataSource = new BSDataTableDataSource('lines', {
            initData: bookingLines, metaData: bookingLinesMetadata
        }, true, (page) => 'http://localhost:3000/api/bookinglines?page=' + page);
        
        var options = new BSDataTableOptions("bookingLines", containerId, cols, dataSource);
        var grid = new BSDataTable(options);
        grid.registerCallbacks();

        //
        // lets say we have to calculate ext cost using the unit cost and quantity
        // we can do this by registering a change event
        //

        grid.addHandler(appDataEvents.ON_FIELD_UPDATED, (sender, e) => {
            let ev = e as BSFieldUpdatedEvent;
            if (!ev) return;
            var field = ev.EventData.Field as BSDataTableInput;
            if (!field) return;

            var datatable = sender as BSDataTable;

            var fieldName = field.modelName;
            var row = ev.EventData.Row;

            // console.log('on-field-update', fieldName, row);
            if (fieldName === 'quantity' || fieldName === 'unitCost') {
                row.extCost.val = row.quantity.val * row.unitCost.val;

                //calcSummary(sender);
            }
        });

        grid.render();
    }
}