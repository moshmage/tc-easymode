'use strict';

tcEasyMode.modules.bookmarkPlayer = {
	name: 'Bookmark Players',
	code: 'bookmarkPlayer',
	description: 'Create a list of players that are neither friends nor foe',
	enabled: isModuleEnabled('bookmarkPlayer'),
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
		var players = localParse(DB_NAMES.playersList);
		var profileElement = jQuery('ul.action-list');
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
			var players = localParse(DB_NAMES.playersList);
			var thisEle = jQuery(this);
			var action = (thisEle.attr('data-bookm') !== 'remove');
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

		$('.m-lists #lists').append(element.wrapper);
		element.wrapper = $(".tcem-bookm-player");

		$(".list-link.lists",element.wrapper).on('click',function() {
			var thisEle = jQuery(this);
			thisEle.siblings('.listy').andSelf().toggleClass('list-active');
			if (!thisEle.hasClass('empty')) thisEle.tinyscrollbar({scroll: !0});
		});

		if (isProfile) {
			playerName = $('a.user.name img').attr('title').replace(/\s\[\d+\]/g,'');
			playerId = isProfile[1];
			this.withPlayerProfile(playerId,playerName);
		}

		players = localParse(DB_NAMES.playersList);
		if (!players) {
			$(".list-link.lists",element.wrapper).toggleClass('empty');
		} else {
			$('.list-link-value',element.wrapper).text(Object.keys(players).length);
			string.playersLine = '';
			for (playerId in players) {
				string.playersLine += string.playerLine
					.replace(';pid;',playerId)
					.replace(';name;',players[playerId]);
			}
			$('ul.list-of-people',element.wrapper).append(string.playersLine);
		}
	}
};
