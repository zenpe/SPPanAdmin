$(document).ready(function () {
    //初始化表格,动态从服务器加载数据
    $("#table_list").bootstrapTable({
        //使用get请求到服务器获取数据
        method: "POST",
        //必须设置，不然request.getParameter获取不到请求参数
        contentType: "application/x-www-form-urlencoded",
        //获取数据的Servlet地址
        url: "${ctx!}/admin/user/list",
        //表格显示条纹
        striped: true,
        //启动分页
        pagination: true,
        //每页显示的记录数
        pageSize: 10,
        //当前第几页
        pageNumber: 1,
        //记录数可选列表
        pageList: [5, 10, 15, 20, 25],
        //是否启用查询
        search: true,
        //是否启用详细信息视图
        detailView:true,
        detailFormatter:detailFormatter,
        //表示服务端请求
        sidePagination: "server",
        //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder
        //设置为limit可以获取limit, offset, search, sort, order
        queryParamsType: "undefined",
        //json数据解析
        responseHandler: function(res) {
            return {
                "rows": res.content,
                "total": res.totalElements
            };
        },
        //数据列
        columns: [{
            title: "ID",
            field: "id",
            sortable: true
        },{
            title: "用户名",
            field: "userName"
        },{
            title: "所属角色",
            field: "roles",
            formatter: function(value, row, index) {
                var r = "";
                $(value).each(function (index,role){
                    r = r + "【" + role.name + "】";
                });
                return r;
            }
        },{
            title: "昵称",
            field: "nickName"
        },{
            title: "性别",
            field: "sex",
            formatter: function(value, row, index) {
                if (value == '0')
                    return '<span class="label label-warning">女</span>';
                return '<span class="label label-primary">男</span>';
            }
        },{
            title: "出生日期",
            field: "birthday"
        },{
            title: "电话",
            field: "telephone"
        },{
            title: "邮箱",
            field: "email"
        },{
            title: "状态",
            sortable: true,
            field: "deleteStatus",
            formatter: function (value, row, index) {
                if (value == '0')
                    return '<span class="label label-info">未删除</span>';
                return '<span class="label label-danger">已删除</span>';
            }
        },{
            title: "锁定",
            field: "locked",
            formatter: function (value, row, index) {
                if (value == '0')
                    return '<span class="label label-info">未锁定</span>';
                return '<span class="label label-danger">已锁定</span>';
            }
        },{
            title: "创建时间",
            field: "createTime",
            sortable: true
        },{
            title: "更新时间",
            field: "updateTime",
            sortable: true
        },{
            title: "操作",
            field: "empty",
            formatter: function (value, row, index) {
                var operateHtml = '<@shiro.hasPermission name="system:user:edit"><button class="btn btn-primary btn-xs" type="button" onclick="edit(\''+row.id+'\')"><i class="fa fa-edit"></i>&nbsp;修改</button> &nbsp;</@shiro.hasPermission>';
                operateHtml = operateHtml + '<@shiro.hasPermission name="system:user:deleteBatch"><button class="btn btn-danger btn-xs" type="button" onclick="del(\''+row.id+'\')"><i class="fa fa-remove"></i>&nbsp;删除</button> &nbsp;</@shiro.hasPermission>';
                operateHtml = operateHtml + '<@shiro.hasPermission name="system:user:grant"><button class="btn btn-info btn-xs" type="button" onclick="grant(\''+row.id+'\')"><i class="fa fa-arrows"></i>&nbsp;关联角色</button></@shiro.hasPermission>';
                return operateHtml;
            }
        }]
    });
});

function edit(id){
    layer.open({
        type: 2,
        title: '用户修改',
        shadeClose: true,
        shade: false,
        area: ['893px', '600px'],
        content: '${ctx!}/admin/user/edit/' + id,
        end: function(index){
            $('#table_list').bootstrapTable("refresh");
        }
    });
}
function add(){
    layer.open({
        type: 2,
        title: '用户添加',
        shadeClose: true,
        shade: false,
        area: ['893px', '600px'],
        content: '${ctx!}/admin/user/add',
        end: function(index){
            $('#table_list').bootstrapTable("refresh");
        }
    });
}
function grant(id){
    layer.open({
        type: 2,
        title: '关联角色',
        shadeClose: true,
        shade: false,
        area: ['893px', '600px'],
        content: '${ctx!}/admin/user/grant/'  + id,
        end: function(index){
            $('#table_list').bootstrapTable("refresh");
        }
    });
}
function del(id){
    layer.confirm('确定删除吗?', {icon: 3, title:'提示'}, function(index){
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "${ctx!}/admin/user/delete/" + id,
            success: function(msg){
                layer.msg(msg.message, {time: 2000},function(){
                    $('#table_list').bootstrapTable("refresh");
                    layer.close(index);
                });
            }
        });
    });
}

function detailFormatter(index, row) {
    var html = [];
    html.push('<p><b>描述:</b> ' + row.description + '</p>');
    return html.join('');
}
