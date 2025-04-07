using { cuid, Currency, Country } from '@sap/cds/common';

namespace com.gavdi.db;

type status : String enum {
    InStock;
    InTransit;
    Damaged;
    Reserved;
    Packed;
    OutOfStock;
    Returned
}

@odata.draft.enabled
entity Warehouse : cuid {
    name: String;
    spaceAvailable : Int16;
    spaceUtilized : Int16;
    location : Association to Locations;
    Goods:  Composition of many Goods on Goods.warehouseId= $self;
}

entity Goods {
    key warehouseId : Association to Warehouse;
    key itemId : UUID;
    spaceRequired : Int16;
    state : status;
    cost: Decimal;
    currencyCode: Currency;
    deliveryDate: Date;
    quantityStore: Int16;
    quantityWarehouse: Int16;
    product: Association to Products;
}

entity Locations : cuid {
    city: String;
    country: Country;
    latitude: Decimal;
    longitude: Decimal;
}

entity Products {
    key productId : UUID;
    vendor : Association to Vendors;
    title : String;
    description: String;
    price: Decimal;
    currencyCode: Currency;
    promoted: Boolean;
    quantity: Int16;
    imageUrl: String;
}

entity Vendors : cuid {
    name: String;
    location: Association to Locations;
    logoUrl: String;
    products: Association to many Products on products.vendor = $self;
}