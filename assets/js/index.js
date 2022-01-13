$(function () {
    // 调用getUserInfo 获取用户基本信息
    getUserInfo()

    $('#btnLogout').on('click', function () {
        //提示用户是否退出
        layui.layer.confirm('确定要退出吗？', {
            icon: 3,
            title: '提示',
            btn: ['确定了', '取消吧']
        }, function (index) {
            //1.清空本地存储的token
            localStorage.removeItem('token')
            //2.重新跳转到首页
            location.href = '/login.html'
            //关闭 comfirm 询问框
            layui.layer.close(index)
        });
    })
})

//获取用户的基本信息
function getUserInfo() {
    $('.layui-nav-img').hide()
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            //调用渲染用户的头像
            renderAvatar(res.data)
        }
    })
}

//渲染用户的头像
function renderAvatar(user) {
    // 1.获取用户名称
    var name = user.nickname || user.username
    //2.设置欢迎的 文本
    // $('#welcome').html(`欢迎 ${name}`)
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)

    //3. 按需渲染用户头像
    if (user.user_pic) {
        //3.1渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //3.2渲染文字头像
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}

function setNavSelected(origin, current) {
    $(origin).addClass('layui-this')
    $(current).removeClass('layui-this')
}