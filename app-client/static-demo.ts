import {
    BSDataTable, BSFluentBuilder, BSDataTableColDefinition, BSDataTableDataSource,
    BSDataTableOptions, BSDataTablePagingMetaData, BSDataTableTextInputExt
} from "bs-datatable"

export class StaticDemo {

    static run() {
        //
        // sample using bootstrap data grid 
        //

        var tableBuilder = BSFluentBuilder.CreateBuilder()
            .SetDataSourceName('Customers')
            .SetId('grid')
            .SetContainerId('customers_container')
            .IsReadonly(false)
            .IsRemote(false)
            .EnableInfiniteScroll(true)
            .CacheResponses(false);

        // Add columns
        var totCols = 5, totRows = 60;
        for (let i = 0; i < totCols; i++) {
            tableBuilder.AddColumn(col => {
                col.DisplayName = "COL-" + i;
                col.PropName = "col-" + i;
                col.Width = "180px";
                col.DataType = "text";
            });
        }

        // Add some initial data
        tableBuilder.AddInitData(config => {
            for (let i = 0; i < totRows; i++) {

                var record = {};
                for (let j = 0; j < totCols; j++) {
                    record['col-' + j] = 'DATA-' + i + '-' + j;
                }
                config.initData.push(record);
            }
            config.metaData = new BSDataTablePagingMetaData(1, 10, totRows);
        })

        // render data table
        var table = tableBuilder
            .Build()
            .RegisterCallbacks()
            .Render();
        
        // customize grid actions
        table.gridActions.addAction('btnSave', 'primary', 'save', (e) => {
            console.log('save button is called');
            var records = table.allRecords;
            console.log('All records:')
            console.table(records);

            console.log('Dirty rows:');
            console.table(table.dirtyRecords);
        });

    }
}