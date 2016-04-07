/**
 * Created by caijf on 15/11/13.
 */
$(function(){
    var $modal = $("#myModal"),
        $modalBody = $modal.find(".modal-body");
    $(".deleteorder").click(function (e) {
        var orderId = $(e.currentTarget).data('orderid');
        $.post('/order/del', {_id: orderId}, function (res) {
            if (res && res.resultCode == 0) {
                location.reload();
            } else if (res.resultCode == -100) {
                location.href = res.redirectUrl;
            } else {
                $modalBody.html($('<p class="text-warning">').text('删除失败，请重试！'));
                $modal.modal('show');
            }
        })
    });
})