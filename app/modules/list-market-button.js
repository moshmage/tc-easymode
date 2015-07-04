'use strict';

tcEasyMode.modules.listMarketButton = {
	name:'Listing: Add bulk items',
	code: 'listMarketButton',
	description: 'One-click un-stack while adding items to your market Listing',
	enabled: isModuleEnabled('listMarketButton'),
	isLocation: function() {
		return (location.href.match(/#\/p=addl/)) ? true : false;
	},
	isPresent: function() {
		return (jQuery('.add').length > 0);
	},
	initMod: function() {
		var clicked = 0;
		jQuery('.add').on('click',function(){
			var qtyData = jQuery('.available',jQuery(this).parent()).attr('data-def');
			if (qtyData > clicked) {
				clicked++;
				jQuery(this).click();
			}
			else {
				clicked = 0;
			}
		});
	}
}
