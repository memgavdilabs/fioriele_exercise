sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'com.gavdi.warehousemanagement',
            componentId: 'GoodsObjectPage',
            contextPath: '/Warehouse/Goods'
        },
        CustomPageDefinitions
    );
});