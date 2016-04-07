/**
 * Created by caijf on 15/11/13.
 */
$(function(){
    $('#btnFind').on('click', function () {
        var tel = $('#txtMobile').val();
        $.post('/find', {phone: tel}, function (result) {
            if (result == 'ok') {
                alert('找回密码失败');
            }
            else {
                alert('密码已发送至您的手机');
                location.href = "login";

            }
        });
    });
})