(function(){

if(!window['VRCHART']){ window['VRCHART'] = {}; }
if(VRCHART.Panel$pie$){ return; }

//饼图应用
VRCHART.Panel$pie$ = {
	apps: [],
	show: function(container, data){
		if(arguments.length < 2){ return; }
		var container = arguments[0];
		var data = arguments[1];
		container = typeof(container)=='string' ? document.getElementById(container) : container;
		if(!container || !data){ return; }
		this.detroyByContainer(container);
		return this.add(new Panel$pie$app(container, data))
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

var Panel$pie$app = function(container, data){
	this.container = container;
	this.data =  data;
	this.control =  null;
	this.pies =  {};
	this.handles = {};
	this.lightrecord = {};
	this.oas = {};
	this.is_touchOS = ("createTouch" in document);
	this.init();
}
Panel$pie$app.prototype = {
	config: {
		maxlen: 3,
		options : {
			sex			: {label: '性别', options: [{label: '男', color: '#49aef0'}, {label: '女', color: '#ff9cb1'}]},
			age			: {label: '年龄', options: [{label: '21岁以下', color: '#bee7fc'}, {label: '22-29岁', color: '#8cdaf2'}, {label: '30-39岁', color: '#2eaae8'}, {label: '40岁以上', color: '#0285c6'}]},
			occupation	: {label: '职业', options: [{label: '学生', color: '#ffcccc'}, {label: '白领', color: '#f79f91'}, {label: '非全职', color: '#f2664f'}, {label: '公务员', color: '#ea4747'}]},
			edu			: {label: '学历', options: [{label: '硕士以上', color: '#bee7fc'}, {label: '本科', color: '#8cdaf2'}, {label: '大专', color: '#2eaae8'}, {label: '高中/技校', color: '#0285c6'}, {label: '初中以下', color: '#03577c'}]}
		}
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
		this.bind();			
	},
	
	clicko: function(key, index){
		if(typeof(this.lightrecord[key]) == 'undefined'){ this.lightrecord[key] = -1; }
		var current = this.lightrecord[key];
		if(index != current){
			var handles = this.handles[key];
			handles[index].className = 'current';
			if(current != -1){ handles[current].className = ''; }
			var pies = this.pies[key];
			if(pies){
				for(var i=0; i<pies.length; i++){
					pies[i].lightPiece(index);
				}
			}
			this.lightrecord[key] = index;
		}else{
			this.reseto(key);
		}
	},
	
	reseto: function(key){
		var current = this.lightrecord[key];
		var handles = this.handles[key];
		if(current != -1 && typeof(current) != 'undefined'){
			handles[current].className = '';
			var pies = this.pies[key];
			if(pies){
				for(var i=0; i<pies.length; i++){
					pies[i].lightReset();
				}
			}
			var oas = this.oas[key];
			if(oas){
				for(var i=0; i<oas.length; i++){
					oas[i].style.display = 'none';
				}
			}
		}
		this.lightrecord[key] = -1;
	},
	
	bind: function(){
		var _this = this;
		for(var key in this.config.options){
			
			var handles = this.handles[key];
			if(handles){
				for(var i=0; i<handles.length; i++){
					(function(key, i){
						var handle = handles[i];
						handle.onclick = function(){ _this.clicko(key, i); }
					})(key, i);
				}
			}
			
			var oas = this.oas[key];
			if(oas){
				for(var i=0; i<oas.length; i++){
					(function(key, i){
						var oa = oas[i];
						oa.onclick = function(){ _this.reseto(key, i); }
						var hot = oa.parentNode;
						//mouse os
						if(!_this.is_touchOS){
							hot.onmouseover = function(){
								if(_this.lightrecord[key] != -1 && typeof(_this.lightrecord[key])!='undefined'){ oa.style.display = 'block'; }	
							}
							hot.onmouseout = function(){
								oa.style.display = 'none';
							}
						}
					})(key, i);
				}
			}
			
			var pies = this.pies[key];
			if(pies){
				for(var i=0; i<pies.length; i++){
					(function(key, i){
						var pie = pies[i];
						for(var j=0; j<pie.pieces.length; j++){
							(function(key, j, i){
								var pies =  _this.pies[key];
								var piece = pie.pieces[j];
								var pieceElement = pie.getPieceElement(j);	
								if(pieceElement){
									pieceElement.attr({'cursor': 'pointer'})
									pieceElement.click(function(){
										_this.clicko(key, j);
										if(_this.is_touchOS){
											var oa = null;
											if(_this.oas[key]){ 
												var oas = _this.oas[key]; 
												for(var k=0; k<oas.length; k++){
													if(k == i){
														if(_this.lightrecord[key] != -1 && typeof(_this.lightrecord[key])!='undefined'){
															oas[k].style.display = 'block';
														}else{
															oas[k].style.display = 'none';	
														}
													}else{
														oas[k].style.display = 'none';
													}	
												}
											}
										}
									});
								}			
							})(key, j, i);
							
						}
						
					})(key, i);	
				}
			}
		}
		
	},

	showError: function(msg){
		this.container.innerHTML = '<div class="charterror">'+ msg + '</div>';
		return this;
	},
		
	draw: function(){
		this.clear();
		var data = this.data;
		
		this.control = document.createElement('div');
		this.control.className = 'chartpie chartpie_group'+ data.length;
		var dbox_inner = document.createElement('div'); 
		dbox_inner.className = 'chartpie_inner';
		
		this.control.appendChild(dbox_inner);
		this.container.appendChild(this.control);
		
		
		var caption = document.createElement('div');
		caption.className = 'caption';
		for(var i=0, len=data.length; i<len; i++){
			var c = document.createElement('div');
			c.className = 'c' + i;
			c.innerHTML = data[i].name;
			caption.appendChild(c);
		}
		dbox_inner.appendChild(caption);
		
		function hasdata(key){
			for(var i=0; i<data.length; i++){
				if(data[i][key]){
					return true;
				}
			}
			return false;
		}
		
		var opts = this.config.options;	
		var setsn = 1;
		for(var key in opts){
			//只要选择节目其中一个有数据即打印此项
			if(!hasdata(key)){ continue; }
			
			var cfg = opts[key];
			
			var oset = document.createElement('div');
			oset.className = 'set';
			if(data.length == 1){
				oset.className = 'set' + (setsn%2 ==0 ?  ' set_even' : '');	
			}
			setsn++;
			dbox_inner.appendChild(oset);
			
			//创建单元控制柄
			var ohandle = document.createElement('div');
			ohandle.className = 'handle';
			oset.appendChild(ohandle);
			//创建列表名称
			var olabel = document.createElement('h3');
			olabel.innerHTML = cfg.label;
			ohandle.appendChild(olabel);
			//创建列表内容
			var ul = document.createElement('ul');
			for(var j=0, le=cfg.options.length; j<le; j++){
				var cc = cfg.options[j];
				var li = document.createElement('li');
				li.innerHTML = '<span style="background-color:'+ cc.color +'"></span><label>'+ cc.label +'</label>';
				var _this = this;
				if(!this.handles[key]){ this.handles[key] = []; }
				this.handles[key][j] = li;
				ul.appendChild(li);
			}
			ohandle.appendChild(ul);
			//创建饼图
			for(var i=0, len=data.length; i<len; i++){
				var ographic = document.createElement('div');
				ographic.className = 'c' + i;
				oset.appendChild(ographic);
				var og = document.createElement('div');
				og.className = 'og';
				ographic.appendChild(og);
					
				//该节目无此数据
				if(!data[i][key] || data[i][key].length==0){ ographic.innerHTML = '<div class="null">暂无数据</div>'; continue; }
				
				var gdata = [];
				for(var j=0, le=cfg.options.length; j<le; j++){
					var gd = {};
					var cc = cfg.options[j];
					gd.label = cc.label;
					gd.percent = data[i][key][j];
					gd.color = cc.color;
					gdata.push(gd);
				}
				var pie = new Pie(
					og,
					{
						data		: gdata,
						radius_inner : 30,
						direction	 : key=='sex' ? 'ACW' : 'CW'//性别按逆时针
					}
				)
				if(key == 'sex'){ //性别打印百分比
					var d = data[i][key];
					var sexlabels = document.createElement('ul'); sexlabels.className = 'sexlabels';
					var d0 = d[0] ? parseFloat(d[0]) : 0;
					var d1 = d[1] ? parseFloat(d[1]) : 0;
					
					if(d0>=100){ d0 = 100; d1 = 0; }
					if(d1>=100){ d0 = 0; d1 = 100; }
					
					var l1 = d0 || d1 ? d0+ '%' : '';
					var l2 = d0 || d1 ? d1+ '%' : '';
					if(l1){ var label1 = document.createElement('li'); label1.innerHTML = l1; label1.className='la1'; sexlabels.appendChild(label1); label1.style.color = cfg.options[0].color; }
					if(l2){ var label2 = document.createElement('li'); label2.innerHTML = l2; label2.className='la2'; sexlabels.appendChild(label2); label2.style.color = cfg.options[1].color; }
					if(l1 && l2){ ographic.appendChild(sexlabels); }
				}	
				if(!this.pies[key]){
					this.pies[key] = [];	
				}
				this.pies[key].push(pie);
				
				var oa = document.createElement('div');
				oa.className = 'oa';
				oa.innerHTML = '显示<br>全部';
				og.appendChild(oa);
				
				if(!this.oas[key]){
					this.oas[key] = [];	
				}
				this.oas[key].push(oa);
								
			}
			
		}
		return this;
	},
	
	clear: function(){
		for(var key in this.pies){
			for(var i=0; i<this.pies[key].length; i++){
				if(!this.pies[key][i].destroy()){ return false; }
			}
		}
		this.pies = {};
		this.container.innerHTML = '';
		return true;
	}
}
	
/************
* 饼图
*************/
var Pie = function(container, config){
	this.config = { 
		size		: {width: 130, height: 130},
		data		: [],
		centre  	: {x: (130/2), y: (130/2)}, 
		radius		: 55,
		radius_inner: 0,
		anglestart	: -90,
		stroke		: '#fff',
		direction	: 'CW'//顺时针		
	}
	this.container = arguments[0];
	if(!this.container){ return; }
	this.config = typeof(arguments[1]) == 'object' 
	? mergeConfig(this.config, config)
	: this.config;
	
	this.paper		= null;	
	this.pieces		= [];
	
	this.init();	
}

Pie.prototype = {
	
	init: function(){
		this.paper = Raphael(
			this.container,
			this.config.size.width,
			this.config.size.height
		);
		//装载饼块
		var s = this.config.anglestart;
		for(var i=0, len=this.config.data.length; i<len; i++){
			var d = this.config.data[i];
			var se = 0;
			if(parseFloat(d.percent)>=100){ d.percent = 99.999; }
			if(this.config.direction == 'ACW'){
				se = s - 360*d.percent/100;
			}else{
				se = s + 360*d.percent/100;
			}
			var piece = new PiePiece(
				this, 
				{
					label		: d.label,//文本
					percent		: d.percent,//百分比
					color		: d.color ? d.color : '#000',//颜色
					stroke		: this.config.stroke,//描边
					centre		: this.config.centre,//圆心
					radius		: this.config.radius,//半径
					radius_inner: this.config.radius_inner,//内半径
					anglestart	: s,//开始角
					angleend	: se//结束角
				}
			);
			this.addPiece(piece);
			if(this.config.direction == 'ACW'){
				s -= 360*d.percent/100;
			}else{
				s += 360*d.percent/100;	
			}
		}
	},
	
	destroy: function(){
		while(this.hasPiece()){
			if(!this.pieces[0].destroy()){ return false; };	
		}
		this.paper.remove();
		this.paper = null;
		return true;		
	},
	
	hasPiece: function(){
		return this.pieces.length && true;
	},
	
	addPiece: function(piece){
		this.pieces.push(piece);
		return this;
	},
	
	removePiece: function(piece){
		if(piece){ piece.destroy(); }
		return this;
	},
	
	getPieceElement: function(index){
		var piece = this.pieces[index];
		if(piece){
			if(piece.gp){
				return piece.gp;	
			}	
		}
		return null;
	},
	
	lightPiece: function(index){
		if(this.pieces[index]){
			this.pieces[index].renew();
			for(var i=0, len=this.pieces.length; i<len; i++){
				var piece = this.pieces[i];
				if(i != index){
					piece.fade();
				}
			}
		}
		return this;
	},
	
	lightReset: function(){
		for(var i=0, len=this.pieces.length; i<len; i++){
			var piece = this.pieces[i];
			piece.renew();	
		}
		return this;	
	}
	
			
}
/************
* 饼图 切块
*************/
var PiePiece = function(pie, config){
	
	this.pie = arguments[0];
	this.config = arguments[1];
	if(!this.pie){ return; }
	
	this.init();
}

PiePiece.prototype = {
	
	init: function(){
		this.gp = this.drawpiece();
		//this.bind();
	},
	
	bind: function(){
		var _this = this;
		var zi = 1.2;
		var zo = 1/1.2;
		var cx = _this.config.centre.x;
		var cy = _this.config.centre.y;
		var f_in = function(){ this.scale(zi, zi, cx, cy); return false; }
		var f_out = function(){ this.scale(zo, zo, cx, cy); return false; }
		this.gp.hover(f_in, f_out);
		
		return this;
	},
	
	destroy: function(){
		this.gp.remove();
		for(var i=0, len = this.pie.pieces.length; i<len; i++){
			var p = this.pie.pieces[i];
			if(p == this){
				this.pie.pieces.splice(i, 1);
				return true;
			}	
		}
		return false;	
	},
	
	drawpiece: function(){
		var as = this.config.anglestart;
		var ae = this.config.angleend;
		var cx = this.config.centre.x;
		var cy = this.config.centre.y;
		var cx1 = 0, cx2 = 0, cy1 = 0, cy2 = 0;
		var rr = this.config.radius;
		var ri = this.config.radius_inner;
		var co = this.config.color;
		var sk = this.config.stroke;
		var rd = Math.PI/180;
		var x1 = cx + rr * Math.cos(as * rd);
		var x2 = cx + rr * Math.cos(ae * rd);
		var y1 = cy + rr * Math.sin(as * rd);
		var y2 = cy + rr * Math.sin(ae * rd);
		var strpath = [];
		if(ri <= 0 || ri>=rr ){ 
			ri = 0; 
		}else{
			cx1 = cx + ri * Math.cos(as * rd);
			cx2 = cx + ri * Math.cos(ae * rd);
			cy1 = cy + ri * Math.sin(as * rd);
			cy2 = cy + ri * Math.sin(ae * rd);
		}
		var large_arc_flag = Math.abs(ae - as) > 180 ? 1 : 0;//弧度线
		var sweep_flag = ae > as ? 1 : 0;//旋转方向
		if(ri == 0){ //无内圈
			strpath = ["M", cx, cy, "L", x1, y1, "A", rr, rr, 0, large_arc_flag, sweep_flag , x2, y2, "Z"].join(' ');
		}else{
			strpath = ["M", cx1, cy1, "L", x1, y1, "A", rr, rr, 0, large_arc_flag, sweep_flag, x2, y2, "L", cx2, cy2, "A", ri, ri, 0, large_arc_flag, 1-sweep_flag, cx1, cy1, "Z"].join(' ');
		}
		return this.pie.paper.path(strpath).attr({
			'fill'			: co,
			'stroke'		: sk,
			'stroke-width'	: 2
		});
	},
	
	fade: function(){
		//真正的灰度
		/*var rgb = Raphael.getRGB(this.config.color);
		var r = rgb.r, g=rgb.g, b=rgb.b; 
		var c = 0.299*r + 0.587*g + 0.114*b;
		var newcolor = Raphael.rgb(c, c, c);
		*/
		this.gp.stop().animate(
			{
				'fill'	: '#e5e5e5'
			},
			300,
			'easeIn'
		);
		return this;
	},
	
	renew: function(){
		var oldcolor = this.config.color;
		this.gp.stop().animate(
			{
				'fill'	: oldcolor
			},
			300,
			'easeIn'
		);
		return this;
	}
		
}

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