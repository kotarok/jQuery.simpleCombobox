$.Combobox = function(elem,options,param){

	var c = {
		length: 7
	}
	$.extend(c,param)

	if($('#selectForCombobox').size()){
		var select = $('#selectForCombobox');
	}else{
		var select = $('<select id="selectForCombobox" />').attr('size',(options.length>c.length)?c.length:options.length)
	}

	var makeList = function(options){

		$.each(options,function(){
			select.append('<option value="' + this + '">' + this + '</option>')
		})

		select
			.bind('blur.combobox',hideList)
			.bind('click.combobox',setValue)
			.bind('keydown.combobox',function(e){
				if(e.keyCode == '13'){ // Enter
					setValue()
				}
				if(e.keyCode == 38 && $('option:first-child',this).attr('selected')){ // Up
					hideList()
					focusBack();
				}
			})
			.mouseover(function(){
				elem.unbind('blur.combobox')
			})
			.mouseout(function(){
				elem.bind('blur.combobox',hideList)
			})

		return select;
	}
	
	var showList = function(){

		var width = elem.width() + parseInt(elem.css('padding-left')) + parseInt(elem.css('padding-right')) + parseInt(elem.css('border-right-width')) + parseInt(elem.css('border-left-width'));
		var specimen = $('body').find('>:first-child');
		var offset = elem.offset();
		offset.top = offset.top + elem.height() + parseInt(elem.css('padding-top')) + parseInt(elem.css('padding-bottom')) + parseInt(elem.css('border-top-width')) + parseInt(elem.css('border-bottom-width'));

		select
			.empty()
			.css("width", "auto")
			.css("visibility", "visible");

		var list = makeList(options);
		list
			.css({
				position: 'absolute',
				top:      offset.top,
				left:     offset.left,
				width:    width
			})
			.val(elem.val())
			.appendTo('body')
			.bind('blur.combobox',hideList)

		if(width < select.width()){
			width = select.width();
		}
		
	}
	
	var hideList = function(){
		select.remove()
		elem
			.bind('blur.combobox',hideList)
	}
	
	var focusBack = function(){
		elem
			.unbind('focus.combobox')
			.focus()
			.bind('focus.combobox',showList)
	}

	var setValue = function(){
		hideList();
		focusBack();
		if(elem.val() != select.val()){
			elem
				.val(select.val())
				.trigger("change")
		}
	}

	var setEvent= function(){
		elem
			.bind('focus.combobox click.combobox',showList)
			.bind('blur.combobox',hideList)
			.bind('keydown.combobox',function(e){
				if(e.keyCode == 40){ // Down
					showList()
					select.focus()
				}
				if(e.keyCode == 27){ // Esc
					hideList()
				}
			})
	}

	setEvent();
}	

$.fn.combobox = function(options){
	return this.each(function(){
		new $.Combobox($(this),options);
	});
};
