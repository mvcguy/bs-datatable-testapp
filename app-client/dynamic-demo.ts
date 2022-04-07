import { appDataEvents, BSDataTable, BSDataTableColDefinition, BSDataTableDataSource, BSDataTableInput, BSDataTableOptions, BSFieldUpdatedEvent } from "bs-datatable";

export class DynamicDemo {
    static run(containerId: string, initData) {
        console.log('running dynamic demo');

        var bookingLines = initData.data;
        var bookingLinesMetadata = initData.metaData;

        var cols = [];

        cols.push(new BSDataTableColDefinition("Line nbr", "number", "80px", "lineNbr", true));

        var stockSelector = new BSDataTableColDefinition("Stock item", "selector", "60px", "inventoryId");
        stockSelector.SelectorDataCB = (page) => { return `http://localhost:3000/api/stockitems?page=${page}` };
        stockSelector.SelectorCols = [
            new BSDataTableColDefinition("Stock item", "text", "60px", "id", true),
            new BSDataTableColDefinition("Description", "text", "220px", "name", false)
        ];

        cols.push(stockSelector);

        cols.push(new BSDataTableColDefinition("Description", "text", "220px", "desc", false));
        cols.push(new BSDataTableColDefinition("Quantity", "number", "80px", "qty", false));
        cols.push(new BSDataTableColDefinition("Unit cost", "number", "120px", "cost", false));
        cols.push(new BSDataTableColDefinition("Cost", "number", "120px", "extCost", false));

        var dataSource = new BSDataTableDataSource('lines', {
            initData: bookingLines, metaData: bookingLinesMetadata
        }, true, (page) => {
            // debugger;
            return 'http://localhost:3000/api/bookinglines?page=' + page;
        });
        
        var options = new BSDataTableOptions("bookingLines", containerId, cols, dataSource);
        var grid = new BSDataTable(options);
        grid.registerCallbacks();

        //
        // lets say we have to calculate ext cost using the unit cost and quantity
        // we can do this by registering a change event
        //

        grid.addHandler(appDataEvents.ON_FIELD_UPDATED, (sender, e) => {
            debugger;
            let ev = e as BSFieldUpdatedEvent;
            if (!ev) return;
            var field = ev.EventData.Field as BSDataTableInput;
            if (!field) return;

            var fieldName = field.modelName;
            var row = ev.EventData.Row;

            if (fieldName === 'qty' || fieldName === 'cost') {
                row.extCost.val = row.qty.val * row.cost.val;

            }
        });

        grid.render();
        
        grid.gridActions.addAction('btnSave', 'primary', 'save', (e) => { 
            console.log('save button is called');
            var records = grid.records;
            console.table(records);
        });

    }
}