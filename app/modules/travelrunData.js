'use strict';

tcEasyMode.modules.travelrunData = {
    name: 'Travel Run Community',
    code: 'travelrunData',
    description: 'Retrieves and updates travel run at TornCentral',
    enabled: isModuleEnabled('bookmarkPlayer'),
    isPresent: function () {
        return true;
    },
    isLocation: function () {
        return ((jQuery('.travel-home').length > 0) ||
            ($('.travel-map').length > 0) ||
            ($('.travel-agency-travelling').length > 0));
    },
    updateTravelrun: function (myPid) {
        var shouldUpdate;
        var retryLimit = retryLimit || 2;
        var refreshTime = 10; // minutes
        var travelAgencyMarket = $('.users-list:visible');
        var userInfo = $('.user-info:visible');
        var date = new Date();
        var lastUpdate = localParse(DB_NAMES.travelrunData);
        var sendData;
        if (!lastUpdate.timestamp) lastUpdate = {timestamp: date.getTime() - (refreshTime * 60 * 1000)};
        shouldUpdate = (date.getTime() - lastUpdate.timestamp >= (refreshTime * 60 * 1000));

        if (travelAgencyMarket.length) {
            console.log('tc-em: Updating travelrun', shouldUpdate, 'last', lastUpdate.timestamp, 'now', date.getTime());
            if (shouldUpdate) {
                sendData = userInfo.text() + '' + travelAgencyMarket.text();
                sendData = sendData.replace(/\s+/g, ' ');
                $.post('http://travelrun.mosh.codes/travelrun.php', {
                    update: sendData,
                    pid: myPid
                }).done(function (data) {
                    var contentTitle = $('.content-title');
                    var string = '';
                    if (data.match(/Redirected/i) || data.match(/Congratulations/i)) {
                        lastUpdate.timestamp = date.getTime();
                        localWrite('tc-em-travelrun', lastUpdate);
                        if (data.match(/Congratulations/i)) {
                            data = $(data);
                            var codeString = $('pre', data).text();
                            var message = $('h3 a', data).href();
                            string = '<br/><h5>You won a prize!</h5>Send a message to <a href="' + message + '">ebcdic</a> containing: ' + codeString;
                        }
                        $('h4', contentTitle).html('Travelrun updated :)', string);
                    }
                    else if (--retryLimit) {
                        $('h4', contentTitle).html('Failed to update travelrun <button>retry</button>');
                        $('h4 button', contentTitle).on('click', function () {
                            $('h4 button', contentTitle).off('click');
                            tcEasyMode.modules.travelrunData().initMod();
                        });
                    }
                });
            }
        }
    },
    requestTravelrun: function (myPid,traveling) {
        var preventSecondClick = false;
        var travelWrapper = $('<div class="info-msg-cont border-round m-top10 tc-em-traveldata hide"><div class="info-msg border-round"><i class="info-icon"></i><div class="delimiter"><div class="msg right-round">Requesting Travel Run data...</div></div></div></div><hr class="page-head-delimiter m-top10 m-bottom10">');
        var travelDataLink = 'http://travelrun.mosh.codes/travelrun.php';
        var runWrapper = $('<div class="itemdata cont-gray bottom-round"></div>');
        var retrieveCountry, attrCountry;
        var countries = {
            "south-africa": 'z', uae: 'e', china: 'x', japan: 'j', switzerland: 's',
                argentina: 'a', uk: 'u', hawaii: 'h', canada: 'c', cayman: 'i', mexico: 'm'
        };

        var getTravelRunData = function (myPid,retrieveCountry) {
            var travelDataTitle;
            $.get(travelDataLink + '?c=' + retrieveCountry + '&pid=' + myPid, function (data) {
                var table, lastUpdateText, contentWrapper = $('.content-wrapper');
                var itemData = $('.itemdata',contentWrapper);
                attrCountry = $(this).attr('data-race');
                travelDataTitle = $('.tc-em-traveldata .msg');
                travelDataTitle.text('Requesting Travel Run data...');
                $('.tc-em-traveldata').removeClass('hide');

                data = $(data);
                table = $('table', data);
                $('tr:first-child', table).addClass('title-black');
                lastUpdateText = data.clone().children().remove().html().replace(/[()]/g, '');
                travelDataTitle.text('Last update: ' + lastUpdateText);

                if (itemData.length > 0) {
                    $('table', itemData).html(table);
                } else {
                    runWrapper.append(table);
                    contentWrapper.append(runWrapper);
                }
            });
        };

        if (traveling) {
            $('.travel-agency-travelling').append(travelWrapper);
            attrCountry = $(document.querySelector('.header.msg').classList).eq(-1)[0];
            retrieveCountry = countries[attrCountry];
            getTravelRunData(myPid,retrieveCountry);

        } else {
            $('.content-wrapper').append(travelWrapper);

            $('.travel-agency').on('click', '[data-race]', function (e) {
                e.preventDefault();
                if (!preventSecondClick) {
                    preventSecondClick = true;
                    attrCountry = $(this).attr('data-race');
                    retrieveCountry = countries[attrCountry];
                    getTravelRunData(myPid,retrieveCountry);
                }
            });

        }


    },
    initMod: function () {
        addGlobalStyle('.itemdata table {margin-top: 10px;}');
        addGlobalStyle('.itemdata table th,.itemdata table td {vertical-align:middle;}');
        addGlobalStyle('.itemdata table tr {border-bottom: 1px solid rgba(0,0,0,0.5);}');
        addGlobalStyle('.itemdata table tr:last-child {border-bottom: none;');

        var updateOrRetrieve = (jQuery('.travel-map').length > 0 || $('.travel-agency-travelling').length > 0) ? 'retrieve' : 'update';
        var orTraveling = ($('.travel-agency-travelling .inner-popup').length > 0);
        var myPid = $('.info-name a');
        var temp;
        myPid = (myPid.length > 0) ? myPid.attr('href').match(/(\d+)/g)[0] : localParse(DB_NAMES.travelrunData).pid;
        if (!myPid) myPid = "#";

        if (myPid !== '#' && localParse(DB_NAMES.travelrunData).pid !== myPid && localParse(DB_NAMES.travelrunData).pid) {
            temp = localParse(DB_NAMES.travelrunData);
            temp.pid = myPid;
            localWrite(DB_NAMES.travelrunData, temp);
        }

        if (updateOrRetrieve === 'retrieve') {
            this.requestTravelrun(myPid,orTraveling);
        } else {
            this.updateTravelrun(myPid);
        }
    }
};
