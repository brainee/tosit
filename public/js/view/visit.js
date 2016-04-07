/**
 * Created by caijf on 15/11/13.
 */
$(function () {
    // 日期控件绑定
    $('.form_datetime').datetimepicker({
        language: 'zh-CN',
        format: 'yyyy-mm-dd hh:ii',
        weekStart: 1,
        // todayBtn: 1,
        autoClose: 1,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0,
        pickerPosition: 'bottom-right',
        showMeridian: 1,
        autoclose: true
    });
    $('.form_date').datetimepicker({
        language: 'zh-CN',
        format: 'yyyy-mm-dd',
        weekStart: 1,
        // todayBtn: 1,
        autoClose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0,
        pickerPosition: 'bottom-right',
        autoclose: true
    });

    // validate 验证插件配置
    $.validator.setDefaults({
        errorElement: 'p',
        errorClass:'text-danger'
    });

    // 获取dom
    var $personalForm = $("#personalForm"),
        $modal = $("#myModal"),
        $modalBody = $modal.find(".modal-body");

    // 表单提交
    $("#btnSubmit").on("click", function () {
        $personalForm.submit();
    });

    // 表单重置
    function resetForm(){
        $personalForm[0].reset();
    }

    // 表单验证
    $personalForm.validate({
        // 通过验证后执行
        submitHandler:function(){
            var sendBody = $personalForm.serialize();
            $.post('/reserve/visit', sendBody, function (data) {
                if (!data) {
                    $modalBody.html($('<p class="text-warning">').text('服务器返回有误'));
                } else {
                    if (data.state == 'ok') {
                        $modalBody.html($('<p class="text-success">').text('提交成功，稍后会有工作人员联系您！'));

                        // 提交成功后重置
                        resetForm();

                        // 点击确定返回 预约页面
                        $modal.find(".btn-primary").on("click", function(){
                            location.href = '/user/record';
                        })

                    } else {
                        $modalBody.html($('<p class="text-danger">').text(data.msg));
                    }
                }
                $modal.modal('show');
            });
        }
    });

});