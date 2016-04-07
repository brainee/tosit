/**
 * Created by caijf on 15/11/13.
 */
$(function(){
    $('#modify').on('click', function () {
        var tel = $('#txtMobile').val(),
            oldpwd = $('#oldpwd').val(),
            pwd = $('#pwd').val(),
            pwdag = $('#pwdag').val();

        $.post('/user/change_pwd', {phone: tel, oldpwd: oldpwd, password: pwd}, function (result) {

            if (result == 'fail') {

                alert('修改密码出错，请重试');
            }
            else {
                alert('修改密码成功');
                location.href = "login";
            }
        });
    });
})