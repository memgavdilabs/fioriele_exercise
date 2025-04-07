using WarehouseManagementService as service from '../../srv/service';
using from '@sap/cds/common';

annotate service.Warehouse with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : name,
            Label : '{i18n>WarehouseName}',
        },
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
            Value : name,
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
            ID : 'city',
            Target : 'location/@UI.DataPoint#city',
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
            Label : 'General Information',
            ID : 'GeneralInformation',
            Target : '@UI.FieldGroup#GeneralInformation',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Goods',
            ID : 'Goods',
            Target : 'Goods/@UI.LineItem#Goods',
        },
    ],
    UI.FieldGroup #GeneralInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : name,
                Label : '{i18n>WarehouseName}',
            },
            {
                $Type : 'UI.DataField',
                Value : location_ID,
                Label : '{i18n>Location}',
            },
            {
                $Type : 'UI.DataField',
                Value : spaceAvailable,
                Label : '{i18n>spaceavailable}',
            },
            {
                $Type : 'UI.DataField',
                Value : spaceUtilized,
                Label : '{i18n>spaceutilized}',
            },
        ],
    },
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
    },
    UI.DataPoint #city : {
        $Type : 'UI.DataPointType',
        Value : city,
        Title : '{i18n>City}',
    },
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
            Value : product_productId,
            Label : '{i18n>GoodsTitle}',
        },
        {
            $Type : 'UI.DataField',
            Value : deliveryDate,
            Label : '{i18n>Deliverydate}',
        },
        {
            $Type : 'UI.DataField',
            Value : spaceRequired,
            Label : '{i18n>Spacerequired}',
        },
        {
            $Type : 'UI.DataField',
            Value : state,
            Label : '{i18n>Stockstatus}',
        },
    ]
);



annotate service.Goods with {
    product @(
        Common.Text : {
            $value : product.title,
            ![@UI.TextArrangement] : #TextOnly
        },
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Products',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : product_productId,
                    ValueListProperty : 'productId',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'description',
                },
            ],
        },
        Common.ValueListWithFixedValues : false,
    )
};

annotate service.Products with {
    productId @Common.Text : {
        $value : title,
        ![@UI.TextArrangement] : #TextOnly,
    }
};

annotate service.Countries with {
    name @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Countries',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : name,
                    ValueListProperty : 'name',
                },
            ],
        },
        Common.ValueListWithFixedValues : true
)};

annotate service.Warehouse with {
    location @(
        Common.Text : {
            $value : location.city,
            ![@UI.TextArrangement] : #TextOnly
        },
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Location',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : location_ID,
                    ValueListProperty : 'ID',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'country/name',
                },
            ],
        },
        Common.ValueListWithFixedValues : true,
    )
};

annotate service.Location with {
    ID @Common.Text : {
        $value : city,
        ![@UI.TextArrangement] : #TextOnly,
    }
};

