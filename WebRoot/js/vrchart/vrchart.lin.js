(function(){

if(!window['VRCHART']){ window['VRCHART'] = {}; }
if(VRCHART.Panel$lin$){ return; }

//曲线应用
VRCHART.Panel$lin$ = {
	apps: [],
	show: function(container, data, config){
		if(arguments.length < 2){ return; }
		var container = arguments[0];
		var data = arguments[1];
		var config = arguments[2];
		container = typeof(container)=='string' ? document.getElementById(container) : container;
		if(!container || !data){ return; }
		this.detroyByContainer(container);
		return this.add(new Panel$lin$app(container, data, config));
	},
	detroyByContainer: function(container){
		for(var i=0; i<this.apps.length; i++){
			var app = this.apps[i];
			if(app.container == container){
				app.clear();
				this.apps.splice(i, 1);
				break;	
			}	
		}
	},
	add: function(app){
		this.apps.push(app);
		return app;
	}
}

var Panel$lin$app = function(container, data, config){
	this.container = container;
	this.data =  data;
	this.trendconfig = config;
	this.control =  null;
	this.init();
}
Panel$lin$app.prototype = {
	config: {
		maxlen: 3
	},

	init: function(){
		try{ 
			this.data = (typeof(this.data) == 'string') ? eval('('+ this.data +')') : this.data; 
		}catch(e){ 
			return this.showError('数据错误'); 
		}
		if(!this.data.length && typeof(this.data.splice) != 'function'){ return this.showError('数据错误'); }
		if(this.data.length>this.config.maxlen){ this.data.splice(this.config.maxlen-1, this.data.length-this.config.maxlen); }
		if(!this.data || !this.data.length){ return this.showError('暂无数据'); }
		this.draw();
	},

	showError: function(msg){
		this.container.innerHTML = '<div class="charterror">'+ msg + '</div>';
		return this;
	},
	
	getViewInfo: function(){
		try{
			return this.trend.getViewInfo();
		}catch(e){
			return {"error": 1};	
		}
	},
	
	getViewInfoJSON: function(){
		try{
			return this.trend.getViewInfoJSON();
		}catch(e){
			return '{"error": 1}';	
		}
	},
	
	getImageInfo: function(){
		try{
			return this.trend.getImageInfo();
		}catch(e){
			return {"error": 1};	
		}
	},
	
	getImageInfoJSON: function(){
		try{
			return this.trend.getImageInfoJSON();
		}catch(e){
			return '{"error": 1}';	
		}
	},
		
	draw: function(){
		this.clear();
		var data = this.data;
		
		this.control = document.createElement('div');
		this.control.className = 'chartlin';
		this.container.appendChild(this.control);
		
		var dataview = document.createElement('div');
		dataview.className = 'chartlin_view';
		this.control.appendChild(dataview);
		this.trend = new LinTrend(dataview, data, this.trendconfig);
		
		return this;
	},
	
	clear: function(){
		if(this.trend){
			this.trend.destroy();
		}
		this.container.innerHTML = '';
		return true;
	}
}

var LinTrend = function(container, data, config){
	this.config = { 
		paperwidth	: 610,
		labelheight	: 22,
		paperpadding		: 18,
		yaverage	: 5,
		linewidth 	: 2,
		lineopacity	: 0.5,
		groups 		: [
						{'key': 'vv', 'value': '流畅'}
					  ],
		gridwidth	: 560,			  
		gridheight	: 130,
		xmarkheight	: 20,
		rangemarkheight: 36,
		gridcolor	: '#eeeeee',
		splitcolor	: '#e5e5e5',
		labelcolor 	: '#333333',
		xmarkcolor	: '#999999',
		ymarkcolor	: '#999999',
		textcolor	: '#333333',
		readpanelopacity: 0.8,
		readpanelbgcolor: '#ffffff',
		readpanelbordercolor: '#bbbbbb',
		readlinecolor : '#e5e5e5',
		linecolor	: ['#0488ee', '#cc3333', '#009900'],
		viewtypes: {'week': '1周', 'month': '1月', 'quarter': '1季度', 'halfyear': '半年', 'year': '1年', 'all': '全部'},
		viewtype: 'month',
		showavgline: false,
		date_end: ''
	}
	this.allowkey = ['name'];//除核心比较数据外被允许的附属信息key
	this.container = arguments[0];
	if(!this.container){ return; }
	this.data = arguments[1] ? arguments[1] : [];
	if(!this.data.length){ return; }
	this.config = typeof(arguments[2]) == 'object' 
	? mergeConfig(this.config, config)
	: this.config;
	
	this.paper	= null;
	this.groups = [];
	this.xmark = null;
	this.averhandle = {};
	this.buttons = {};
	this.rangemark = {};
	this.rangeall = {};
	this.view_type = 'month';
	this.view_date_end = 0;
	this.view_date_start = 0;
	this.view_count = 0;
	this.view_group = null;
    this.is_drawline_over = false;
	this.is_touchOS = ("createTouch" in document);
	this.nulls = {};
	
	this.init();		
}

LinTrend.prototype = {
	init: function(){
		//重新处理数据	
		this.data = this.formatData(this.data);
		this.rangeall = this.getDateRangeFromAllData();
		this.data = this.unifyRange(this.data);
		
		//配置有效性
		if(this.config.gridwidth > this.config.paperwidth){ this.config.gridwidth = this.config.paperwidth; }
		//表格宽度预留
		this.config.gridwidth = this.config.paperwidth - 50;
		//检测结束日期
		if(this.config.date_end){
			this.config.date_end = this._checkdate(this.config.date_end) ? this.config.date_end : '';
		}
		//检测视图类型
		if(this.config.viewtype){
			this.view_type = this._checkviewtye(this.config.viewtype) ? this.config.viewtype : this.view_type;	
		}
		
		this.view_date_end =  this.config.date_end ? this._convertTime(this.config.date_end) : this.rangeall.end;
		this.view_count		= this.getUnitByViewtype(this.view_type);
		
		this.draw();
		
	},
	
	destroy: function(){
		this.paper.clear();
	},
	
	getViewInfo: function(){
		var shows = [];
		for(var i=0; i<this.data.length; i++){
			shows.push(this.data[i].name);	
		}
		return {
			'shownames' 	: shows,
			'date_start'	: this._convertDate(this.view_date_start),
			'date_end'		: this._convertDate(this.view_date_end),
			'viewtype'		: this.view_type,
			'showavgline'	: this.config.showavgline
		}
	},
	
	getViewInfoJSON: function(){
		var info = this.getViewInfo();
		for(var i=0; i<info.shownames.length; i++){ info.shownames[i] = '"'+ info.shownames[i] +'"' }
		info.shownames = info.shownames.join(','); 
		var json = '{\n'
			+ '"shownames"		: ['+ info.shownames +'],\n'
			+ '"date_start"		: "'+ info.date_start +'",\n'
			+ '"date_end"		: "'+ info.date_end +'",\n'
			+ '"viewtype"		: "' + info.viewtype + ',"\n'
			+ '"showavgline"	: ' + (info.showavgline ? 'true' : 'false') + '\n'
			+ '}';
		return json;	
	},
	
	getImageInfo: function(){
		return {
			'type' : Raphael.vml ? 'vml' : 'svg',
			'data' : Raphael.vml ? (
					'<!DOCTYPE HTML>'
					+'<html>'
					+'<head>'
					+'<meta http-equiv="Content-Type" content="text/html; charset=utf-8">'
					+'</head>'
					+'<body>'
					+ this.container.innerHTML
					+'</body>'
					+'</html>'
					)	
					: this.container.innerHTML
		}            
	},
	
	getImageInfoJSON: function(){
		var imageinfo = this.getImageInfo();
		var json = '{\n'
				 + '"type": "' + imageinfo.type + '",\n'
				 + '"data": \'' + imageinfo.data + '\'\n'
				 + '}';
		return json; 
	},
	
	draw: function(){
		this.drawPaper();
		this.drawGroups();
		this.drawNames();
		this.drawButtons();
		this.drawRangemark();
		this.drawXmark();
		this.drawAverhandle();
		//test end {'viewend': '2012-01-02'}
		this.drawData();
		return this;
	},
	
	drawPaper: function(){
		var grouplength = this.config.groups.length;
		var gridheight 	= this.config.gridheight;
		var labelheight = this.config.labelheight;
		var xmarkheight = this.config.xmarkheight;
		var rangemarkheight = this.config.rangemarkheight;
		var paperwidth = this.config.paperwidth;
		var paperpadding = this.config.paperpadding;		
		var paperheight = paperpadding*2 + grouplength*(labelheight + gridheight) + xmarkheight + rangemarkheight;
		
		this.paper = Raphael(
			this.container,
			paperwidth,
			paperheight
		);	
		
		return this;
	},
	
	drawLine: function(needanimate){

		var needanimate = arguments[0] === false ? false : true;
		var paperwidth =  this.config.paperwidth;
		var gridwidth = this.config.gridwidth;
		var gridheight = this.config.gridheight;
		var linewidth = this.config.linewidth;
		var lineopacity = this.config.lineopacity;
		
		var view_ux = gridwidth/this.view_count;
		for(var i=0; i<this.groups.length; i++){
			var group 	= this.groups[i]; 
			var groupkey = group.key;
			var ystart 	= group.ystart;
			var data	= group.viewdata;
			for(var j=0; j<data.length; j++){
				var patharr = [];				
				var pathstring = '';
				var linecolor = this.getColorByIndex(j);
				var d = data[j];
				for(var k=0, len=d.length; k<len; k++){
					if(d[k].value != -1){ //绘制有效的值
						var x = paperwidth - gridwidth + view_ux * k;
						var y = ystart + gridheight*(1-d[k].value/group.level);
						patharr.push('L', x, y);
					}
				}
				patharr.shift(); patharr.unshift('M');
				pathstring = patharr.join(' ');
				
				var line = group.lines[j];
				if(!line){
					line = this.paper.path(pathstring).attr({
						'stroke'			: linecolor,
						'stroke-width' 		: linewidth,
						'stroke-opacity'	: lineopacity,
						'stroke-linecap'	: 'round',
						'stroke-linejoin'	: 'round'
					});
					group.lines.push(line);	
				}else{
                    if(!needanimate){
                        line.attr({
                            'path': pathstring
                        });
                    }else{
                        line.stop().animate({
                            'path': pathstring
                        }, 400, 'linear');
                    }
				}
			}
			
			if(group.dragpanel){ this.hideReadinfo(group); }
			
			this.updateYmark(group);
			
		}
		return this;
	},
	
	drawAverLine: function(){
		var paperwidth =  this.config.paperwidth;
		var gridwidth = this.config.gridwidth;
		var gridheight = this.config.gridheight;
		var linewidth = this.config.linewidth;
		var lineopacity = this.config.lineopacity;
		
		for(var i=0; i<this.groups.length; i++){
			var group 	= this.groups[i]; 
			var groupkey = group.key;
			var xstart 	= group.xstart;
			var ystart 	= group.ystart;
			var data	= group.viewdata;
			for(var j=0; j<data.length; j++){				
				var pathstring = '';
				var linecolor = this.getColorByIndex(j);
				var d = data[j];
				var aver = this.getAverFromData(d);
				var x = xstart;
				var y = ystart + gridheight*(1-aver/group.level);
				var patharr = [];
				while(x<=paperwidth){
					patharr.push('M', x, y, 'L', x+5, y)
					x += 8;
				}
				
				var pathstring = patharr.join(' ');
				var line = group.averlines[j];
				if(!line){
					line = this.paper.path(pathstring).attr({
						'stroke'			: linecolor,
						'stroke-width' 		: 1
					});
					group.averlines.push(line);	
				}else{
					line.attr({
						'path': pathstring
					});
				}
				
				if(this.config.showavgline){ line.show();	 }else{ line.hide(); }
			}
			
		}
		return this;
	},

		
	drawData: function(params){
		
        //off-----------------------------
        this.is_drawline_over = false;
        
		var params = typeof(arguments[0])=='object' ? arguments[0] : {}; 
		
		var paperwidth = this.config.paperwidth;
		var gridwidth = this.config.gridwidth;
		var gridheight = this.config.gridheight;
		var viewtype   = params.viewtype ? params.viewtype : this.view_type;
		var viewend	   = params.viewend 
                        ? (typeof(params.viewend)=='number' ? params.viewend : this._convertTime(params.viewend)) 
                        : this.view_date_end;
        var needanimate = params.needanimate === false ? false : true;
        
		if(this.view_date_end > this.rangeall.end//结束日期仅允许在有效区间内
			|| viewtype == 'all'){ //全部视图调整视区结束
		viewend = this.rangeall.end; }
		
		this.view_count 		= this.getUnitByViewtype(viewtype);
		this.view_date_end 		= viewend;
		this.view_date_start 	= this.view_date_end - this.view_count*MS;
				
		this.view_range			= {'start': this.view_date_start, 'end': this.view_date_end }
		
		//集中获取数据
		this.view_data 			= this.getDataFromRange(this.view_range);
		
		
		//优先更新小信息
		this.updateRangemark(this.view_range);
		this.updateXmark(this.view_range, viewtype)
		//集中绘制曲线
		
		//按组分配信息
		for(var i=0; i<this.groups.length; i++){
			var group =this.groups[i];
			var groupkey = group.key;
			group.viewdata = this.view_data[groupkey];
			group.viewdata_max = this.getMaxFromData(group.viewdata);
			group.childlength = group.viewdata.length;
			group.level = this.getLevelByMax(group.viewdata_max);
			group.viewrange = this.view_range;
		}
		
        //zindex ?
		this.drawLine(needanimate);
        this.drawAverLine();
		
		for(var i=0; i<this.groups.length; i++){
			var group =this.groups[i];
			if(!group.dragpanel){
				this.addReadInfoToGroup(group);
			}
		}
		
		this.view_type 	= viewtype;
        
        //on-----------------------------
        this.is_drawline_over = true;
        
		return this;
	},
  
	drawAverhandle: function(){
		var x = this.config.paperwidth;
		var y = (this.config.groups.length) * (this.config.labelheight + this.config.gridheight) + this.config.xmarkheight +　this.config.paperpadding + 21;
		var style = {
			'fill': this.config.labelcolor,
			'cursor': 'pointer',
			'font-size': 12,
			'font-family': 'Arial',
			'text-anchor': 'end'	
		};
		
		this.averhandle.label = this.paper.text(x, y, '显示均值线').attr(style);
		this.averhandle.checkbox = this.paper.set();
		
		var bbox = this.averhandle.label.getBBox();
		
		var box_w = 12;
		var box_h = 12;
		var box_x = bbox.x - box_w - 5;
		var box_y = bbox.y + 2;
		
		var pathinner = ['M', box_x+11, box_y+1, 'L', box_x+1, box_y+1, 'L', box_x+1, box_y+11].join(' ');
		var pathchcek = ['M', box_x+3, box_y+6, 'L', box_x+5, box_y+9, 'L', box_x+9, box_y+2].join(' ');
		
		var box = this.paper.rect(box_x, box_y, box_w, box_h).attr({
			'cursor': 'pointer',
			'fill'	: '#ffffff',
			'stroke': '#7c7c7c',
			'stroke-width': 0.5
		});
		
		var box_inner = this.paper.path(pathinner).attr({
			'cursor': 'pointer',
			'stroke': '#414141',
			'stroke-width': 1
		});
		
		var checkicon = this.paper.path(pathchcek).attr({
			'cursor': 'pointer',
			'stroke': '#333',
			'stroke-width': 2
		});
		
		if(!this.config.showavgline){
			checkicon.hide();
		}
		
		this.averhandle.checkbox.push(box, box_inner, checkicon);
		
		var _this = this;
		var f_control = function(){
			if(_this.config.showavgline){
				checkicon.hide();
				_this.hideAverline();
			}else{
				checkicon.show();
				_this.showAverline();
			}	
			return false;
		}
		
		this.averhandle.label.click(f_control);
		this.averhandle.checkbox.click(f_control);
		
	},
	
	showAverline: function(){
		for(var i=0; i<this.groups.length; i++){
			var group =	this.groups[i];
			group.averlines.show();
		}
		this.config.showavgline = true;	
		return this;
	},
	
	hideAverline: function(){
		for(var i=0; i<this.groups.length; i++){
			var group =	this.groups[i];
			group.averlines.hide();
		}
		this.config.showavgline = false;	
		return this;
	},
	
	drawXmark: function(){
		var x = 0;
		var y = (this.config.groups.length) * (this.config.labelheight + this.config.gridheight) + this.config.paperpadding + this.config.xmarkheight;
		this.paper.rect(x, y, this.config.paperwidth, 1).attr({
			'fill': this.config.splitcolor,
			'stroke': '',
			'stroke-width' : 0	
		});
		return this;
	},
	
	//update level
	updateYmark: function(group){
		var aver = this.config.yaverage;
		group.ymark.forEach(function(o, index){
			if(index !=0 && index != aver){
				o.attr({'text': group.level/aver * (aver-index) });
			}
		});
	},
    
    updateViewByDX: function(dx, date){

        var viewtype = this.view_type;
        var count = this.view_count;
        var gridwidth = this.config.gridwidth;
        var viewend = date;
        if(!this.is_drawline_over){ return this; }
        if(viewtype == 'all'){ return this; }
        if(Math.abs(dx)<10 || Math.abs(dx)>gridwidth){ return this; }
        
        var date_aim_end =  viewend - Math.round(count * dx/gridwidth)*MS;
        var date_aim_start = date_aim_end - count*MS;
    
        if(date_aim_start<this.rangeall.start){ 
            date_aim_end = this.rangeall.start + count*MS;
            date_aim_start = date_aim_end - count;
        }
        //右到边缘
        if(date_aim_end >this.rangeall.end){ return this; }
        //左到边缘
        if(date_aim_start <this.rangeall.start){ return this; }
        
        this.drawData({
            'needanimate': false,
            'viewend': date_aim_end 
        });
        
        return this;
        
    },
	
	addReadInfoToGroup: function(group){
		
		this.drawDatainfo(group);
		
		var _this = this;
        
        var drag_token_start = false;
        var drag_token_end = true;
        var drag_token_date = this.view_date_end;
        
		var f_dragmove = function(dx, dy, x, y, e){
            if(drag_token_start && !drag_token_end){
                _this.updateViewByDX(dx, drag_token_date);
            }
            for(var i=0; i<_this.groups.length; i++){
				var g = _this.groups[i];
				_this.hideReadinfo(g);	
			}
		}
		var f_dragstart = function(x, y, e){     
            drag_token_start = true;
            drag_token_end = false;
		}
		var f_dragend = function(e){
            drag_token_start = false;
            drag_token_end = true;
            drag_token_date = _this.view_date_end;
        }
		
		var pos_now = null;
		
		var f_in = function(e){
   	 		if(drag_token_start){ drag_token_end = false; return; }
			var pos = _this.getMousePosFromPaper(e);
			pos_now = pos;
			var date = _this.convertDateFromPos(pos);
			_this.readDataInfo(date, group);
		} 
		var f_out = function(e){
            if(drag_token_start){ drag_token_end = true; return; }            
            for(var i=0; i<_this.groups.length; i++){
				var g = _this.groups[i];
				_this.hideReadinfo(g);	
			}
		}
		var f_move = function(e){
            if(drag_token_start){ return false; }
			var pos = _this.getMousePosFromPaper(e);
			if(pos_now){
                if(pos.x != pos_now.x){
                    pos_now = pos;
                    var date = _this.convertDateFromPos(pos);
                    _this.readDataInfo(date, group);
                }
            }
		}
		if(!this.is_touchOS){
			group.dragpanel.drag(f_dragmove, f_dragstart, f_dragend);
			group.dragpanel.mousemove(f_move);
			group.dragpanel.hover(f_in, f_out);	
		}
		
		
		//for touch
		var touch_x = 0; //起始点记录
		var touch_y = 0; //起始点记录
		var touch_dx = 0; //移动距离
		var touch_dy = 0; //移动距离
		var preventDefault=function(e){
			if(e){ e.preventDefault(); }
			else{ window.event.returnValue = false; }
		};
		var f_touchstart = function(e){
 			var pos = _this.getMousePosFromPaper(e);
			touch_x = pos.x;
			touch_y = pos.y;
		}
		var f_touchend = function(e){
			if(touch_dx == 0){
				var date = _this.convertDateFromPos({'x': touch_x});
				_this.readDataInfo(date, group);
			}
			touch_x = 0;
			touch_y = 0;
			touch_dx = 0;
			touch_dy = 0;
			drag_token_date = _this.view_date_end;
		}
		var f_touchmove = function(e){
			var pos = _this.getMousePosFromPaper(e);
			touch_dx =  pos.x- touch_x;
			touch_dy =  pos.y- touch_y;
			if(Math.abs(touch_dy)>Math.abs(touch_dx)){ return; }
			preventDefault(e);
			for(var i=0; i<_this.groups.length; i++){
				var g = _this.groups[i];
				_this.hideReadinfo(g);	
			}
			_this.updateViewByDX(touch_dx, drag_token_date);
		}
		if(this.is_touchOS){
			group.dragpanel.touchstart(f_touchstart);
			group.dragpanel.touchmove(f_touchmove);	
			group.dragpanel.touchend(f_touchend);
		}
		
		
		//group.dragpanel.drag(f_dragmove, f_dragstart, f_dragend);
		//group.dragpanel.mousemove(f_move);
		//group.dragpanel.hover(f_in, f_out);
		
		
		return this;
	},
	
	readDataInfo: function(date, group, mode){
		var mode = arguments[2] === 'all' ? 'all' : 'foucs';
		
		var paperwidth = this.config.paperwidth;
		var gridwidth  = this.config.gridwidth;
		var gridheight = this.config.gridheight;
		var readlinecolor = this.config.readlinecolor;
		
		var offset_toend = (group.viewrange.end - date)/MS;
		var x = paperwidth - (offset_toend/this.view_count)*gridwidth;
		//last can view
		if(date == group.viewrange.end){ x = x-1; }	
		//更新点位数据
		if(date != group.readdate){
			group.readdate = date;
			var data = this.getDataFromDate(date);
			group.readline.attr({ 'x' : x });		
			group.readpoints.attr({ 'cx':x });
			group.readpoints.forEach(function(o, index){
				var y = group.ystart + gridheight*(1-data[group.key][index]/group.level);	
				o.attr({'cy': y});
			});
			this.updateReadpanelInfo(group, {
				'x': x,
				'date':	date,
				'data': data	
			});
		}		
		
		if(mode == 'foucs'){
			for(var i=0; i<this.groups.length; i++){        
				var g = this.groups[i];
				g.readline.show().attr({ 'x' : x });
				if(g==group){ 
					g.readpoints.show(); 
					this.showReadpanel(g);
				}else{ 
					g.readpoints.hide();
					this.hideReadpanel(g);
				}
				
			}
		}
		
		return this;
	},
	
	drawDatainfo: function(group){
		var paperwidth = this.config.paperwidth;
		var gridwidth = this.config.gridwidth;
		var gridheight = this.config.gridheight;
		var readlinecolor = this.config.readlinecolor;
		
		//readline
		if(!group.readline){
			var x = group.xstart;
			var y = group.ystart;
			var w = 1;
			var h = gridheight;
			group.readline = this.paper.rect(x, y, w, h).attr({
				'fill' : readlinecolor,
				'stroke' : '',
				'stroke-width' : 0 
			});
		}
		//readpoints
		if(!group.readpoints){
			group.readpoints = this.paper.set();
			var r = 5;
			var s = 5
			var x = group.xstart;
			var y = group.ystart;
			for(var j=0; j<group.childlength; j++){
				var point = this.paper.circle(x, y, r).attr({
					'fill' : '#ffffff',
					'stroke' : this.getColorByIndex(j),
					'stroke-width' : 2 
				});
				group.readpoints.push(point);
			}  
		}
		//readpanel
		if(!group.readpanel){
			group.readpanel = {};
			group.readpanel.panelbody = this.paper.rect(x, y, 140, 20+15+24*group.childlength).attr({
				'fill' : this.config.readpanelbgcolor,
				'fill-opacity': this.config.readpanelopacity,
				'stroke': this.config.readpanelbordercolor,
				'stroke-width' : 1
			});
			group.readpanel.panelname = this.paper.text(x, y, group.readpanelname).attr({
				'fill': this.config.labelcolor,
				'cursor': 'default',
				'font-size': 12,
				'font-family': 'Arial',
				'text-anchor': 'start'
			});
			group.readpanel.datelabel = this.paper.text(x, y, '').attr({
				'fill': this.config.labelcolor,
				'cursor': 'default',
				'font-size': 12,
				'font-family': 'Arial',
				'text-anchor': 'start'
			});
			group.readpanel.datanum = this.paper.set();
			for(var j=0; j<group.childlength; j++){
				var tn = this.paper.text(x, y, '').attr({
					'fill' : this.getColorByIndex(j),
					'font-size': 20,
					'text-anchor': 'end',
					'font-weight' : 'bold',
					'font-family': 'Arial'
				});
				group.readpanel.datanum.push(tn);
			}		
		}
		
		//dragpanel
		if(!group.dragpanel){
			var x = group.xstart;
			var y = group.ystart;
			var w = gridwidth;
			var h = gridheight;
			group.dragpanel = this.paper.rect(x, y, w, h).attr({
				'cursor': 'pointer',
				'fill' : '#fff',
				'fill-opacity': 0,
				'stroke' : '',
				'stroke-width' : 0
			});
		}
		
		var date_bydatamax = this.getMaxFromData(group.viewdata, true).date;
			
		this.readDataInfo(date_bydatamax, group, 'all');

		return this;
	},
	
	showReadpanel: function(group){
		group.readpanel.panelname.show();
		group.readpanel.panelbody.show();
		group.readpanel.datelabel.show();
		group.readpanel.datanum.show();
	},
	
	hideReadpanel: function(group){
		group.readpanel.panelname.hide();
		group.readpanel.panelbody.hide();
		group.readpanel.datelabel.hide();
		group.readpanel.datanum.hide();
	},
	
	hideReadinfo: function(group){
		group.readline.hide();
		group.readpoints.hide();
		group.readpanel.panelname.hide();
		group.readpanel.panelbody.hide();
		group.readpanel.datelabel.hide();
		group.readpanel.datanum.hide();
	},

	updateReadpanelInfo: function(group, info){
		
		var datetext = this._convertDate(info.date);
		var data = info.data[group.key];
		for(var i=0; i<data.length; i++){
			data[i] = this.	_formatNumber(data[i]);
		}
		
		//set readpanel pos
		var paperwidth = this.config.paperwidth;
		var gridheight = this.config.gridheight;
		var panelBBox_old = group.readpanel.panelbody.getBBox();
		var posx = posx = info.x + 10;;
		var posy = group.ystart + (gridheight - panelBBox_old.height)/2;
		if(posx + panelBBox_old.width > paperwidth){ //reverse
			posx = info.x - panelBBox_old.width  - 10;
		}
		
		group.readpanel.panelbody.attr({
			'x': posx,
			'y': posy
		});
		
		var panelBBox_new = group.readpanel.panelbody.getBBox();
		var x = panelBBox_new.x;
		var y = panelBBox_new.y;
		var w = panelBBox_new.width;
		
		group.readpanel.datelabel.attr({
			'x': x + 10,
			'y': y + 16,
			'text': datetext
		});
		group.readpanel.panelname.attr({
			'x': x + 70 + 10,
			'y': y + 16
		});
		y += 30;
		var namebox = group.readpanel.panelname.getBBox();
		var numx = namebox.x + namebox.width - 2;
		group.readpanel.datanum.forEach(function(o, index){
			o.attr({
				'x': numx,
				'y': y + 10,
				'text': data[index]
			});
			y += 24;
		});
	},
	
	_formatNumber: function(num){
		num = num + '';  
		var re=/(-?\d+)(\d{3})/;  
		while(re.test(num)){  
		   num = num.replace(re,'$1,$2')  
		}  
        return  num;
	},
	
	convertDateFromPos: function(pos){
		var paperwidth = this.config.paperwidth;
		var gridwidth  = this.config.gridwidth;
		var ratio = 1 - (pos.x-(paperwidth-gridwidth))/gridwidth;
		
		var offset_toend = Math.round(this.view_count*ratio, 10);
		var date = this.view_date_end - offset_toend*MS;
		
		return date;   		
	},
	
	getMousePosFromPaper: function(e){
		try{
        var pos_mouse = this.getMousePos(e);
		var pos_paper = this.getDomPos(this.container);
		}catch(e){
            return {'x': 0, 'y': 0}
        }
        return {
			'x': pos_mouse.x - pos_paper.x,
			'y': pos_mouse.y - pos_paper.y
		}
	},
	
	getMousePos: function(e){
		if(e.pageX || e.pageY){ return {x:e.pageX, y:e.pageY}; }
		var body = document.documentElement ? document.documentElement : document.body;
		return {
			x:e.clientX + body.scrollLeft - body.clientLeft,
			y:e.clientY + body.scrollTop - body.clientTop
		};
	},
	
	getDomPos: function(o){
		if (o.getBoundingClientRect) {
			var box = o.getBoundingClientRect();
			var D = document.documentElement;
			var x = box.left + Math.max(D.scrollLeft, document.body.scrollLeft) - D.clientLeft;
			var y = box.top + Math.max(D.scrollTop, document.body.scrollTop) - D.clientTop;
			return {'y': y, 'x': x};
		}else{
			function pageX(o){ try {return o.offsetParent ? o.offsetLeft +  pageX(o.offsetParent) : o.offsetLeft; } catch(e){ return 0; } }
			function pageY(o){ try {return o.offsetParent ? o.offsetTop + pageY(o.offsetParent) : o.offsetTop; } catch(e){ return 0; } }
			return {'y': pageY(o), 'x': pageX(o)};
		}
	},
	
	updateXmark: function(range, viewtype){
		if(this.xmark){
			this.xmark.forEach(function(o){ o.remove(); });
			this.xmark = null;
		}
		this.xmark = this.paper.set();
		
		var paperwidth = this.config.paperwidth;
		var gridwidth  = this.config.gridwidth;
		var style = {
			'fill': this.config.xmarkcolor,
			'cursor': 'default',
			'font-size': 12,
			'font-family': 'Arial'
		};
		var x = paperwidth - gridwidth;
		var y = (this.config.groups.length) * (this.config.labelheight + this.config.gridheight) + this.config.paperpadding + 10;
		var marks = [];
		
		var start = range.start;
		var end = range.end;
		var days = (end-start)/MS;	
		var vi = viewtype;
		if(vi == 'all'){//未知
			if(days<=7){ vi = 'week'; }
			else if(days<=31){ vi = 'month'; }
			else if(days<=90){ vi = 'quarter'; }
			else if(days<=180){ vi = 'halfyear'; }
			else if(days<=365){ vi = 'year'; }
			else{ vi = 'mulyear'; }
		}
		if(vi == 'week'){
            var dates = [];
            for(var i=0; i<=days; i++){
                dates.push(end - i*MS);
            }
            var yy = new Date(dates[dates.length-1]).getFullYear();
            var mm = new Date(dates[dates.length-1]).getMonth() + 1;
            var dd = new Date(dates[dates.length-1]).getDate();
            for(var i=dates.length-1; i>=0; i--){
                var date = new Date(dates[i]);
                var yy0 = date.getFullYear();
                var mm0 = date.getMonth() + 1;
                var dd0 = date.getDate();
                var showyy = yy0 != yy ? true : false;
                var showmm = mm0 != mm ? true : false; 
                var text = (showyy ? yy0 + '年' : '')
                        + (showmm ? mm0 + '月' : '')
                        + (dd0 + '日');
                yy = yy0;
                mm = mm0;
                dd = dd0;  
                marks.push(text);                
            }
            marks = marks.reverse();
            var dw = gridwidth/days;
            for(var i=0; i<marks.length; i++){
                var x = paperwidth - dw*i;
                var text = marks[i];
				if( i!=0 && i!= marks.length-1){
			    	this.xmark.push(this.paper.text(x, y, text));
				}
			}
		}
		else if(vi == 'month'){
            var dates = [];
            for(var i=0; i<=days; i+=7){
                dates.push(end - i*MS);
            }
            var yy = new Date(dates[dates.length-1]).getFullYear();
            var mm = new Date(dates[dates.length-1]).getMonth() + 1;
            var dd = new Date(dates[dates.length-1]).getDate();
            for(var i=dates.length-1; i>=0; i--){
                var date = new Date(dates[i]);
                var yy0 = date.getFullYear();
                var mm0 = date.getMonth() + 1;
                var dd0 = date.getDate();
                var showyy = yy0 != yy ? true : false;
                var showmm = mm0 != mm ? true : false; 
                var text = (showyy ? yy0 + '年' : '')
                        + (showmm ? mm0 + '月' : '')
                        + (dd0 + '日');
                yy = yy0;
                mm = mm0;
                dd = dd0;  
                marks.push(text);                
            }
            marks = marks.reverse();
            var dw = gridwidth/days;
            for(var i=0; i<marks.length; i++){
                var x = paperwidth - dw*i*7;
                var text = marks[i];
				if( i!=0){
                	this.xmark.push(this.paper.text(x, y, text));
				}
			}
		}
		else if(vi == 'quarter'){
            var ep = new Date(end);
			ep.setDate(1);
            var m = ep.getMonth();
            var months = [];
            for(var i=0; i<=3; i++){
                months.push(ep.getTime());
                m --;
                if(m == -1){ m = 11; ep.setFullYear(ep.getFullYear()-1, 11, ep.getDate()) }
                else{ ep.setMonth(m); }
            }
            var yy = new Date(months[months.length-1]).getFullYear();
            var mm = new Date(months[months.length-1]).getMonth() + 1;
            for(var i=months.length-1; i>=0; i--){
                var date = new Date(months[i]);
                var yy0 = date.getFullYear();
                var mm0 = date.getMonth() + 1;
                var showyy = yy0 != yy ? true : false;
                var text = (showyy ? yy0 + '年' : '')
                        + mm0 + '月';
                yy = yy0;
                mm = mm0;
                marks.push(text);                
            }
            marks = marks.reverse();
            var dw = gridwidth/days;
            var mw = dw*30.5;
			var xs = paperwidth - (end - months[0])/MS*dw + mw/2;
            for(var i=0; i<marks.length; i++){
                var x = xs - i*mw;
                var text = marks[i];
                this.xmark.push(this.paper.text(x, y, text));
            }
		}
		else if(vi == 'halfyear'){
			var ep = new Date(end);
			ep.setDate(1);
            var m = ep.getMonth();
            var months = [];
            for(var i=0; i<=6; i++){
                months.push(ep.getTime());
                m --;
                if(m == -1){ m = 11; ep.setFullYear(ep.getFullYear()-1, 11, ep.getDate()) }
                else{ ep.setMonth(m); }
            }
            var yy = new Date(months[months.length-1]).getFullYear();
            var mm = new Date(months[months.length-1]).getMonth() + 1;
            for(var i=months.length-1; i>=0; i--){
                var date = new Date(months[i]);
                var yy0 = date.getFullYear();
                var mm0 = date.getMonth() + 1;
                var showyy = yy0 != yy ? true : false;
                var text = (showyy ? yy0 + '年' : '')
                        + mm0 + '月';
                yy = yy0;
                mm = mm0;
                marks.push(text);                
            }
            marks = marks.reverse();
            var dw = gridwidth/days;
            var mw = dw*30.5;
			var xs = paperwidth - (end - months[0])/MS*dw + mw/2;
            for(var i=0; i<marks.length; i++){
                var x = xs - i*mw;
                var text = marks[i];
                this.xmark.push(this.paper.text(x, y, text));
            }
		}
		else if(vi == 'year'){
            var ep = new Date(end);
			ep.setDate(1);
            var m = ep.getMonth();
            var months = [];
            for(var i=0; i<=12; i++){
                months.push(ep.getTime());
                m --;
                if(m == -1){ m = 11; ep.setFullYear(ep.getFullYear()-1, 11, ep.getDate()) }
                else{ ep.setMonth(m); }
            }
            for(var i=0; i<months.length-3; i+=3){
                var date = new Date(months[i]);
                var date3 = new Date(months[i+3]);
                var yy0 = date.getFullYear();
                var mm0 = date.getMonth() + 1;
                var yy3 = date3.getFullYear();
                var mm3 = date3.getMonth() + 1;
                var text = mm3 + '月'
                           + '-'
                           + ((mm0<mm3) ? (mm0-1 == 0 ? yy0-1 : yy0) + '年' : '')
                           + (mm0-1 == 0 ? 12 : mm0-1) + '月';
                marks.push(text);                
            }
            var dw = gridwidth/days;
            var mw = dw*30.5;
			var xs = paperwidth - (end - months[3])/MS*dw + mw*3/2;
            for(var i=0; i<marks.length; i++){
                var x = xs - i*3*mw;
                var text = marks[i];
                this.xmark.push(this.paper.text(x, y, text));
            }
		}
		else if(vi == 'mulyear'){
			var ep = new Date(end);
			ep.setMonth(0);
			ep.setDate(1);
			var years = Math.ceil(days/365);
			var yy = new Date(ep).getFullYear();
			for(var i=0; i<years; i++){
				marks.push(yy-i + '年');
			}
			var dw = gridwidth/days;
			var yw = dw*365;
			var xs = paperwidth - (end - ep.getTime())/MS*dw + yw/2;
			for(var i=0; i<marks.length; i++){
				var text = marks[i];
				var x= xs - i*yw;
				this.xmark.push(this.paper.text(x, y, text));	
			}
			
		}
        var x = paperwidth - gridwidth;
        var y = y -10;
        var w = gridwidth;
        var h = 20;
		this.xmark.attr(style).attr({
			'clip-rect': [x, y, w, h].join(' ')
           //,'clip-path': ['M', x, y, 'L', x+w, y, 'L', x+w, y+h, 'L', x, y+h, 'Z'].join(' ')
		});
		
		return this;	
	},
	
	drawRangemark: function(){
		var x = 0;
		var y = (this.config.groups.length) * (this.config.labelheight + this.config.gridheight) + this.config.xmarkheight +　this.config.paperpadding + 21;
		var style = {
			'fill': this.config.labelcolor,
			'cursor': 'default',
			'font-size': 12,
			'font-family': 'Arial',
			'text-anchor': 'start'	
		};
		this.rangemark.start = this.paper.text(x, y, '').attr(style);
		this.rangemark.conn = this.paper.text(x+68, y, '至').attr(style).attr({'y': y-0.5});
		this.rangemark.end = this.paper.text(x+82, y, '').attr(style);
		return this;
	},
	
	updateRangemark: function(range){
		var start = range.start;
		var end = range.end;
		this.rangemark.start.attr({'text': this._convertDate(start)});
		this.rangemark.end.attr({'text': this._convertDate(end)});
		return this;
	},
	
	drawButtons: function(){
		var defbutton = null;
		var x = 200;
		var y = (this.config.groups.length) * (this.config.labelheight + this.config.gridheight) + this.config.xmarkheight +　this.config.paperpadding + 8;
		var cfg = this.config.viewtypes;
		for(var key in cfg){
			var button = this.paper.rect(x, y, 40,26, 5 ).attr({
				'cursor': key == this.view_type ? 'default' : 'pointer',
				'stroke': key == this.view_type ? '#eaeaea' : '#bbbbbb',
				'fill'	: key == this.view_type ? '#eaeaea': '90-#f1f1f1-#fefefe',
				'stroke-width': 0.5
			}).toFront();
			var label = this.paper.text(x, y + 12, cfg[key]).attr({
				'fill': this.config.labelcolor,
				'cursor': key == this.view_type ? 'default' : 'pointer',
				'font-weight': key == this.view_type ? 'bold' : 'normal',
				'font-size': 12,
				'font-family': 'Arial',
				'text-anchor': 'start'	
			}).toFront();
			label.attr({'x': x + (40-label.getBBox().width)/2})
			x += 45;
			this.buttons[key] = {};
			this.buttons[key].label = label; 
			this.buttons[key].button = button;
		}
		var _this = this;
		var markCurrent = function(key){
			var btn = _this.buttons[key].button;
			var label = _this.buttons[key].label;
			btn.attr({
				'cursor': 'default',
				'stroke': '#eaeaea',
				'fill'	: '#eaeaea'
			});
			label.attr({
				'cursor': 'default',
				'font-weight': 'bold'
			});
		}
		var clearCurrent = function(key){
			var btn = _this.buttons[key].button;
			var label = _this.buttons[key].label;
			btn.attr({
				'cursor': 'pointer',
				'stroke': '#bbbbbb',
				'fill'	: '90-#f1f1f1-#fefefe'
			});
			label.attr({
				'cursor': 'pointer',
				'font-weight': 'normal'
			});
		}
		var hover = function(key){
			var btn = _this.buttons[key].button;
			var label = _this.buttons[key].label;
			btn.attr({
				'stroke': '#99bdd9',
				'fill'	: '90-#e2f2fd-#fdfeff'
			});
		}
		
		for(var key in this.buttons){
			(function(key){
				var f_click = function(){
					if(key != _this.view_type){
						clearCurrent(_this.view_type);
						markCurrent(key);
						_this.drawData({'viewtype': key });
					}
				}	  
				var f_in = function(){ if(key != _this.view_type){ hover(key);  }	};
				var f_out = function(){ if(key != _this.view_type){ clearCurrent(key); } }
				
				_this.buttons[key].button.click(f_click);
				_this.buttons[key].label.click(f_click);
				_this.buttons[key].label.hover(f_in, f_out);
				_this.buttons[key].button.hover(f_in, f_out);
				
			})(key);
		}
		return this;
	},
	
	getUnitByViewtype: function(viewtype){
		var n = 0;
		switch(viewtype){
			case 'week':
				n = 7;
			break;
			case 'month':
				n = 31;
			break;
			case 'quarter':
				n = 90;
			break;
			case 'halfyear':
				n = 182;
			break;
			case 'year':
				n = 365;
			break;
			case 'all':
				n = (this.rangeall.end -this.rangeall.start)/MS;
			break;
			default:
				n = 31;
			break;
		}
		return n;
			
	},
	
	getDaysMonthOffset: function(time, offset){
        //问题 2月 小月31
		var date = new Date(time);
		var op = offset>0 ? '+' : '-'; 
		offset = Math.abs(offset);
		var m = date.getMonth();
		var newdate = new Date(time);
		for(var i=0; i<offset; i++){
			if(op == '+'){
				m++; 
				if(m == 12){ m = 0; newdate.setFullYear(newdate.getFullYear()+1, 0, newdate.getDate());}
                newdate.setMonth(m, newdate.getDate());
			}else{ 
				m--;
				if(m == -1){ m = 11; newdate.setFullYear(newdate.getFullYear()-1, 11, newdate.getDate());}	
				newdate.setMonth(m, newdate.getDate());
			}
		}
        var n = (date.getTime() - newdate.getTime())/MS;
		return n;
	},
	
	getDataFromDate: function(date){
		var data = {};
		var groupscfg = this.config.groups;
		for(var i=0; i<groupscfg.length; i++){
			var key = groupscfg[i].key;
			data[key] = [];
			for(var j=0; j<this.data.length; j++){
				data[key][j] = 0; 
				var d = this.data[j][key];
				for(var k=0; k<d.data.length; k++){
					if(d.data[k].time == date){
						data[key][j] = d.data[k].value;
						break;	
					}	
				}
			} 
		}
		return data;
	},
	
	getDataFromRange: function(range){
		var start = range.start;
		var end = range.end;
		var data = {};
		var count = (end-start)/MS;
		var groupscfg = this.config.groups;
		for(var i=0; i<groupscfg.length; i++){
			var key = groupscfg[i].key;
			data[key] = [];
			for(var j=0; j<this.data.length; j++){
				var d = this.data[j][key];
				data[key][j] = [];
				if(!(d.start>end || d.end<start)){ //有交集
					for(var l=0; l<d.data.length; l++){
						var t = d.data[l].time;
						if(t >= start && t <= end){ data[key][j].push(d.data[l]); }
						if(t >= end){ break; }	
					}
					//后
					var dend = data[key][j][data[key][j].length -1].time; 
					if(dend<end){
						for(var k=0; k<(end-dend)/MS; k++){ 
							data[key][j].push({
								'time'	: dend + (k+1)*MS,
								'value'	: -1
							});	 
						}
					}
					//前
					var dstart = data[key][j][0].time; 
					if(dstart>start){
						for(var k=0; k<(dstart - start)/MS; k++){ 
							data[key][j].unshift({
								'time'	: dstart - (k+1)*MS,
								'value'	: -1
							});	 
						}	
					}
				}else{
					for(var k=0; k<=count; k++){
						data[key][j].push({
							'time'	: start+k*MS,
							'value'	: -1	
						});	
					}	
				}
			} 
		}
		return data;
	},
	
	getAverFromData: function(data){
		var a = 0;
		var total = 0;
		var count = data.length;
		for(var j=0; j<count; j++){
			var d = data[j].value;
			total += d<0 ? 0 : d;
		}
		a = total/count;
		return a;
	},
	
	getMaxFromData: function(data, needdate){
		var MAX = 0;
		var MAX_widthdate = {};
		var needddate = arguments[1]===true ? true : false;
		
		var m = 0;
		var t = -2;
		for(var j=0; j<data.length; j++){
			var d = data[j];
			for(var k=0; k<d.length; k++){
				if(d[k].value > m){ m = d[k].value; t = d[k].time }
			}
		}
		
		MAX = m;
		MAX_widthdate = {'date': t, 'value': m};
		
		if(needddate){ return MAX_widthdate; }
		return MAX;
	},
	
	getLevelByMax: function(num){
		var m = 0;
		if(num<=10){ m = 10; }
		else{
			var ne = num.toString().length - 1;
			var n1 = parseInt(num.toString().charAt(0), 10);
			var n2 = parseInt(num.toString().charAt(1), 10);
			var n0 = '1';	
			for(var i=0; i<ne;i++){ n0+='0'; }
			n0 = parseInt(n0);
			if(n2 < 5){ m = (n1*10+5)/10 * n0; }
			else{ m = (n1+1) * n0; }
		}
		return m;
	},
	
	drawGroups: function(){
		for(var i=0; i<this.config.groups.length; i++){ this.addGroup(i); }
		return this;
	},
	
	addGroup: function(index){
		var cfg = this.config;
		
		var groupinfo = cfg.groups[index]; 
		var average = cfg.yaverage;
		var ymarkcolor = cfg.ymarkcolor;
		var paperwidth = cfg.paperwidth;
		var labelheight = cfg.labelheight;
		var labelcolor =  cfg.labelcolor;
		var gridwidth = cfg.gridwidth;
		var gridheight = cfg.gridheight;
		var gridcolor = cfg.gridcolor;
		var splitcolor = cfg.splitcolor;
		var paperpadding = cfg.paperpadding;
		var perheight = gridheight/average;
		
		var xstart = paperwidth - gridwidth;
		var ystart = paperpadding + labelheight*(index+1) + gridheight*index;
		
		//key
		var groupkey = groupinfo.key;
		
		//lines
		var lines = this.paper.set();
		
		//aver
		var averlines = this.paper.set();
		
		//label
		var label = this.paper.text(
				0, 
				(labelheight+gridheight)*index+paperpadding+labelheight/2-1,
				groupinfo.value
		).attr({
			'font-size': 12,
			'fill': labelcolor,
			'text-anchor': 'start',
			'font-family': 'Arial'
		});
		
		//grid & ymark
		var grid = this.paper.set();
		var ymark = this.paper.set();
		for(var i=0; i<=average; i++){
			var x = (i == average || i==0) ? 0 : paperwidth - gridwidth;
			var y = (i == average) ? (perheight*i -1) : perheight*i;
			var w = (i == average || i==0) ? paperwidth : gridwidth;
			var c = (i == average || i==0) ? splitcolor : gridcolor;
			y += ystart;
			var rect = this.paper.rect(x, y, w , 1).attr({'fill': c});
			var text = this.paper.text(paperwidth -gridwidth -5, y, '');
			grid.push(rect);	
			ymark.push(text);
		}
		grid.attr({
			'stroke'		: '',
			'stroke-width'	: 0
		});
		ymark.attr({
			'font-size'		: 10,
			'text-anchor': 'end', 
			'fill': ymarkcolor, 
			'font-family': 'Arial'
		});
		
		var dragpanel = null;
		var readdate = null;
        var readline = null;
        var readpanel = readpanel;
		var readpanelname = groupinfo.value + '指数';
        var readpoints = null;
        var level = null;         
        var childlength = 0;
		var viewrange = null;
		var disabled = this.data.length == this.nulls[groupkey] ? true : false;
		if(disabled){
			var nulltip = this.paper.text(
				paperwidth/2, 
				ystart + gridheight/2,
				'此项暂无数据'
			).attr({
				'font-size': 12,
				'fill': labelcolor,
				'font-family': 'Arial'
			});
			grid.forEach(function(o, index){
				if(index !=0 && index!=average){
					o.hide();	
				}	
			});
		}else{
			var group = {
				'key'	    : groupkey,
				'label'	    : label,
				'grid'	    : grid,
				'ymark'     : ymark,
				'xstart'	: xstart,	
				'ystart'    : ystart,
				'disabled'	: disabled,
				'childlengh': childlength,
				'viewrange'	: viewrange,
				'level'     : level,
				'lines'	    : lines,
				'averlines'	: averlines,
				'readpanelname' : readpanelname,
				'readdate'  : readdate,
				'readline'  : readline,
				'readpoints': readpoints,
				'readpanel' : readpanel,
				'dragpanel'	: dragpanel
			}
			this.groups.push(group);
		}
		return group;	
	},
	
	drawNames: function(){
		var paperwidth = this.config.paperwidth;
		var labelheight = this.config.labelheight; 
		var paperpadding = this.config.paperpadding; 
		var names = this.paper.set();
		var ox = paperwidth;
		for(var i = this.data.length-1; i>=0; i--){
			var color = this.getColorByIndex(i);
			var text = this.data[i].name ? this.data[i].name : ''; 
			var name = this.paper.text(ox, paperpadding + labelheight/2, text).attr({
				'font-size': 12,
				'fill': color,
				'text-anchor': 'end',
				'font-family': 'Arial'
			});
			ox -= name.getBBox().width;
			var icon = this.paper.circle(ox-10, paperpadding + labelheight/2+1, 5).attr({
				'fill': color,
				'stroke': '',
				'stroke-width': 0
			});
			ox -= 25;
			names.push(name, icon);	
		}
		return this;
	},
	
	getColorByIndex: function(index){
		var color = this.config.linecolor[index];
		if(color){
			return color;
		}
		return '#000000';
	},
	
	isExistInConfig: function(key){
		var groupscfg = this.config.groups;
		for(var i=0; i<groupscfg.length; i++){
			if(groupscfg[i].key == key){
				return true;
			}
		}
		return false;
	},
	
	formatData: function(data){
		var gcfg = this.config.groups;
		var keys = {}; for(var i=0; i<gcfg.length; i++){ keys[gcfg[i].key] = gcfg[i].value; }
		var newdata = [];		
		if(data.length == 1){ //如只有一项且无值 则不显示此项
			for(var key in keys){
				if(!data[0][key]){
					delete(keys[key]);
					for(var i=0; i<this.config.groups.length; i++){
						if(this.config.groups[i].key == key){
							this.config.groups.splice(i, 1);
							break;
						}
					}
				}
			}
		}
 		for(var i=0; i<data.length; i++){
			var d = data[i];
			for(var key in keys){
				if(d[key] && d[key].length){
					var d_f = {'start': 0, 'end': 0, 'data': []};
					d_f.start = this._convertTime(d[key][1]);
					d_f.end = this._convertTime(d[key][0]);	
					var dq = this.getDateQueue({'start': d_f.start, 'end': d_f.end});
					var dd = d[key][2];
					//检测数量对应 
					var offset = dq.length - dd.length; 
					//补足 优先临近时间为正确 后补0
					if(offset > 0 ){
						for(j=0; j<offset; j++){ dd.push(0); } 	
					}
					//删余 删除偏远的项
					if(offset < 0){
						offset = Math.abs(offset);
						for(j=0; j<offset; j++){ dd.pop(); }
					}
					//如果只有一天
					if(dq.length == 1){ dd.push(0); d_f.start -= MS; dq.unshift(d_f.start) }
					for(var j=0, len=dd.length; j<len; j++){
						var v = dd[j];
						var n = parseInt(v, 10);
						d_f.data[len-1-j] = {
							"time" : dq[len-1-j], 
							"value": isNaN(n) ? 0 : (n<0 ? 0 : n) 
						}	
					}
					d[key] = d_f;
				}else{
					if(!this.nulls[key]){ this.nulls[key] = 0; }
					this.nulls[key] ++;
					d[key] = {'start': 0, 'end': 0, 'data': []};
				}
				if(!newdata[i]){ newdata[i] = {}; }
				newdata[i][key] = d[key];
			}
			//对允许附加的信息拷贝
			for(var m=0; m<this.allowkey.length; m++){
				var k = this.allowkey[m];
				if(!newdata[i]){ newdata[i] = {}; }
				newdata[i][k] = data[i][k];
			}
		}
		
		return newdata;
	},
	
	unifyRange: function(data){
		//统一区间
		var range = this.rangeall;
		var start = range.start;
		var end = range.end;
		var count = (end-start)/MS;
		for(var i=0; i<data.length; i++){
			var d = data[i];
			for(var key in d){
				if(typeof(d[key]) == 'object'){
					var newdata = [];
					var dk = d[key];
					if(!(dk.start>end || dk.end<start)){ //有交集
						for(var l=0; l<dk.data.length; l++){
							var t = dk.data[l].time;
							if(t >= start && t <= end){ newdata.push(dk.data[l]); }
							if(t >= end){ break; }	
						}
						//后
						var dend = newdata[newdata.length -1].time; 
						if(dend<end){
							for(var k=0; k<(end-dend)/MS; k++){ 
								newdata.push({
									'time'	: dend + (k+1)*MS,
									'value'	: 0
								});	 
							}
						}
						//前
						var dstart = newdata[0].time; 
						if(dstart>start){
							for(var k=0; k<(dstart - start)/MS; k++){ 
								newdata.unshift({
									'time'	: dstart - (k+1)*MS,
									'value'	: 0
								});	 
							}	
						}
					}else{
						for(var k=0; k<=count; k++){
							newdata.push({
								'time'	: start+k*MS,
								'value'	: 0	
							});	
						}	
					}
					
					d[key].start = start;
					d[key].end = end;
					d[key].data = newdata;
				}	
			}
		}

		return data;
	},
	
	_checkdate: function(str){
		var re = /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))$/;
		return re.test(str);
	},
	
	_checkviewtye: function(type){
		var cfg = this.config.viewtypes;
		if(cfg[type]){ return true; }
		return false;	
	},
	
	getDateRangeFromAllData: function(){
		var start = '';
		var end = '';
		for(var i=0, len=this.data.length; i<len; i++){
			var d = this.data[i];
			for(var key in d){
				var d_k = d[key]; 
				if(d_k.start && d_k.end){
					var s = d_k.start;
					var e = d_k.end; 
					if(!start){ start = s; }
					else{ if(s < start){ start = s; } }
					if(!end){ end = e; }
					else{ if(e < end){ end = e; } } //数据最近不同步 取较早的日期
				}
			}
		}
		
		return {
			'start': start,
			'end': end	
		}
	},
	
	_convertTime: function(datestring){
		var s = datestring.split('-');
		var time = new Date(parseInt(s[0], 10), parseInt(s[1], 10)-1, parseInt(s[2], 10)).getTime();
		return time;
	},
	
	_convertDate: function(timestring){
		var dn = new Date(timestring);
		var year = dn.getFullYear();
		var month = dn.getMonth()+1;
		var date =  dn.getDate();
		return year + '-' + (month<10? '0'+month : month) + '-' + (date<10? '0'+date : date);
	},
	
	getDateQueue: function(range){
		var start = range.start;
		var end = range.end;
		var queue = [];
		var o = start;
		do{
			queue.push(o);
			o += MS;	
		}while(end >= o);
		
		return queue;
	}
	
}

var MS = 24*3600*1000;
var mergeConfig = function(target, source, deep){
	target = target || {};
	var sType = typeof source, i = 1, options;
	if( sType === 'undefined' || sType === 'boolean' ) {
		deep = sType === 'boolean' ? source : false;
		source = target;
		target = this;
	}
	if( typeof source !== 'object' && Object.prototype.toString.call(source) !== '[object Function]' )
		source = {};
		while(i <= 2) {
			options = i === 1 ? target : source;
			if( options != null ) {
				for( var name in options ) {
				var src = target[name], copy = options[name];
				if(target === copy){ continue; }
				if(deep && copy && typeof copy === 'object' && !copy.nodeType){
				target[name] = this.extend(src ||(copy.length != null ? [] : {}), copy, deep);}
				else if(copy !== undefined)
				target[name] = copy;
			}
		}
		i++;
	}
	return target; 
}

	
})();
