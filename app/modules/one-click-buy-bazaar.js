'use strict';

tcEasyMode.modules.oneClickBuy = {
    name: 'One click buy',
    code: 'oneClickBuy',
    description: 'Adds a button to buy one item from anyones\' bazaar',
    enabled: isModuleEnabled('oneClickBuy'),
    onHashChange: true,
    isLocation: function () {
        return !!(location.href.match(/bazaar\.php/));
    },
    isPresent: function () {
        return ($('[aria-label]:hidden').length > 0);
    },
    initMod: function () {
        var newBtn = $('<span class="tc-em oneClickBuy">buy one</span>');
        var appendLocations = $('.items-list .desc .stock');

        addGlobalStyle('.tc-em.oneClickBuy { cursor: pointer; }');
        newBtn.appendTo(appendLocations);

        $('.oneClickBuy').on('click',function(){
            $('.yes',$(this).closest('li')).click();
        });

    }
};