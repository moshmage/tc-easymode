// ==UserScript==
// @name         TornCity - Easy Mode
// @namespace    mosh.mage
// @version      0.0.5
// @description  Torn City Tweaks
// @author       moshmage
// @include      *torn.com/*
// @grant        none
// ==/UserScript==
/**
 * Globals and Init module
 * */

 window.tcEasyMode = {};
var _timeout = new Array();
var DB_NAMES = {
	options: 'tc-easyMode-options',
	bookmarks: 'tc-easyMode-bookmarks'
};
var tcEasyMode = window.tcEasyMode;
tcEasyMode.modules = {};

/**
 * returns a JSON.parse of the provided local <storageName> or empty
 * @param storageName
 * @returns {*|{}}
 */
function localParse(storageName) {
	var storage = localStorage.getItem(storageName);
	if (storage) storage = JSON.parse(storage);
	else storage = JSON.parse("{}");
	return storage;
}

function localWrite(storageName,object) {
	localStorage.setItem(storageName,JSON.stringify(object));
}

function isModuleInStorage(item) {
	var storage = localParse(DB_NAMES.options);
	if (!storage || !storage[item]) return false;
	else return (storage[item]);
}

function isModuleEnabled(item) {
	var storage = localParse(DB_NAMES.options);
	return (storage) ? storage[item] : false;
}

function toggleMod(module) {
	var storage = localParse(DB_NAMES.options);
	storage[module] = !storage[module];
	localWrite(DB_NAMES.options,storage);
}

function newModuleToConf(module) {
	var storage = localParse(DB_NAMES.options);
	storage[module] = false;
	localWrite(DB_NAMES.options,storage);
}

function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}
tcEasyMode.init = function() {
	'use strict';

	var Options = {
		name: 'Options',
		code: 'options',
		description: 'Enable/Disable Modules',
		enabled: isModuleEnabled('options'),
		isLocation: function() { return true; },
		isPresent: function() {
			var optionsTarget = jQuery('#settings');
			if (jQuery('.tcem').length) return false;
			return (optionsTarget.length) ? true : false;
		},
		createHtml: function(module) {
			console.log('creating html for',module.code);
			var newOptModule = jQuery('<div class="clearfix prettyradio labelright  blue" style="display: block"></div>');
			var checked = (module.enabled) ? 'checked="checked"' : '';
			var theClass = (module.enabled) ? 'class="checked"' : '';
			newOptModule.append(''+
				'<input type="radio" name="tcmmOpt_'+module.code+'" id="'+module.code+'" data-label="'+module.description+'" value="" style="display: none;" '+checked+'>'+
				'<a href="#" role="radio" '+theClass+' aria-checked="false" aria-disabled="false"></a>'+
				'<label for="'+module.code+'" class="">'+module.name+'</label>'+
				'');
			jQuery('.tcem').append(newOptModule);

			jQuery('#'+module.code).on('click',function(){

				if (isModuleEnabled(jQuery(this).attr('id'))) {
					$('input',jQuery(this).parent()).removeAttr('checked');
					$('a',jQuery(this).parent()).removeClass('checked');
				}
				else {
					$('input',jQuery(this).parent()).attr('checked','checked');
					$('a',jQuery(this).parent()).addClass('checked');
				}
				toggleMod(jQuery(this).attr('id'));
				console.log('clicked opt',module.name,'enabled:',isModuleEnabled(jQuery(this).attr('id')));
			});
		},
		initMod: function() {
			var newOptions = $('<div class="chat-init has-pretty-child tcem"></div>');
			var mod, modKey;
			newOptions.append('<div class="t-gray-9 bold">TC Easy Mode</div>');
			$('#settings .chat-box-content').append(newOptions);
			for (modKey in tcEasyMode.modules) {
				mod = tcEasyMode.modules[modKey];
				if (!isModuleInStorage(mod.code)) {
					newModuleToConf(mod.code);
				}
				this.createHtml({code:mod.code,enabled:mod.enabled,name:mod.name});
			}
		}
	};

	function persistentInit(modKey) {
		var mod = tcEasyMode.modules[modKey];
		console.log(mod.name,'check',mod.isPresent());
		if (mod.isPresent() && !mod.loaded) {
			mod.loaded = true;
			mod.initMod();
			_timeout[modKey] = 5;
		}
		else {
			if (_timeout[modKey]) {
				setTimeout(function() { persistentInit(modKey) },1000);
				_timeout[modKey]--;
			}
		}
	}

	function initModules() {
		var modCount = Object.keys(tcEasyMode.modules).length;
		var mod, modKey;
		var isLoadable;
		console.log('tc-em: Found',modCount,'module(s)');
		for (modKey in tcEasyMode.modules) {
			mod = tcEasyMode.modules[modKey];
			isLoadable = (mod.isLocation() && isModuleEnabled(mod.code));
			console.log('tc-em: Loading',mod.name,'...',isLoadable,'isLocation:',mod.isLocation(),'isModuleEnabled:',isModuleEnabled(mod.code));
			if (isLoadable) {
				_timeout[modKey] = 5;
				setTimeout(persistentInit(modKey),1000);
			}
		}
	}

	return {
		initModules: initModules,
		modulesController: Options
	};
};
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
'use strict';

