'use strict';

tcEasyMode.modules.listMarketButton = {
    name: 'Listing: Add bulk items',
    code: 'listMarketButton',
    description: 'One-click un-stack while adding items to your market Listing',
    enabled: isModuleEnabled('listMarketButton'),
    isLocation: function () {
        return (location.href.match(/#\/p=addl(.+)?/)) ? true : false;
    },
    isPresent: function () {
        return ($('.add').length > 0);
    },
    initMod: function () {
        var clicked = 0;
        $('.add').on('click', '#item-market-main-wrap', function () {
            var qtyData = $('.available', $(this).parent()).attr('data-def');
            if (qtyData > clicked) {
                clicked++;
                $(this).click();
            }
            else {
                clicked = 0;
            }
        });
    }
};
