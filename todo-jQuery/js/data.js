
/*
* EventEmmit
* 名称：事件继承
* 语法：EventEmmit.call (this,events)
* 参数：this 构造函数执行环境的this，events 定义事件的名称格式为Array;
* 返回值：无；
* */
class EventEmmit {
	constructor(events){
		for (var i = 0; i < events.length; i++) {
			this['on' + events[i]] = {};
		}
	}
	// 渲染事件函数
	trigger (eventName,e) {
		var fns = this.getEventFns (eventName);
		fns.forEach(function(item){
			item.call(this,e);
		},this)
	}
	// 添加事件函数
	addEvent (eventName,fn) {
		if (typeof(fn) === 'function') {
			this.getNowEventPack(eventName,true,fn);
		}
	}
	// 移除事件函数
	removeEvent (eventName,fn){
		if (typeof(fn) === 'function') {
			this.getNowEventPack(eventName,false,fn);
		}
	}
	// 找到对应的事件函数包
	getNowEventPack (eventName, isAddEvent, fn) {
		var attrs = eventName.split('.');
			attrs[0] = 'on' + attrs[0];
		var nowOpera = this;
		var index = 0;
		function fillAttr(index){
			if (index < attrs.length) {
				var attr = attrs.slice(index,index+1).toString()
				if (!nowOpera[attr]) {
					// 创建eventPacks
					nowOpera[attr] = {};
					nowOpera[attr].callBack = [];
				}
				// 找到当前eventPack
				nowOpera = nowOpera[attr];
				fillAttr (index+1);
			}else{
				// 当前eventPack下是否有函数数组；
				if (nowOpera.callBack) {
				}else{
					nowOpera.callBack = [];
				}
				// 判断删除还是创建事件函数
				if (isAddEvent) {
					nowOpera.callBack.push(fn);
				}else{
					// 删除的时候，如果传了有名函数就定下删除；
					var fnName = fn.name;
					if (fnName) {
						nowOpera.callBack = nowOpera.callBack.filter(function(fn){
							return fn.name != fnName;
						})
					}else{
						nowOpera.callBack.length = 0;
					}
				}

			}
		}
		fillAttr (index);
	}
	// 找到符合条件的事件函数集合
	getEventFns (eventName){
		var fns = [];
		var nowEventPack = this['on' + eventName];
		function circleSearch (nowEventPack){
			for(var attr in nowEventPack){
				var now = nowEventPack[attr]
				if (Array.isArray(now)) {
					fns = fns.concat(now);
				}else if (typeof(now)&&!Array.isArray(now)) {
					circleSearch (now)
				}
			}
		}
		circleSearch(nowEventPack);
		return fns;
	}
}
/*
任务列表类
*/
class ToDoList extends EventEmmit{
	constructor(){
		super(arguments);
		this.data = [{'id':1,'title':'测试任务一','completed':false},{'id':2,'title':'测试任务二','completed':false}]
		this.maxId = this.data.sort(function (a,b) {
			return a.id - b.id
		})[this.data.length-1].id;
	}
	add(val){
		this.data.unshift({
			'id':++this.maxId,
			'title':val,
			'completed':false
		})
		this.trigger('add',null);
	}
	change(id){
		let nowTask = this.data.filter(function(item){
			return item.id == id;
		})[0];
		nowTask.completed = !nowTask.completed;
		this.trigger('change',nowTask);
	}
	renameById(id,val){
		var nowTask = this.data.filter(function(item){
			return item.id == id;
		})[0]
		nowTask.title = val;
		this.trigger('change',nowTask);
	}
	removeById(id){
		this.data = this.data.filter(function(item){
			return item.id != id;
		})
		this.trigger('remove',null);
	}
	removeByCompleted(){
		this.data = this.data.filter(function(item){
			return !item.completed;
		})
		this.trigger('remove',null);
	}
	getCompleted(){
		return this.data.filter(function(item){
			return item.completed
		}).length
	}
	getUnCompleted(){
		return this.data.filter(function(item){
			return !item.completed
		}).length
	}
	isAllCompleted(){
		return this.data.length == 0?false:this.getCompleted() == this.data.length;
	}
	setAllCompleted(state){
		this.data.forEach(function(item){
			item.completed = !state;
		})
		this.trigger('change',null);
	}
}