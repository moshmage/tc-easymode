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
