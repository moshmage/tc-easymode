// ==UserScript==
// @name         TornCity - Easy Mode
// @namespace    mosh.mage
// @version      0.0.10
// @description  Tweaks to Torn City game
// @author       moshmage
// @include      *torn.com/*
// @grant        none
// @downloadURL  http://github.com/moshmage/tc-easymode/raw/master/Torn_City_Mosh_Mods.user.js
// ==/UserScript==
function localParse(a){var b=localStorage.getItem(a);return b=b?JSON.parse(b):JSON.parse("{}")}function localWrite(a,b){localStorage.setItem(a,JSON.stringify(b))}function isModuleInStorage(a){var b=localParse(DB_NAMES.options);return b&&b[a]?b[a]:!1}function isModuleEnabled(a){var b=localParse(DB_NAMES.options);return b?b[a]:!1}function toggleMod(a){var b=localParse(DB_NAMES.options);b[a]=!b[a],localWrite(DB_NAMES.options,b)}function newModuleToConf(a){var b=localParse(DB_NAMES.options);b[a]=!1,localWrite(DB_NAMES.options,b)}function addGlobalStyle(a){var b,c;b=document.getElementsByTagName("head")[0],b&&(c=document.createElement("style"),c.type="text/css",c.innerHTML=a,b.appendChild(c))}window.tcEasyMode={};var _timeout=new Array,DB_NAMES={options:"tc-easyMode-options",bookmarks:"tc-easyMode-bookmarks",playersList:"tc-em-bplayerlist",travelrunData:"tc-em-travelrun"},tcEasyMode=window.tcEasyMode;tcEasyMode.modules={},tcEasyMode.init=function(){"use strict";function a(b){var c=tcEasyMode.modules[b];c.isPresent()&&!c.loaded?(c.loaded=!0,c.initMod(),_timeout[b]=5):_timeout[b]&&(setTimeout(function(){a(b)},1e3),_timeout[b]--)}function b(){var b,c,d,e=Object.keys(tcEasyMode.modules).length;console.log("tc-em: Found",e,"module(s)");for(c in tcEasyMode.modules)b=tcEasyMode.modules[c],d=b.isLocation()&&isModuleEnabled(b.code),console.log("tc-em: Loading",b.name,"...",d,"isLocation:",b.isLocation(),"isModuleEnabled:",isModuleEnabled(b.code)),d&&(_timeout[c]=5,setTimeout(a(c),1e3))}var c={name:"Options",code:"options",description:"Enable/Disable Modules",enabled:isModuleEnabled("options"),isLocation:function(){return!0},isPresent:function(){var a=jQuery("#settings");return jQuery(".tcem").length?!1:a.length?!0:!1},createHtml:function(a){var b=jQuery('<div class="clearfix prettyradio labelright  blue" style="display: block"></div>'),c=a.enabled?'checked="checked"':"",d=a.enabled?'class="checked"':"";b.append('<input type="radio" name="tcmmOpt_'+a.code+'" id="'+a.code+'" data-label="'+a.description+'" value="" style="display: none;" '+c+'><a href="#" role="radio" '+d+' aria-checked="false" aria-disabled="false"></a><label for="'+a.code+'" class="">'+a.name+"</label>"),jQuery(".tcem").append(b),jQuery("#"+a.code).on("click",function(){isModuleEnabled(jQuery(this).attr("id"))?($("input",jQuery(this).parent()).removeAttr("checked"),$("a",jQuery(this).parent()).removeClass("checked")):($("input",jQuery(this).parent()).attr("checked","checked"),$("a",jQuery(this).parent()).addClass("checked")),toggleMod(jQuery(this).attr("id"))})},initMod:function(){var a,b,c=$('<div class="chat-init has-pretty-child tcem"></div>');c.append('<div class="t-gray-9 bold">TC Easy Mode</div>'),$("#settings .chat-box-content").append(c);for(b in tcEasyMode.modules)a=tcEasyMode.modules[b],isModuleInStorage(a.code)||newModuleToConf(a.code),this.createHtml({code:a.code,enabled:a.enabled,name:a.name})}};return{initModules:b,modulesController:c}},tcEasyMode.modules.autoClick={name:"Several automatic clicks",code:"autoClick",description:"yes on market, yes when retrieving from market, etc..",enabled:isModuleEnabled("autoClick"),isLocation:function(){return location.href.match(/#\/p=shop/)?!0:!1},isPresent:function(){return jQuery(".buy").length?!0:!1},initMod:function(){jQuery(".buy").on("click",function(a){setTimeout(function(){jQuery(".yes-buy").click()},500)})}},tcEasyMode.modules.bookmarkPlayer={name:"Bookmark Players",code:"bookmarkPlayer",description:"Create a list of players that are neither friends nor foe",enabled:isModuleEnabled("bookmarkPlayer"),isLocation:function(){return location.href.match(/profiles.php\?XID=(\d+)/)&&(addGlobalStyle(".action-icon-tcem-add[data-bookm] a { background: url('http://cdn.www.torn.com/images/citymap/marker_icon/m/0/1.png') center center no-repeat; !important  }"),addGlobalStyle(".action-icon-tcem-add[data-bookm] a:hover { background: url('http://cdn.www.torn.com/images/citymap/marker_icon/m/0/2.png') center center no-repeat; !important  }"),addGlobalStyle(".action-icon-tcem-remove[data-bookm] a { background: url('http://cdn.www.torn.com/images/citymap/marker_icon/m/3/1.png') center center no-repeat; !important  }"),addGlobalStyle(".action-icon-tcem-remove[data-bookm] a:hover { background: url('http://cdn.www.torn.com/images/citymap/marker_icon/m/3/2.png') center center no-repeat; !important  }")),jQuery(".m-lists").length>0},isPresent:function(){return!0},withPlayerProfile:function(a,b){var c,d={},e=localParse(DB_NAMES.playersList),f=jQuery("ul.action-list"),g=e[a];d.profileListElemnt='<li class="action-icon-tcem-;action;" data-bookm=";action;"><a title=";description;" href="#" data-id=";pid;"></a></li>',d.profileListElemnt=d.profileListElemnt.replace(/;pid;/g,a),g?d.profileListElemnt=d.profileListElemnt.replace(/;action;/g,"remove").replace(/;description;/g,"Remove this person from regulars list"):d.profileListElemnt=d.profileListElemnt.replace(/;action;/g,"add").replace(/;description;/g,"Add this person to regulars list"),c=jQuery(d.profileListElemnt),f.append(c),c.on("click",function(){var c=localParse(DB_NAMES.playersList),d=jQuery(this),e="remove"!==d.attr("data-bookm");!e&&c[a]?delete c[a]:e&&(c[a]=b),localWrite("tc-em-bplayerlist",c),window.location.reload()})},initMod:function(){var a,b,c,d={},e={},f=location.href.match(/profiles.php\?XID=(\d+)/);if(d.wrapper='<li class="m-additional tcem-bookm-player"></li>',d.bookmarkMenu='<div class="list-link lists"><a href="#"><i class="left"></i><span class="border-l"></span><span class="border-r"></span><span class="list-link-name lists left">Players</span></a><i class="arrow-left right"></i><div class="list-link-value right"></div><i class=""></i><div class="clear"></div></div>',d.playerList='<div id="scrollbar3" class="listy"><div class="scrollbar disable" style="height: 28px;"><div class="track" style="height: 28px;"><div class="thumb" style="top: 0px; height: 28px;"><div class="end"></div></div></div></div><div class="viewport"><div class="friends overview list-flexslider" style="top: 0px;"><ul class="list-slides"><li class="slide"><ul class="list-of-people"></ul></li></ul></div></div></div>',d.playerLine='<li class="online"><div class="time right"></div><a class="" href="/profiles.php?XID=;pid;">;name;</a></li>',e.wrapper=jQuery(d.wrapper),e.bookmarkMenu=jQuery(d.bookmarkMenu),e.playerList=jQuery(d.playerList),e.wrapper.append(e.bookmarkMenu),e.wrapper.append(e.playerList),$(".m-lists #lists").append(e.wrapper),e.wrapper=$(".tcem-bookm-player"),$(".list-link.lists",e.wrapper).on("click",function(){var a=jQuery(this);a.siblings(".listy").andSelf().toggleClass("list-active"),a.hasClass("empty")||a.tinyscrollbar({scroll:!0})}),f&&(b=$("a.user.name img").attr("title").replace(/\s\[\d+\]/g,""),c=f[1],this.withPlayerProfile(c,b)),a=localParse(DB_NAMES.playersList)){$(".list-link-value",e.wrapper).text(Object.keys(a).length),d.playersLine="";for(c in a)d.playersLine+=d.playerLine.replace(";pid;",c).replace(";name;",a[c]);$("ul.list-of-people",e.wrapper).append(d.playersLine)}else $(".list-link.lists",e.wrapper).toggleClass("empty")}},tcEasyMode.modules.fromListingToMarket={name:"Listing: Links & Icons",code:"fromListingToMarket",description:"Adds search and graph links to listing",enabled:isModuleEnabled("fromListingToMarket"),isLocation:function(){return location.href.match(/#\/p=addl/)?!0:!1},isPresent:function(){return jQuery(".desc .name").length>0},initMod:function(){var a,b,c;jQuery(".desc .name").each(function(){b=jQuery(this),a=b.text(),c=jQuery(".cost [data-id]",b.closest("li")).attr("data-id"),b.parent().append('<a target="_blank" href="imarket.php#/p=shop&step=shop&type=&searchname='+a+'"><span class="icon-wrap right" style="padding-right:10px"><i class="trades-icon"></i></span></a>'),b.parent().append('<span class="view-details view-icon t-blue right c-pointer" loaded="0" href="imarket.php?step=getiteminfo" style="margin-top: 5px;"></span>'),b.closest("li").append('<div class="details-wrap"><div class="item-cont"><img src="/images/v2/main/ajax-loader.gif?v=1426075403940" class="ajax-placeholder left m-top10 m-bottom10"><div class="clear"></div></div></div>'),b.closest("li").attr("itemID",c),b.closest("li").attr("loaded","0"),jQuery(".view-details",b.closest("li")).on("click",function(a){a.preventDefault(),jQuery(".details-wrap").hide();var b=$(this).closest("li"),c=b.attr("itemID"),d=$(".details-wrap",$(this).closest("li"));"0"===b.attr("loaded")?getAction({type:"post",action:"imarket.php?step=getiteminfo",data:{step:"getiteminfo",itemID:c},success:function(a){var c=JSON.parse(a),e=Handlebars.compile($("#main-iteminfo-template-wrap").html())(c);d.empty().append(e),b.attr("loaded",1),itemInfoHandler(d),d.show(),$(".desc",d).css({width:"initial",border:"none"}),$(".item-desc-wrap",d).hide(),d.attr("open","1")}}):setTimeout(function(){d.attr("open")?(d.hide(),d.removeAttr("open")):(d.show(),d.attr("open","1"))},300)})}),jQuery(".details-wrap").hide()}},tcEasyMode.modules.listMarketButton={name:"Listing: Add bulk items",code:"listMarketButton",enabled:isModuleEnabled("listMarketButton"),isLocation:function(){return location.href.match(/#\/p=addl/)?!0:!1},isPresent:function(){return jQuery(".add").length>0},initMod:function(){var a=0;jQuery(".add").on("click",function(){var b=jQuery(".available",jQuery(this).parent()).attr("data-def");b>a?(a++,jQuery(this).click()):a=0})}},tcEasyMode.modules.travelrunData={name:"Enable travelrun data",code:"travelrunData",enabled:isModuleEnabled("bookmarkPlayer"),isPresent:function(){return!0},isLocation:function(){var a=jQuery(".travel-map");return a.length>0&&(addGlobalStyle(".itemdata table {margin-top: 10px;}"),addGlobalStyle(".itemdata table th,.itemdata table td {vertical-align:middle;}"),addGlobalStyle(".itemdata table tr {border-bottom: 1px solid rgba(0,0,0,0.5);}"),addGlobalStyle(".itemdata table tr:last-child {border-bottom: none;")),jQuery(".travel-home").length>0||a.length>0},updateTravelrun:function(a){var b,c=c||2,d=10,e=$(".travel-agency-market"),f=$(".user-info"),g=new Date,h=localParse(DB_NAMES.travelrunData);h.timestamp||(h={timestamp:g.getTime()-60*d*1e3}),b=g.getTime()-h.timestamp>=60*d*1e3,e.length&&(console.log("tc-em: Updating travelrun",b,"last",h.timestamp,"now",g.getTime()),b&&$.post("http://storage.mosh.codes/travelrun.php",{update:f.text()+e.text(),pid:a}).done(function(a){var b=$(".content-title"),d="";if(a.match(/Redirected/i)||a.match(/Congratulations/i)){if(h.timestamp=g.getTime(),localWrite("tc-em-travelrun",h),a.match(/Congratulations/i)){a=$(a);var e=$("pre",a).text(),f=$("h3 a",a).href();d='<br/><h5>You won a prize!</h5>Send a message to <a href="'+f+'">ebcdic</a> containing: '+e}$("h4",b).html("Travelrun updated :)",d)}else--c&&($("h4",b).html("Failed to update travelrun <button>retry</button>"),$("h4 button",b).on("click",function(){$("h4 button",b).off("click"),tcEasyMode.modules.travelrunData().initMod()}))}))},requestTravelrun:function(a){var b=!1,c="http://storage.mosh.codes/travelrun.php",d={"south-africa":"z",uae:"e",china:"x",japan:"j",switzerland:"s",argentina:"a",uk:"u",hawaii:"h",canada:"c",cayman:"i",mexico:"m"},e=$('<div class="info-msg-cont border-round m-top10 tc-em-traveldata hide"><div class="info-msg border-round"><i class="info-icon"></i><div class="delimiter"><div class="msg right-round">Requesting Travel Run data...</div></div></div></div><hr class="page-head-delimiter m-top10 m-bottom10">'),f=$('<div class="itemdata cont-gray bottom-round"></div>');$(".content-wrapper").append(e),$(".travel-agency").on("click","[data-race]",function(e){if(e.preventDefault(),!b){b=!0;var g=$(this).attr("data-race"),h=d[g],i=$(".tc-em-traveldata .msg");i.text("Requesting Travel Run data..."),$(".tc-em-traveldata").removeClass("hide"),$.get(c+"?c="+h+"&pid="+a,function(a){var c,d,e=$(".content-wrapper");b=!1,a=$(a),c=$("table",a),$("tr:first-child",c).addClass("title-black"),d=a.clone().children().remove().html().replace(/[()]/g,""),i.text("Last update: "+d),$(".itemdata",e).length>0?$(".itemdata table",e).html(c):(f.append(c),e.append(f))})}})},initMod:function(){var a,b=jQuery(".travel-map").length>0?"retrieve":"update",c=$(".info-name a");c=c.length>0?c.attr("href").match(/(\d+)/g)[0]:localParse(DB_NAMES.travelrunData).pid,c||(c="#"),"#"!==c&&localParse(DB_NAMES.travelrunData).pid!==c&&(a=localParse(DB_NAMES.travelrunData),a.pid=c,localWrite(DB_NAMES.travelrunData,a)),"retrieve"===b?this.requestTravelrun(c):this.updateTravelrun(c)}},jQuery(window).on("hashchange",function(){tcEasyMode.init().initModules()}),setTimeout(function(){tcEasyMode.init().initModules(),tcEasyMode.init().modulesController.initMod()},300); 

/*
 * tc-easymode
 * v0.0.10
 * 2015-06-29
 */
console.log("TC - Easy Mode v0.0.10");