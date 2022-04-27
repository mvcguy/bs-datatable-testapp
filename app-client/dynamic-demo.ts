import { appDataEvents, BSDataTable, BSDataTableColDefinition, BSDataTableDataSource, BSDataTableInput, BSDataTableOptions, BSDataTableSelectListItem, BSFieldUpdatedEvent } from "bs-datatable";

export class DynamicDemo {
    static run(containerId: string, initData) {
        console.log('running dynamic demo');

        var bookingLines = initData.data;
        var bookingLinesMetadata = initData.metaData;

        var cols: BSDataTableColDefinition[] = [];

        cols.push({ DisplayName: "Line nbr", DataType: "number", Width: "80px", PropName: "lineNbr", IsKey: true });

        //
        // selector window
        //
        var stockSelector: BSDataTableColDefinition = { DisplayName: "Stock item", DataType: "selector", Width: "60px", PropName: "inventoryId" };
        stockSelector.SelectorDataCB = (page) => { return `http://localhost:3000/api/stockitems?page=${page}` };
        stockSelector.SelectorCols = [
            { DisplayName: "Stock item", DataType: "text", Width: "60px", PropName: "id", IsKey: true },
            { DisplayName: "Description", DataType: "text", Width: "220px", PropName: "name" }
        ];

        cols.push(stockSelector);


        //
        // select dropdown
        //
        var uom: BSDataTableColDefinition = {
            DisplayName: "Unit of measure", DataType: "select", Width: "120px", PropName: "uom",
            SelectList:
                [
                    { text: 'Kilo', value: 'KG' },
                    { text: 'Litre', value: 'LI' },
                    { text: 'Piece', value: 'PCS' }
                ]
        };
        cols.push(uom);

        cols.push({ DisplayName: "Description", DataType: "text", Width: "220px", PropName: "desc" });
        cols.push({ DisplayName: "Quantity", DataType: "number", Width: "80px", PropName: "qty" });
        cols.push({ DisplayName: "Unit cost", DataType: "number", Width: "120px", PropName: "cost" });
        cols.push({ DisplayName: "Cost", DataType: "number", Width: "120px", PropName: "extCost" });

        var dataSource: BSDataTableDataSource = {
            name: 'lines',
            data: {
                initData: bookingLines,
                metaData: bookingLinesMetadata
            },
            isRemote: true,
            url: (page) => {
                // debugger;
                return 'http://localhost:3000/api/bookinglines?page=' + page;
            }
        };

        var options: BSDataTableOptions = { gridId: "bookingLines", containerId, colDefinition: cols, dataSource };
        options.enableInfiniteScroll = false;
        var grid = new BSDataTable(options);
        grid.registerCallbacks();

        //
        // lets say we have to calculate ext cost using the unit cost and quantity
        // we can do this by registering a change event
        //

        grid.addHandler(appDataEvents.ON_FIELD_UPDATED, (sender, e) => {
            // debugger;
            let ev = e as BSFieldUpdatedEvent;
            if (!ev) return;
            var field = ev.EventData.Field as BSDataTableInput;
            if (!field) return;

            var fieldName = field.options.ModelName;
            var row = ev.EventData.Row;

            if (fieldName === 'qty' || fieldName === 'cost') {
                row.extCost.val = row.qty.val * row.cost.val;

            }
        });

        grid.render();

        grid.gridActions.addAction('btnSave', 'primary', 'save', (e) => {
            console.log('save button is called');
            var records = grid.allRecords;
            console.log('All records:')
            console.table(records);

            console.log('Dirty rows:');
            console.table(grid.dirtyRecords);
        });

    }
}