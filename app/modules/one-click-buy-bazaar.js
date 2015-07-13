'use strict';

tcEasyMode.modules.oneClickBuy = {
    name: 'Several automatic clicks',
    code: 'oneClickBuy',
    description: 'Adds a button to buy one item from anyones bazaar',
    enabled: isModuleEnabled('oneClickBuy'),
    onHashChange: true,
    isLocation: function () {
        return false;
    },
    isPresent: function () {
        return true;
    },
    initMod: function () {
        var newBtn = $('<button class="tc-em oneClickBuy">buy one</button>');
        var appendLocations = $('.cena-marada');
        var _self, _closest;

        appendLocations.forEach(function(ele) {
            console.log(ele);
            newBtn.appendTo(ele);
        });

        $('.oneClickBuy').on('click',function(){
            _self = $(this);
            _closest = $('.buy-act',_self);
            $('.yes',_closest).click();
        });
    }
};