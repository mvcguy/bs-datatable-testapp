// @ts-check
import { BSDataTable, BSDataTableColDefinition, BSDataTableDataSource, BSDataTableOptions, BSDataTablePagingMetaData, BSDataTableTextInputExt } from "bs-datatable"
import * as jquery from "jquery";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../node_modules/bootstrap-icons/font/bootstrap-icons.css"
import "./css/site.css"

jquery(document).ready(function () {
    // console.log('test is initialized');

    console.log('hello from index');
    //
    // sample using bootstrap data grid 
    //
    var cols = [];
    var initData = [];

    var totCols = 5, totRows = 60;
    for (let i = 0; i < totCols; i++) {
        cols.push(new BSDataTableColDefinition("COL-" + i, "text", "180px", "col-" + i, false));
        
    }

    for (let i = 0; i < totRows; i++) {

        var record = {};
        for (let j = 0; j < totCols; j++) {
            record['col-' + j] = 'DATA-' + i + '-' + j;
        }
        initData.push(record);
    }

    var dataSource = new BSDataTableDataSource('fakeData',
        {
            initData,
            metaData: new BSDataTablePagingMetaData(1, 5, totRows)
        }, false, null,
        (page, data, mdata) => {
            var start = page <= 1 ? 0 : (page - 1) * mdata.pageSize;
            var end = start + mdata.pageSize;
            var maxIndex = data.length - 1;
            if (start > maxIndex || end > maxIndex) return [];
            var pageData = [];
            for (let index = start; index < end; index++) {
                const element = data[index];
                pageData.push(element);
            }
            return pageData;
        });

    var bs = new BSDataTableOptions("fakeData_table", "dummy-data-container", cols, dataSource);

    var grid = new BSDataTable(bs);
    grid.registerCallbacks();
    grid.render();


    var name = new BSDataTableTextInputExt({ inputType: "text", elementId: "txtName", dataSourceName: "welcome" });
    name.val = "Welcome to TypeScript";

});
