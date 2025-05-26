sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/gavdi/warehousemanagement/test/integration/FirstJourney',
		'com/gavdi/warehousemanagement/test/integration/pages/WarehouseList',
		'com/gavdi/warehousemanagement/test/integration/pages/WarehouseObjectPage',
		'com/gavdi/warehousemanagement/test/integration/pages/GoodsObjectPage'
    ],
    function(JourneyRunner, opaJourney, WarehouseList, WarehouseObjectPage, GoodsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/gavdi/warehousemanagement') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheWarehouseList: WarehouseList,
					onTheWarehouseObjectPage: WarehouseObjectPage,
					onTheGoodsObjectPage: GoodsObjectPage
                }
            },
            opaJourney.run
        );
    }
);