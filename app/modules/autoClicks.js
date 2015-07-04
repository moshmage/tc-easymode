'use strict';

tcEasyMode.modules.autoClick = {
	name: 'Several automatic clicks',
	code: 'autoClick',
	description: 'Auto clicks \'yes\' when buying from market and bazaar',
	enabled: isModuleEnabled('autoClick'),
	clicks: [
		{
			self: '.buy',
			combo: ['.yes-buy'],
			locale: [
				(location.href.match(/#\/p=shop/))
			]
		},
		{
			self: 'p.act span.buy',
			combo: ['.yes'],
			closest: '.buy-act',
			locale: [
				(location.href.match(/bazaar\.php#\/p=bazaar&userID=\d+/g))
			]
		 }
		/*{
		// BUYS ONLY ONE - Maybe make this a module?
			self: '.buy-h',
			combo: ['.yes'],
			closest: '.buy-act',
			locale: [
				(location.href.match(/bazaar\.php#\/p=bazaar&usKerID=\d+/g))
			]
		}*/
	],
	isLocation: function() {
		try {
			this.clicks.forEach(function(auto){
				auto.locale.forEach(function(isLocation,index) {
					if (isLocation) {
						throw ({string: auto.combo[index], locale: index});
					}
				});
			});
		} catch (found) {
			return true;
		}
		return false;
	},
	isPresent: function() {
		return true;
	},
	initMod: function() {
		var _own; var _target;
		var autoSelf;
		this.clicks.forEach(function(auto) {
			autoSelf = $(auto.self);
			if (autoSelf.length > 0) {
				$(auto.self).on('click',function(){
					_own = $(this);
					setTimeout(function() {
						auto.combo.forEach(function(string){
							if (auto.closest) {
								_target = $(string,_own.closest(auto.closest));
							} else {
								_target = $(string);
							}
							if (_target.length > 0) _target.click();
						});
					},500);
				});
			}
		});

//		jQuery('.buy').on('click',function(event){
//			setTimeout(function(){
//				jQuery('.yes-buy').click();
//			},500);
//		});
	}
};