tcEasyMode.modules.bookmarkPlayer = {
	name: 'Bookmark Players',
	code: 'bookmarkPlayer',
	description: 'Create a list of players that are neither friends nor foe',
	enabled: isModuleEnabled(this.code),
	isLocation: function() {
		if (location.href.match(/profiles.php\?XID=(\d+)/)) {
			/* css line 'cos .. yeah */
			addGlobalStyle(".action-icon-tcem-add[data-bookm] a { background: url('http://cdn.www.torn.com/images/citymap/marker_icon/m/0/1.png') center center no-repeat; !important  }");
			addGlobalStyle(".action-icon-tcem-add[data-bookm] a:hover { background: url('http://cdn.www.torn.com/images/citymap/marker_icon/m/0/2.png') center center no-repeat; !important  }");

			addGlobalStyle(".action-icon-tcem-remove[data-bookm] a { background: url('http://cdn.www.torn.com/images/citymap/marker_icon/m/3/1.png') center center no-repeat; !important  }");
			addGlobalStyle(".action-icon-tcem-remove[data-bookm] a:hover { background: url('http://cdn.www.torn.com/images/citymap/marker_icon/m/3/2.png') center center no-repeat; !important  }");
		}

		return (jQuery('.m-lists').length > 0);
	},
	isPresent: function() {
		return true;
	},
	withPlayerProfile: function(playerId,playerName) {
		var playerBookMarkElemnt;
		var string = {};
		var players = localParse('tc-em-bplayerlist');
		var profileElement = jQuery('ul.action-list');
		var css = {};
		var playerOnList = (players[playerId]);

		string.profileListElemnt = '<li class="action-icon-tcem-;action;" data-bookm=";action;"><a title=";description;" href="#" data-id=";pid;"></a></li>';
		string.profileListElemnt = string.profileListElemnt.replace(/;pid;/g,playerId);

		if (!playerOnList) {
			string.profileListElemnt = string.profileListElemnt
				.replace(/;action;/g, 'add')
				.replace(/;description;/g, 'Add this person to regulars list');
		} else {
			string.profileListElemnt = string.profileListElemnt
				.replace(/;action;/g, 'remove')
				.replace(/;description;/g, 'Remove this person from regulars list');
		}

		playerBookMarkElemnt = jQuery(string.profileListElemnt);
		profileElement.append(playerBookMarkElemnt);

		playerBookMarkElemnt.on('click',function(){
			var players = localParse('tc-em-bplayerlist');
			var thisEle = jQuery(this);
			var action = (thisEle.attr('data-bookm') === 'remove') ? false : true;
			console.log('action',action,playerId,playerName);
			if (!action && players[playerId]) delete players[playerId];
			else if (action) players[playerId] = playerName;
			localWrite('tc-em-bplayerlist',players);
			window.location.reload();
		});

	},
	initMod: function() {
		var string = {};
		var element = {};
		var players;
		var playerName;
		var playerId;
		var isProfile = location.href.match(/profiles.php\?XID=(\d+)/);

		string.wrapper = '<li class="m-additional tcem-bookm-player"></li>';
		string.bookmarkMenu = '<div class="list-link lists"><a href="#"><i class="left"></i><span class="border-l"></span><span class="border-r"></span><span class="list-link-name lists left">Players</span></a><i class="arrow-left right"></i><div class="list-link-value right"></div><i class=""></i><div class="clear"></div></div>';
		string.playerList = '<div id="scrollbar3" class="listy"><div class="scrollbar disable" style="height: 28px;"><div class="track" style="height: 28px;"><div class="thumb" style="top: 0px; height: 28px;"><div class="end"></div></div></div></div><div class="viewport"><div class="friends overview list-flexslider" style="top: 0px;"><ul class="list-slides"><li class="slide"><ul class="list-of-people"></ul></li></ul></div></div></div>';
		string.playerLine = '<li class="online"><div class="time right"></div><a class="" href="/profiles.php?XID=;pid;">;name;</a></li>';

		element.wrapper = jQuery(string.wrapper);
		element.bookmarkMenu = jQuery(string.bookmarkMenu);
		element.playerList = jQuery(string.playerList);

		element.wrapper.append(element.bookmarkMenu);
		element.wrapper.append(element.playerList);

		jQuery('.m-lists #lists').append(element.wrapper);
		jQuery(".tcem-bookm-player .list-link.lists").on('click',function() {
			var thisEle = jQuery(this);
			thisEle.siblings('.listy').andSelf().toggleClass('list-active');
			if (!thisEle.hasClass('empty')) thisEle.tinyscrollbar({scroll: !0});
		});

		if (isProfile) {
			playerName = jQuery('a.user.name img').attr('title').replace(/\s\[\d+\]/g,'');
			playerId = isProfile[1];
			this.withPlayerProfile(playerId,playerName);
		}

		players = localParse('tc-em-bplayerlist');
		console.log('players',players);
		if (!players) {
			jQuery(".tcem-bookm-player .list-link.lists").toggleClass('empty');
		} else {
			$('.tcem-bookm-player .list-link-value').text(Object.keys(players).length);
			string.playersLine = '';
			for (playerId in players) {
				console.log('playerId',playerId,'playerName',players[playerId]);
				string.playersLine += string.playerLine
					.replace(';pid;',playerId)
					.replace(';name;',players[playerId]);
			}
			jQuery('.tcem-bookm-player ul.list-of-people').append(string.playersLine);
		}
	}
};

