'use strict';

tcEasyMode.modules.findItemsMap = {
	name: 'Find items in Map',
	code: 'findItemsMap',
	description: '.. It auto-clicks the damned thing.',
	enabled: isModuleEnabled('findItemsMap'),
	isLocation: function () {
		return (location.href.match(/#\/city\.php/));
	},
	isPresent: function () {
		return ($('[aria-label]:hidden')).length || false;
	},
	initMod: function () {
		var itemFoundWrapper;
		$('.map-cont hr').before($('<div class="title-black m-top10 top-round" role="heading" aria-level="5">Items found! :)</div><div class="cont-gray10 bottom-round tc-em-items-found" ></div>'));
		itemFoundWrapper = $('.tc-em-items-found');
		$('[aria-label]:hidden').each(function(index, ele) {
			ele.attr('src',ele.attr('src').replace(/hover=0/,'hover=1'));
			itemFoundWrapper.append($('<span>' + ele.attr('aria-label') + '</span>'));
			ele.click();
		});
	}
};