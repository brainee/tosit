/**
 * Created by caijf on 15/11/13.
 */
$(function(){
    $("#btnSave").on("click", function () {
        var form = $('#userForm').serialize();
        $.post("/user/info", form, function (res) {
            if(res){
                location.reload();
            }
        });
    });
})