using WarehouseManagementService as service from '../../srv/service';
using from '@sap/cds/common';

annotate service.Warehouse with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : location.city,
            Label : '{i18n>location}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : spaceAvailable,
            Label : '{i18n>spaceavailable}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : spaceUtilized,
            Label : '{i18n>spaceutilized}',
            ![@UI.Importance] : #High,
        },
    ],
    UI.SelectionFields : [
        location.city,
    ],
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : location.city,
        },
        TypeName : '',
        TypeNamePlural : '',
    },
    UI.HeaderFacets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'latitude',
            Target : 'location/@UI.DataPoint#latitude',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'longitude',
            Target : 'location/@UI.DataPoint#longitude',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'name',
            Target : 'location/country/@UI.DataPoint#name',
        },
    ],
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Goods',
            ID : 'Goods',
            Target : 'Goods/@UI.LineItem#Goods',
        },
    ],
);

annotate service.Location with {
    city @(
        Common.Label : '{i18n>City}',
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Location',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : city,
                    ValueListProperty : 'city',
                },
            ],
        },
        Common.ValueListWithFixedValues : false,
    )
};

annotate service.Location with @(
    UI.DataPoint #latitude : {
        $Type : 'UI.DataPointType',
        Value : latitude,
        Title : '{i18n>Latitude}',
    },
    UI.DataPoint #longitude : {
        $Type : 'UI.DataPointType',
        Value : longitude,
        Title : '{i18n>Longitude}',
    }
);

annotate service.Countries with @(
    UI.DataPoint #name : {
        $Type : 'UI.DataPointType',
        Value : name,
        Title : '{i18n>Country}',
    }
);



annotate service.Goods with @(
    UI.LineItem #Goods : [
        {
            $Type : 'UI.DataField',
            Value : itemId,
            Label : 'itemId',
        },
        {
            $Type : 'UI.DataField',
            Value : product.productId,
            Label : 'productId',
        },
        {
            $Type : 'UI.DataField',
            Value : product.title,
            Label : 'title',
        },
    ]
);

annotate service.Goods with {
    itemId @Common.Text : {
        $value : product.title,
        ![@UI.TextArrangement] : #TextLast
    }
};

annotate service.Products with {
    productId @Common.Text : {
        $value : title,
        ![@UI.TextArrangement] : #TextFirst
    }
};

