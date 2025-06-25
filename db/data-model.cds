using {
    cuid,
    Currency,
    Country,
    sap,
    managed
} from '@sap/cds/common';

namespace com.gavdi.db;

entity StockStatus : sap.common.CodeList {
    key code  : Integer @assert.range: [
            0,
            3
        ];
        descr : String;
}

entity Warehouse : cuid {
    name           : String;
    spaceAvailable : Int16;
    spaceUtilized  : Int16;
    location       : Association to Locations;
    Goods          : Composition of many Goods
                         on Goods.warehouseId = $self;
}

entity Goods {
    key warehouseId       : Association to Warehouse;
    key itemId            : UUID;
        spaceRequired     : Int16;
        state             : Association to StockStatus;
        cost              : Decimal;
        currencyCode      : Currency;
        deliveryDate      : Date;
        quantityStore     : Int16;
        quantityWarehouse : Int16;
        product           : Association to Products;
}

entity Locations : cuid {
    city      : String;
    country   : Country;
    latitude  : Decimal;
    longitude : Decimal;
}

entity Products {
    key productId         : UUID;
        vendor            : Association to Vendors;
        title             : String;
        description       : String;
        price             : Decimal;
        currencyCode      : Currency;
        promoted          : Boolean;
        availableQuantity : Int16;
        imageUrl          : String;
        store             : Association to Stores;
        reviews           : Composition of many ProductReviews
                                on reviews.product = $self;
}

entity ProductReviews : cuid, managed {
        product  : Association to Products;
        user     : Association to Users;
        rating   : Integer @assert.range: [
            1,
            5
        ];
        comment  : String;
}

entity Users {
    key userId  : UUID;
        name    : String;
        email   : String;
        address : Address;
        phone: String;
        type    : String enum {
            Employee;
            Customer
        };
        reviews : Association to many ProductReviews
                      on reviews.user = $self;
        sales   : Association to many Sales
                      on sales.user = $self;
}

entity Sales {
    key basketId : UUID;
        store    : Association to Stores;
        user     : Association to Users;
        vendor   : Association to Vendors;
        salesItems : Composition of many {
            key product : Association to Products;
            quantity: Integer;
        }
}

entity Vendors : cuid {
    name     : String;
    location : Association to Locations;
    logoUrl  : String;
    products : Association to many Products
                   on products.vendor = $self;
}

entity Stores {
    key storeId  : UUID;
        name     : String;
        location : Association to Locations;
        products : Association to many Products
                       on products.store = $self;
}

type Address {
    street  : String;
    city    : String;
    country : Country;
}
