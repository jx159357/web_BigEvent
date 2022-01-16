$(function () {

    //定义一个查询的参数对象，将来请求数据的时候
    //需要将请求参数，提交到服务器

    var query = {
        pagenum: 1,     //  页码值 默认请求第一页的数据
        pagesize: 2,    //  每页显示几条数据  默认3条
        cate_id: '',    //  文章分类的id
        state: ''       //  文章的发布状态
    }

    initArticleList()
    initCate()

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()    //获取年份
        var m = padZero(dt.getMonth() + 1)  //获取月份 默认0-11
        var d = padZero(dt.getDate())       //获取日

        var hh = padZero(dt.getHours())    //获取小时
        var mm = padZero(dt.getMinutes())    //获取分钟
        var ss = padZero(dt.getSeconds())    //获取秒

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //获取文章列表的方法
    function initArticleList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: query,
            success: function (res) {

                if (res.status !== 0) {
                    return layui.layer.msg('获取文章列表失败！')
                }
                //使用模板引擎 渲染页面的数据
                var htmlStr = template('tpl-table', res)

                $('tbody').html(htmlStr)
                //调用渲染分页的方法 total 表示一共有多少篇文章
                renderPage(res.total)

            }
        })
    }

    //初始化文章分类 的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取分类数据失败！')
                }
                //调用模板引擎渲染所有分类的分类项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                //需要使用 layui.form.render（） 将页面重新渲染一下
                //通知layui 重新渲染表单区域的UI结构
                layui.form.render()

            }
        })
    }

    //为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function (e) {

        e.preventDefault()
        //拿到表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        // 为查询参数对象 query 中对应的属性赋值
        query.cate_id = cate_id
        query.state = state

        //根据最新的筛选条件 筛选文章列表
        initArticleList()
    })

    //定义 渲染 分页的方法
    function renderPage(total) {
        //调用 layui.laypage.render（）来渲染分页结构
        layui.laypage.render({

            elem: 'pageBox',      //分页容器的Id
            count: total,          //总数据条数
            limit: query.pagesize,  //每页显示几条数据
            curr: query.pagenum,    //默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10, 15],
            //分页发生切换的时候 ，触发jump回调
            //触发jump回调 的方式有两种
            //1.点击页码的时候会触发 jump 回调
            //2.只要调用了 layui.laypage.render（）就会触发jump回调

            jump: function (obj, first) {

                //把最新的页码值赋值到 query 这个查询参数对象
                query.pagenum = obj.curr
                //把最新的条目数赋值到  query 这个查询参数对象中
                query.pagesize = obj.limit

                //根据最新的query获取 对应的数据列表 并渲染表格
                if (!first) {
                    initArticleList()
                }
            }
        })


    }

    //通过代理的形式 ，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function (e) {
        //获取删除按钮的数据
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')

        //询问用户是否要删除文章
        layui.layer.confirm('确定要删除文章吗？', { icon: 3, title: '提示' }, function (index) {

            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg('删除文章失败！')
                    }
                    layui.layer.msg('删除文章成功！')


                    //当数据删除完成后，需要判断这一页是否还有数据
                    //如果没有剩余的数据了，则让页码减一在渲染列表数据
                    if (len === 1) {
                        //如果len的值等于1 证明删除完后，页面上已经没有数据了需要把页码减一
                        //页码值最小要为1
                        query.pagenum = query.pagenum === 1 ? 1 : query.pagenum - 1
                    }
                    initArticleList()
                }
            })

            layer.close(index);
        });
    })

})
