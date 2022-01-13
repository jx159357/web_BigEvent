// 每次发起$.ajax或$.post或$.get请求之前，都会先调用$.ajaxPrefilter
// $.ajaxPrefilter的options 参数时 $.ajax或$.post或$.get的对象
$.ajaxPrefilter(function (options) {

    //统一为有权限的接口 设置headers 请求头
    // if (options.url.startsWith('/my')) 
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //全局统一挂载complete 回调函数
    options.complete = function (res) {
        console.log(res)
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //1.强制清空token
            localStorage.removeItem('token')
            //2. 强制跳转到 登录页面
            location.href = '/login.html'
        }
    }
    //在发起真正的ajax请求之前，统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
})