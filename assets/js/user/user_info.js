$(function () {
    // layui.form.verify({
    //     nickname: [/^[\S]{1,6}$/, '用户昵称只能是1~6个字符，且不能包含空格']
    // })

    //layui 的自定义的校准规则
    layui.form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须1~6个字符之间！'
            }
        }
    })

    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败！')
                }
                /* $('.layui-form [name=username]').attr('value', res.data.username)
                 $('.layui-form [name=nickname]').attr('value', res.data.nickname)
                 $('.layui-form [name=email]').attr('value', res.data.email) */

                //layui 里自带的 lay-filter 可以快速将data赋值给form
                layui.form.val('formUserInfo', res.data)
            }
        })

    }

    initUserInfo()

    $('#btnReset').on('click', function (e) {

        //阻止表单的默认提交行为
        e.preventDefault()
        initUserInfo()
    })

    //监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        //阻止表单的默认提交行为
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            //快速拿到表单里的数据
            data: $(this).serialize(),
            success: function (res) {
                layui.layer.msg(res.msg)

                if (res.status !== 0) {
                    return layui.layer.msg('更新用户信息失败!')
                }
                layui.layer.msg('更新用户信息成功！')

                //调用父页面中的方法，重新渲染用户的头像和用户信息
                //getUserInfo()函数在index.js里面用于渲染用户头像和用户信息
                window.parent.getUserInfo()
            }
        })
    })
})