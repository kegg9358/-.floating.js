(function(){
var elems = [];
var params = [];
function Floating(elem)
{
	this.dragging = false;
	this.$elem = $(elem).addClass('floating');
	if (this.$elem.css('z-index') === 'auto') this.$elem.css('z-index', 999);

	this.offset = this.$elem.offset();
}
Floating.bind = function(elem)
{
	if ($.inArray(elem, elems) >= 0) return;

	elems.push(elem);
	var param;
	params.push(param = new Floating(elem));
	param.$elem.bind('mousedown touchstart', begin);
};

function begin(e)
{
	if ('value' in e.target) return true;
	switch (e.target.tagName.toLowerCase())
	{
		case 'label':
		case 'button':
			return true;
	}
	if ($(e.target).closest('label').length) return true;
	if ($(e.target).closest('button').length) return true;

	var index = $.inArray(this, elems);
	if (index < 0) return;
	var param = params[index];
	param.dragging = true;
	var touches = e.touches || e.originalEvent.touches || e.changedTouches;
	if (touches)
	{
		param.pageX = touches[0].pageX;
		param.pageY = touches[0].pageY;
	}
	else
	{
		param.pageX = e.pageX;
		param.pageY = e.pageY;
	}
	param.$elem.addClass('dragging');
	return false;
}
function move(e)
{
	var flg = true;
	for (var i = 0; i < params.length; i++)
	{
		var param = params[i];
		if (!param.dragging) continue;
		flg = false;

		var offset = param.$elem.offset();
		var touches = e.touches || e.originalEvent.touches || e.changedTouches;
		if (touches)
		{
			offset.left +=  touches[0].pageX - param.pageX;
			offset.top += touches[0].pageY - param.pageY;
			param.pageX = touches[0].pageX;
			param.pageY = touches[0].pageY;
		}
		else
		{
			offset.left +=  e.pageX - param.pageX;
			offset.top += e.pageY - param.pageY;
			param.pageX = e.pageX;
			param.pageY = e.pageY;
		}
		param.$elem.offset(offset);
	}
	return flg;
}
function end(e)
{
	for (var i = 0; i < params.length; i++)
	{
		var param = params[i];
		if (!param.dragging) continue;

		param.dragging = false;
		param.$elem.removeClass('dragging');
	}
}

$.fn.floating = function()
{
	if (!elems.length) $(document.body).bind('mousemove touchmove', move).bind('mouseup touchend', end);
	for (var i = 0; i < this.length; i++) Floating.bind(this[i]);

	return this;
}
})();