$(function () {

    //获取文章分类的列表
    function initArtCateList() {

        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章分类失败！')
                }

                var htmlStr = template('tpl-table', res)

                $('tbody').html(htmlStr)
                // layui.layer.msg('获取文章分类列表成功！')
            }
        })
    }

    initArtCateList()

    var indexAdd = null
    //为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    //通过代理的形式 为form-add 表单 绑定submit 事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('新增分类失败！')
                }
                //根据索引关闭对应的弹出层
                layui.layer.close(indexAdd)

                initArtCateList()
                layui.layer.msg('新增分类成功！')
            }
        })
    })
    //通过代理形式 来为 btn-edit 编辑按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function (e) {
        //弹出一个修改文章分类的层
        indexEdit = layui.layer.open({
            type: 1,
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
            area: ['500px', '250px']
        })

        // var values = $(this).parent().siblings('td')
        // $('#form-edit [name=name]').attr('value', values[0].innerHTML)
        // $('#form-edit [name=alias]').attr('value', values[1].innerHTML)
        // $('#form-edit [name=id]').attr('value', $(this).attr('data-id'))


        //获取分类数据 渲染到弹出层上
        var id = $(this).attr('data-id')

        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                layui.form.val('form-edit', res.data)
            }
        })
    })

    //通过代理的形式  为修改分类的表单 绑定 submit 事件
    $('body').on('submit', '#form-edit', function (e) {

        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('修改分类失败！')
                }

                layui.layer.msg('修改分类成功！')
                //根据索引关闭对应的弹出层
                layui.layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    //通过代理形式 来为 btn-delete 删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function (e) {

        var id = $(this).attr('data-id')

        //提示用户是否删除
        layui.layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                // url: `/my/article/deletecate/${id}`,
                url: '/my/article/deletecate/' + id,
                success: function (res) {

                    if (res.status !== 0) {

                        return layui.layer.msg('删除分类失败！')

                    }

                    layui.layer.msg('删除分类成功！')
                    //根据索引关闭对应的弹出层
                    layui.layer.close(index)
                    initArtCateList()
                }
            })

        });


    })
})