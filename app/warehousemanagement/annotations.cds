using WarehouseManagementService as service from '../../srv/service';
annotate service.Warehouse with @(
    UI.SelectionFields : [
        location.city,
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : name,
            Label : '{i18n>warehouseName}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : location.city,
            Label : '{i18n>city}',
        },
        {
            $Type : 'UI.DataField',
            Value : spaceAvailable,
            Label : '{i18n>spaceAvailable}',
        },
        {
            $Type : 'UI.DataField',
            Value : spaceUtilized,
            Label : '{i18n>spaceUtilized}',
        },
    ],
    UI.DataPoint #name : {
        $Type : 'UI.DataPointType',
        Value : name,
        Title : '{i18n>warehouseName}',
    },
    UI.DataPoint #spaceAvailable : {
        $Type : 'UI.DataPointType',
        Value : spaceAvailable,
        Title : '{i18n>spaceAvailable}',
    },
    UI.DataPoint #spaceUtilized : {
        $Type : 'UI.DataPointType',
        Value : spaceUtilized,
        Title : '{i18n>spaceUtilized}',
    },
    UI.HeaderFacets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'name',
            Target : '@UI.DataPoint#name',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'city',
            Target : 'location/@UI.DataPoint#city',
        },
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
    ],
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>GeneralInformation}',
            ID : 'i18nGeneralInformation',
            Target : '@UI.FieldGroup#i18nGeneralInformation',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>Goods}',
            ID : 'i18nGoods',
            Target : 'Goods/@UI.LineItem#i18nGoods',
        },
    ],
    UI.FieldGroup #i18nGeneralInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : spaceAvailable,
                Label : 'spaceAvailable',
            },
            {
                $Type : 'UI.DataField',
                Value : spaceUtilized,
                Label : 'spaceUtilized',
            },
        ],
    },
);

annotate service.Location with {
    city @(
        Common.Label : '{i18n>city}',
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
            Label : '{i18n>city}',
        },
        Common.ValueListWithFixedValues : true,
    )
};

annotate service.Location with @(
    UI.DataPoint #city : {
        $Type : 'UI.DataPointType',
        Value : city,
        Title : '{i18n>city}',
    },
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

annotate service.Goods with @(
    UI.LineItem #i18nGoods : [
        {
            $Type : 'UI.DataField',
            Value : product_productId,
            Label : '{i18n>GoodsName}',
        },
        {
            $Type : 'UI.DataField',
            Value : spaceRequired,
            Label : '{i18n>SpaceRequired}',
        },
        {
            $Type : 'UI.DataField',
            Value : state_code,
            Label : '{i18n>StockStatus}',
            Criticality : state_code,
            CriticalityRepresentation : #WithIcon,
        },
        {
            $Type : 'UI.DataField',
            Value : deliveryDate,
            Label : '{i18n>DeliveryDate}',
        },
        {
            $Type : 'UI.DataField',
            Value : cost,
            Label : '{i18n>Cost}',
        },
        {
            $Type : 'UI.DataField',
            Value : currencyCode_code,
        },
    ]
);

annotate service.Goods with {
    product @Common.Text : {
        $value : product.title,
        ![@UI.TextArrangement] : #TextOnly
    }
};

annotate service.Goods with {
    state @Common.Text : {
        $value : state.name,
        ![@UI.TextArrangement] : #TextOnly
    }
};

