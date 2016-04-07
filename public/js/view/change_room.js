/**
 * Created by caijf on 15/11/13.
 */
$(function(){
    var $modal = $("#myModal"),
        $modalBody = $modal.find(".modal-body");
    function delCartInfo(ids) {
        $.post('/user/remove_carts', {ids: ids}, function (result) {
            if (result && result.resultCode === 0) {
                for (index in ids) {
                    location.reload();
                    //$("[data-cartId='" + ids[index] + "']").hide();
                }
            } else {
                $modalBody.html($('<p class="text-warning">').text('删除购物车失败,请重新加入！'));
                $modal.modal('show');
            }
        });
    }
    $("#createorder").click(function (e) {
        var param = [];
        var carts = $(':checked.single');
        $.each(carts, function (index, cart) {
            var $cart = $(cart).closest('tbody');
            param.push($cart.data('cartid'));
        });
        if (carts.length > 4) {
            $modalBody.html($('<p class="text-warning">').text('每个订单中的产品不能超过4件，请重新选择！'));
            $modal.modal('show');
        } else if (carts.length != 0) {
            $.post('/order/addorder', {
                    cartIds: param
                }, function (res) {
                    if (res && res.resultCode === 0) {
                        location.href = '/user/orders';
                    } else if (res.resultCode === -2) {
                        $modalBody.html($('<p class="text-warning">').text('每个订单中的产品不能超过4件，请重新选择！'));
                        $modal.modal('show');
                    } else if (res.resultCode === -100) {
                        location.href = res.redirectUrl;
                    } else {
                        $modalBody.html($('<p class="text-warning">').text('生成订单失败，请重新再试'));
                        $modal.modal('show');
                    }
                }
            );
        } else {
            $modalBody.html($('<p class="text-warning">').text('请选择要加入订单的产品！'));
            $modal.modal('show');
        }
    });
    $("#clearselected").click(function () {
        var carts = $(':checked.single');
        var params = [];
        $.each(carts, function (index, cart) {
            var $cart = $(cart).closest('tbody');
            params.push($cart.data('cartid'));
        });
        delCartInfo(params);
    });

    var cartsLen = $("#cartListLen").val() || 0;

    $('[type=checkbox]').click(function (e) {
        var totalPrice = 0;
        if ($(e.currentTarget).attr('id') == 'selectall') {
            $.each(document.getElementsByClassName('single'), function (index, val) {
                val.checked = e.currentTarget.checked;
            })
        } else {
            document.getElementById('selectall').checked = (cartsLen == $(':checked.single').length);
        }
        var carts = $(':checked.single');
        $.each(carts, function (index, cart) {
            totalPrice += +($(cart).closest('tbody').data('price'));
        });
        $('#totalPrice').text(totalPrice);
    });
})