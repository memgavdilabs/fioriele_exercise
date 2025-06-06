using {com.gavdi.db as db} from '../db/data-model';

service WarehouseManagementService {
    entity Warehouse as projection on db.Warehouse;
    entity Goods     as projection on db.Goods;
    entity Location  as projection on db.Locations;
    entity Vendor    as projection on db.Vendors;
}

service ShoppingService {
    entity Products as projection on db.Products;
    entity Users    as projection on db.Users;
    entity Sales    as projection on db.Sales;
}
