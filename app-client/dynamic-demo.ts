import { appDataEvents, BSDataTable, BSDataTableColDefinition, BSDataTableDataSource, BSDataTableInput, BSDataTableOptions, BSDataTableSelectListItem, BSFieldUpdatedEvent, BSFluentBuilder } from "bs-datatable";

export class DynamicDemo {
    static run(containerId: string, initData) {
        console.log('running dynamic demo');

        var builder = BSFluentBuilder
            .CreateBuilder()
            .SetDataSourceName('booking_lines')
            .SetId('booking_lines')
            .SetContainerId(containerId)
            .IsRemote(true)
            .NextPageUrlCallback(page => 'http://localhost:3000/api/bookinglines?page=' + page)
            .EnableInfiniteScroll(true)
            .IsReadonly(false)
            .CacheResponses(false)
            .AddInitData(config => {
                config.initData = initData.data;
                config.metaData = initData.metaData;
            })
            .AddColumn(col => {
                col.DisplayName = "Line nbr";
                col.PropName = 'lineNbr'
                col.Width = '80px'
                col.DataType = 'number'
                col.IsKey = true;
            })
            .AddColumn(col => {
                //
                // a column with selector window
                //
                col.DisplayName = "Stock item";
                col.PropName = 'inventoryId'
                col.Width = '60px'
                col.DataType = 'selector'
                col.SelectorDataCB = (page) => { return `http://localhost:3000/api/stockitems?page=${page}` };
                col.SelectorCols = [
                    { DisplayName: "Stock item", DataType: "text", Width: "60px", PropName: "id", IsKey: true },
                    { DisplayName: "Description", DataType: "text", Width: "220px", PropName: "name" }
                ];
            })
            .AddColumn(col => {
                col.DisplayName = "Description";
                col.PropName = 'desc'
                col.Width = '220px'
                col.DataType = 'text'
            })
            .AddColumn(col => {
                //
                // select dropdown
                //
                col.DisplayName = "Unit of measure";
                col.PropName = 'uom';
                col.Width = '120px';
                col.DataType = 'select';
                col.SelectList = [
                    { text: 'Kilo', value: 'KG' },
                    { text: 'Litre', value: 'LI' },
                    { text: 'Piece', value: 'PCS' }
                ]
            })
            .AddColumn(col => {
                col.DisplayName = "Quantity";
                col.PropName = 'qty'
                col.Width = '80px'
                col.DataType = 'number'
            })
            .AddColumn(col => {
                col.DisplayName = "Unit cost";
                col.PropName = 'cost'
                col.Width = '120px'
                col.DataType = 'number'
            })
            .AddColumn(col => {
                col.DisplayName = "Cost";
                col.PropName = 'extCost'
                col.Width = '120px'
                col.DataType = 'number'
            });

        var dataTable = builder.Build();
        dataTable.RegisterCallbacks();

        //
        // lets say we have to calculate ext cost using the unit cost and quantity
        // we can do this by registering a change event
        //

        dataTable.addHandler(appDataEvents.ON_FIELD_UPDATED, (sender, e) => {
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

        dataTable.Render();

        //
        // customize the grid
        //
        dataTable.gridActions.addAction('btnSave', 'primary', 'save', (e) => {
            console.log('save button is called');
            var records = dataTable.allRecords;
            console.log('All records:')
            console.table(records);

            console.log('Dirty rows:');
            console.table(dataTable.dirtyRecords);
        });

    }
}