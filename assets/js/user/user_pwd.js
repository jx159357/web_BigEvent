$(function () {
    layui.form.verify({
        pwd: [/^[\S]{6,12}$/, '密码长度必须在6~12位，且不能包含空格'],

        newpwd: function (value) {
            var oldPwd = $('.layui-input-block [name=oldPwd]').val()
            if (value === oldPwd) {
                return '新密码不能和旧密码相同'
            }
        },
        repwd: function (value) {
            var newPwd = $('.layui-input-block [name=newPwd]').val()
            if (value !== newPwd) {
                return '两次密码输入不一致'
            }
        }
    })

    $('.layui-form').on('submit', function (e) {

        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {

                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败！')
                }

                layui.layer.msg('更新密码成功！')
                //重置表单 $('.layui-form')[0]可以将表单改为原生的DOM元素
                $('.layui-form')[0].reset()
            }
        })
    })
})