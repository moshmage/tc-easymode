'use strict';

tcEasyMode.modules.travelrunData = {
	name: 'Enable travelrun data',
	code: 'travelrunData',
	enabled: isModuleEnabled('bookmarkPlayer'),
	isPresent: function() {
		return true;
	},
	isLocation: function() {
		var travelMap = jQuery('.travel-map');
		if (travelMap.length > 0) {
			addGlobalStyle('.itemdata table {margin-top: 10px;}');
			addGlobalStyle('.itemdata table th,.itemdata table td {vertical-align:middle;}');
			addGlobalStyle('.itemdata table tr {border-bottom: 1px solid rgba(0,0,0,0.5);}');
			addGlobalStyle('.itemdata table tr:last-child {border-bottom: none;');
		}
		return ((jQuery('.travel-home').length > 0) || (travelMap.length > 0));
	},
	updateTravelrun: function(myPid) {
		var shouldUpdate;
		var retryLimit = retryLimit || 2;
		var refreshTime = 10; // minutes
		var travelAgencyMarket = $('.travel-agency-market');
		var userInfo = $('.user-info');
		var date = new Date();
		var lastUpdate = localParse(DB_NAMES.travelrunData);

		if (!lastUpdate.timestamp) lastUpdate = {timestamp:date.getTime() - (refreshTime * 60 * 1000)};
		shouldUpdate = (date.getTime() - lastUpdate.timestamp >= (refreshTime * 60 * 1000));

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
								data = $(data);
								var codeString = $('pre',data).text();
								var message = $('h3 a',data).href();
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
		var runWrapper = $('<div class="itemdata cont-gray bottom-round"></div>');
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
					var table, lastUpdateText, contentWrapper = $('.content-wrapper');
					preventSecondClick = false;
					data = $(data);
					table = $('table',data);
					$('tr:first-child',table).addClass('title-black');
					lastUpdateText = data.clone().children().remove().html().replace(/[()]/g,'');
					travelDataTitle.text('Last update: '+lastUpdateText);

					if ($('.itemdata',contentWrapper).length > 0) {
						$('.itemdata table',contentWrapper).html(table);
					} else {
						runWrapper.append(table);
						contentWrapper.append(runWrapper);
					}

				});
			}
		});

	},
	initMod: function() {
		var updateOrRetrieve = (jQuery('.travel-map').length > 0) ? 'retrieve' : 'update';
		var myPid = $('.info-name a');
		var temp;
		myPid = (myPid.length > 0)  ? myPid.attr('href').match(/(\d+)/g)[0] : localParse(DB_NAMES.travelrunData).pid;
		if (!myPid) myPid = "#";

		if (myPid !== '#' && localParse(DB_NAMES.travelrunData).pid !== myPid) {
			temp = localParse(DB_NAMES.travelrunData);
			temp.pid = myPid;
			localWrite(DB_NAMES.travelrunData,temp)
		}

		if (updateOrRetrieve === 'retrieve') {
			this.requestTravelrun(myPid);
		} else {
			this.updateTravelrun(myPid);
		}
	}
};
