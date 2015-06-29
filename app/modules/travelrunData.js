'use strict';

tcEasyMode.modules.travelrunData = {
	name: 'Enable travelrun data',
	code: 'travelrunData',
	enabled: isModuleEnabled('bookmarkPlayer'),
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
		var lastUpdate = localParse(DB_NAMES.travelrunData);

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
		var myPid = $('.info-name a');
		if (myPid.length > 0) myPid = myPid.attr('href').match(/XID=(\d+)/g)[0];
		else myPid =  localParse();
		if (updateOrRetrieve === 'retrieve') {
			this.requestTravelrun(myPid);
		} else {
			this.updateTravelrun(myPid);
		}
	}
};
