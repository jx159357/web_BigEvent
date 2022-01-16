$(function () {

  initCate()
  // 初始化富文本编辑器
  initEditor()

  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          layui.layer.msg('获取分类失败!')
        }
        //分类下拉框的模板
        var htmlStr = template('tpl-cate', res)

        $('[name=cate_id]').html(htmlStr)
        layui.form.render()
      }
    })
  }

  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  //为选择封面的按钮，绑定点击事件
  $('#btnChooseImage').on('click', function () {

    $('#coverFile').click()

  })

  //监听 coverFile 的change 事件
  $('#coverFile').on('change', function (e) {

    // 1.拿到用户选择的文件
    var file = e.target.files
    //判断用户是否选择了文件
    if (file.length === 0) {
      return layui.layer.msg('请选择封面图片')
    }
    // 2.根据选择的文件，创建一个对应的 URL 地址：
    var newImgURL = URL.createObjectURL(file[0])
    // 3.先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域   
      .attr('src', newImgURL)  // 重新设置图片路径   
      .cropper(options)        // 重新初始化裁剪区域
  })

  // 定义文章的发布状态
  var art_state = '已发布'

  //为存为草稿按钮， 绑定点击事件处理函数
  $('#btnSave2').on('click', function () {
    art_state = '草稿'
  })

  //1.为表单绑定 submit 事件
  $('#form-pub').on('submit', function (e) {

    e.preventDefault()

    //2.基于form 表单 ，快速创建一个 FormData 对象

    var fd = new FormData($(this)[0])

    //3.将文章的发布状态存到 fd中
    fd.append('state', art_state)

    //4.将封面裁剪过后的图片 转化为文件对象
    //得到文件对象后，进行后续的操作
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布   
        width: 400,
        height: 280
      })

      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象    
        // 得到文件对象后，进行后续的操作 

        // 5.将文件对象 存储到 fd中
        fd.append('cover_img', blob)

        //6.发起ajax 数据请求

        publicArticle(fd)
      })

  })

  //定义一个发布文章的方法
  function publicArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      //注意：如果向服务器提交的是 FormData 格式的数据
      //必须添加以下两个配置
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg('文章发布失败！')
        }
        layui.layer.msg('文章发布成功！')

        //发布文章成功后，跳转到文章列表页面
        location.href = '/article/art_list.html'

      }
    })
  }

})