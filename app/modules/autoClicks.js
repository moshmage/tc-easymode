'use strict';

tcEasyMode.modules.autoClick = {
	name: 'Several automatic clicks',
	code: 'autoClick',
	description: 'yes on market, yes when retrieving from market, etc..',
	enabled: isModuleEnabled('autoClick'),
	isLocation: function() {
		return (location.href.match(/#\/p=shop/)) ? true : false;
	},
	isPresent: function() {
		return (jQuery('.buy').length) ? true : false;
	},
	initMod: function() {
		jQuery('.buy').on('click',function(event){
			setTimeout(function(){
				jQuery('.yes-buy').click();
			},500);
		});
	}
};