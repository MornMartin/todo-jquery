
var toDoList = new ToDoList('change','add','remove');
	// 根据数据选中地图反馈对应单项的选中状态
	toDoList.addEvent('change.a',function(){
		var map = toDoList.data.map(function(item){
			return item.completed == true;
		})
		var lis = $('#list')[0].children;
		map.forEach(function(item,index){
			$(lis[index]).toggleClass('checked',item)
		})
	})
	// 增加或删除时刷新整个列表
	toDoList.addEvent('add',renderList)
	toDoList.addEvent('remove',renderList)
	// 刷新是否全选
	toDoList.addEvent('add',isCompletedAll)
	toDoList.addEvent('remove',isCompletedAll)
	toDoList.addEvent('change',isCompletedAll)
	// 刷新统计信息
	toDoList.addEvent('add',count)
	toDoList.addEvent('change',count)
	toDoList.addEvent('remove',count)
// 增加TODOlist
$('#import').keydown(function(e){
	if (e.keyCode === 13 && this.value.trim()) {
		toDoList.add(this.value.trim())
		this.value = '';
	}
})
// 改变全选状态
$('#selectAll').on('click',function(){
	toDoList.setAllCompleted(toDoList.isAllCompleted())
})
// 删除选中
$('.del-checked').on('click',function(){
	toDoList.removeByCompleted()
})
renderList();
count();
//渲染单项
function renderItem(data){
	var li = document.createElement('li');
	var checkbox = document.createElement('button');
		$(checkbox).addClass('checkbox').on('click',function(){
			toDoList.change(data.id)
		})
	var p = document.createElement('p');
	var input = document.createElement('input');
		$(p).html(data.title).on('dblclick',function(){
			$(this).css('display','none');
			$(input).css('display','block').val(data.title)[0].select();
		})
		$(input).attr('type','text').css('display','none').on('blur',function(){
			$(input).css('display','none')
			$(p).html($(input).val()).css('display','block');
			if (!$(input).val().trim()) {
				toDoList.removeById(data.id)
			}else{
				toDoList.renameById(data.id,$(input).val().trim());
			}
		});
	var del = document.createElement('button');
		$(del).addClass('del').on('click',function(){
			toDoList.removeById(data.id)
		})
		$(li).append(checkbox, p, input, del).toggleClass('checked',data.completed)
		return li;
}
//渲染整个列表
function renderList(){
	$('#list').html('');
	for (var i = 0; i < toDoList.data.length; i++) {
		$('#list').append(renderItem(toDoList.data[i]))
	}
}
// 判断全选状态
function isCompletedAll (){
	$('#selectAll').toggleClass('selectAll',toDoList.isAllCompleted())
}
// 统计
function count(){
	$('#finished').val(`当前已完成${toDoList.getCompleted()}项`);
	$('#todo').val(`当前未完成${toDoList.getUnCompleted()}项`);
}