'use strict';
tcEasyMode.modules.fromListingToMarket = {
	name:'Listing: Links & Icons',
	code: 'fromListingToMarket',
	description: 'Adds search and graph links to listing',
	enabled: isModuleEnabled('fromListingToMarket'),
	isLocation: function() {
		return (location.href.match(/#\/p=addl/)) ? true : false;
	},
	isPresent: function() {
		return (jQuery('.desc .name').length > 0);
	},
	initMod: function() {
		var win,itemname,_this,itemid;
		jQuery('.desc .name').each(function(){
			_this = jQuery(this);
			itemname = _this.text();
			itemid = jQuery('.cost [data-id]',_this.closest('li')).attr('data-id');

			_this.parent().append('<a target="_blank" href="imarket.php#/p=shop&step=shop&type=&searchname='+itemname+'"><span class="icon-wrap right" style="padding-right:10px"><i class="trades-icon"></i></span></a>');
			_this.parent().append('<span class="view-details view-icon t-blue right c-pointer" loaded="0" href="imarket.php?step=getiteminfo" style="margin-top: 5px;"></span>');
			_this.closest('li').append('<div class="details-wrap"><div class="item-cont"><img src="/images/v2/main/ajax-loader.gif?v=1426075403940" class="ajax-placeholder left m-top10 m-bottom10"><div class="clear"></div></div></div>');
			_this.closest('li').attr('itemID',itemid);
			_this.closest('li').attr('loaded','0');

			jQuery('.view-details',_this.closest('li')).on('click',function(a){
				a.preventDefault();
				jQuery(".details-wrap").hide();
				var b = $(this).closest("li"),
					c = b.attr("itemID"),
					d = b,
					e = $(".details-wrap",$(this).closest('li'));
				if ("0" === b.attr("loaded")) {
					getAction({
						type: "post",
						action: 'imarket.php?step=getiteminfo',
						data: {
							step: "getiteminfo",
							itemID: c
						},
						success: function(a) {
							var c = JSON.parse(a),
								d = Handlebars.compile($("#main-iteminfo-template-wrap").html())(c);
							e.empty().append(d);
							b.attr("loaded", 1);
							itemInfoHandler(e);
							e.show();
							$('.desc',e).css({'width':'initial','border':'none'});
							$('.item-desc-wrap',e).hide();
							e.attr('open','1');
						}
					});
				}
				else {
					setTimeout(function(){
						if(e.attr('open')) { e.hide(); e.removeAttr('open'); }
						else { e.show(); e.attr('open','1'); }
					},300);
				}
			});
		});
		jQuery(".details-wrap").hide();
	}
}

'use strict';

tcEasyMode.modules.listMarketButton = {
	name:'Listing: Add bulk items',
	code: 'listMarketButton',
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

'use strict';

tcEasyMode.modules.travelrunData = {
	name: 'Enable travelrun data',
	code: 'travelrunData',
	isPresent: function() {
		return true;
	},
	isLocation: function() {
		return ((jQuery('.travel-home').length > 0) || (jQuery('.travel-map').length > 0));
	},
	updateTravelrun: function(myPid) {
		var shouldUpdate;
		var retryLimit = retryLimit || 2;
		var refreshTime = 10; // minutes
		var travelAgencyMarket = $('.travel-agency-market');
		var userInfo = $('.user-info');
		var date = new Date();
		var lastUpdate = localParse('tc-em-travelrun');

		if (!lastUpdate.timestamp) lastUpdate = {timestamp:date.getTime() - (refreshTime * 60 * 1000)};
		shouldUpdate = (date.getTime() - lastUpdate.timestamp >= (refreshTime * 60 * 1000));
		console.log(lastUpdate);

		if (travelAgencyMarket.length) {
			console.log('tc-em: Updating travelrun',shouldUpdate,'last',lastUpdate.timestamp,'now',date.getTime());
			if (shouldUpdate) {
				$.post('http://storage.mosh.codes/travelrun.php',{
					update: userInfo.text() + travelAgencyMarket.text(),
					pid: myPid
				}).done(function(data){
						var contentTitle = $('.content-title');
						var string = '';
						if (data.match(/Redirected/i) || data.match(/Congratulations/i)) {
							lastUpdate.timestamp = date.getTime();
							localWrite('tc-em-travelrun',lastUpdate);
							if (data.match(/Congratulations/i)) {
								var codeString = $('pre',$(data)).text();
								var message = $('h3 a',$(data)).href();
								string = '<br/><h5>You won a prize!</h5>Send a message to <a href="'+message+'">ebcdic</a> containing: '+codeString;
							}
							$('h4',contentTitle).html('Travelrun updated :)',string);
						}
						else if (--retryLimit) {
							$('h4',contentTitle).html('Failed to update travelrun <button>retry</button>');
							$('h4 button',contentTitle).on('click',function(){
								$('h4 button',contentTitle).off('click');
								tcEasyMode.modules.travelrunData().initMod();
							});
						}
					});
			}
		}
	},
	requestTravelrun: function(myPid) {
		var preventSecondClick = false;
		var travelDataLink = 'http://storage.mosh.codes/travelrun.php';
		var countries = { "south-africa": 'z', uae: 'e', china: 'x', japan: 'j', switzerland: 's',
			argentina: 'a', uk: 'u', hawaii: 'h', canada: 'c', cayman: 'i', mexico: 'm' };
		var travelWrapper = $('<div class="info-msg-cont border-round m-top10 tc-em-traveldata hide"><div class="info-msg border-round"><i class="info-icon"></i><div class="delimiter"><div class="msg right-round">Requesting Travel Run data...</div></div></div></div><hr class="page-head-delimiter m-top10 m-bottom10">');

		$('.content-wrapper').append(travelWrapper);
		$('.travel-agency').on('click','[data-race]',function(e){
			e.preventDefault();
			if (!preventSecondClick) {
				preventSecondClick = true;
				var attrCountry = $(this).attr('data-race');
				var retrieveCountry = countries[attrCountry];
				var travelDataTitle = $('.tc-em-traveldata .msg');

				travelDataTitle.text('Requesting Travel Run data...');
				$('.tc-em-traveldata').removeClass('hide');

				$.get(travelDataLink+'?c='+retrieveCountry+'&pid='+myPid,function (data) {
					preventSecondClick = false;
					if ($('.content-wrapper .itemdata').length > 0) {
						$('.content-wrapper .itemdata').html(data);
					} else {
						$('.content-wrapper').append(data);
					}
					travelDataTitle.text('Travel Run data for '+attrCountry);
				});
			}
		});

	},
	initMod: function() {
		var updateOrRetrieve = (jQuery('.travel-map').length > 0) ? 'retrieve' : 'update';
		var myPid;
		if ($('.info-name a').length > 0) myPid = $('.info-name a').attr('href').match(/XID=(\d+)/g)[0];
		else myPid =  '1870342';
		if (updateOrRetrieve === 'retrieve') {
			this.requestTravelrun(myPid);
		} else {
			this.updateTravelrun(myPid);
		}
	}
};

/**
 * Ender is responsible for the startup
 * of the whole thing :)
 */

jQuery(window).on('hashchange', function(){ tcEasyMode.init().initModules() } );

setTimeout(function(){
	tcEasyMode.init().initModules();
	tcEasyMode.init().modulesController.initMod();
},300);
 

/*
 * tc-easymode
 * v0.0.5
 * 2015-06-29
 */
console.log("TC - Easy Mode v0.0.5");