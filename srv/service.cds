using { com.gavdi.db as db } from '../db/data-model';

service WarehouseManagementService {
    entity Warehouse as projection on db.Warehouse;
    entity Goods as projection on db.Goods;
    entity Products as projection on db.Products;
    entity Location as projection on db.Locations;
    entity Vendor as projection on db.Vendors;
}

annotate WarehouseManagementService.Warehouse with @Aggregation.ApplySupported  : {
    Transformations: ['aggregate', 'groupby', 'identity', 'filter'],
    Rollup                : #None,
    PropertyRestrictions  : true,
    AggregatableProperties: [{Property: spaceAvailable}, {Property: spaceUtilized}],
    GroupableProperties: [location.city]
};
