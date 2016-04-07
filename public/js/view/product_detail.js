/**
 * Created by caijf on 15/11/13.
 */
$(function(){
    var $modal = $("#myModal"),
        $modalBody = $modal.find(".modal-body");
    var islogin = $('#isLogin').val();
        // 左侧预览图切换
        $('#carousel').flexslider({
            animation: "slide",
            controlNav: false,
            animationLoop: false,
            itemWidth: 70,
            itemMargin: 8,
            asNavFor: '#slider'
        });

    $('#slider').flexslider({
        controlNav: false,
        directionNav: false,
        animationLoop: false,
        sync: "#carousel"
    });


    // 选择类型
    var $prop = $(".prop");

    // 显示浮层
    function showPropDrop($el) {
        $prop.find(".dropdown.active").removeClass("active");
        $el.parents(".dropdown").addClass("active");
    }

    // 隐藏浮层
    function hidePropDrop() {
        $prop.find(".dropdown.active").removeClass("active");
    }

    // 替换数据
    function changePropData($oldIcon, $newIcon) {
        var $oldTxt = $oldIcon.siblings(".select-txt"),
            $newTxt = $newIcon.siblings(".select-txt");

        var $parentDl = $newIcon.parents(".active"),
            $dropdownMenuUl = $parentDl.find(".dropdown-menu ul");

        var _html = '<li>';

        if ($parentDl.hasClass("dropdown-txt")) {
            _html += '<span class="select-icon">' + $oldIcon.text() + '</span>';

            $oldIcon.html($newIcon.text() + '<i class="icon-select-state"></i>');
        } else {
            _html += '<span class="select-icon"><img src="' + $oldIcon.find("img").attr("src") + '"/></span>';

            if ($oldTxt.length > 0) {
                _html += '<span class="select-txt">' + $oldTxt.html() + '</span>';
            }

            $oldIcon.find("img").attr("src", $newIcon.find("img").attr("src"));

            if ($newTxt.length > 0) {
                if ($oldTxt.length > 0) {
                    $oldTxt.html($newTxt.html());
                } else {
                    $oldIcon.after($newTxt);
                }
            }
        }

        _html += '</li>';

        $newIcon.parents("li").remove();

        $dropdownMenuUl.append(_html);

        $parentDl.removeClass("active");

    }

    $prop.on("click", ".select-icon-active", function (e) {
        showPropDrop($(this));
        e.stopPropagation();
    }).on("click", ".dropdown-menu", function (e) {
        e.stopPropagation();
    }).on("click", ".dropdown-menu li", function () {
        var $curIcon = $(this).parents(".active").find(".select-icon-active");

        changePropData($curIcon, $(this).find(".select-icon"));

    });

    $(document).bind("click", function () {
        hidePropDrop();
        hidePopBlack();
    })


    // 上门量体 弹窗
    var $popBlack = $(".pop-black"),
        $popClose = $popBlack.find(".pop-close"),
        $btnBlack = $(".btn-black");

    function showPopBlack() {
        $popBlack.show();
    }

    function hidePopBlack() {
        $popBlack.hide();
    }

    $popClose.on("click", function () {
        hidePopBlack();
    })

    $btnBlack.on("click", function (e) {
        showPopBlack();
        e.stopPropagation();
    })

    $popBlack.on("click", function (e) {
        e.stopPropagation();
    })

    // 商品详情
    var $detailWrap = $("#j_detail_box"),
        $detailTrigger = $detailWrap.find(".tab-trigger"),
        $detailTriggerInner = $detailTrigger.find(".tab-trigger-inner"),
        $detailTriggerList = $detailTrigger.find("a"),
        $detailContent = $detailWrap.find(".tab-content"),
        $detailContentList = $detailContent.find(".detail-container");

    var detailLength = $detailTriggerList.length,
        detailContentMarginTop = 50,
        detailTriggerHeight = $detailTrigger.height(),
        detailTop = $detailWrap.offset().top + detailTriggerHeight + detailContentMarginTop;

    var CONFIG = {
        TRIGGER_CUR_CLASS: "current"
    }

    $detailContentList.each(function (i, el) {
        var $this = $(el),
            top = $this.offset().top;
        $this.attr("data-top", top);
    })

    function changeCur(index) {
        $detailTriggerList.removeClass(CONFIG.TRIGGER_CUR_CLASS).eq(index).addClass(CONFIG.TRIGGER_CUR_CLASS);
    }

    function scrollToContent(index) {
        $("body, html").animate({
            scrollTop: (parseInt($detailContentList.eq(index).data("top"), 10) - detailTriggerHeight) + "px"
        })
    }

    $detailTriggerList.on("click", function () {
        var index = $detailTriggerList.index($(this));
        scrollToContent(index);
    })

    $(window).bind({
        "scroll": function (e) {
            var $this = $(this),
                t = $this.scrollTop(),
                difference = t - detailTop;
            if (difference >= 0) {
                $detailTriggerInner.addClass("fixed");

                for (var i = 0; i < detailLength; i++) {
                    if (i < detailLength - 1) {
                        if (t >= parseInt($detailContentList.eq(i).data("top"), 10) - detailTriggerHeight && t < parseInt($detailContentList.eq(i + 1).data("top"), 10) - detailTriggerHeight) {
                            changeCur(i);
                        }
                    } else {
                        if (t >= parseInt($detailContentList.eq(i).data("top"), 10) - detailTriggerHeight) {
                            changeCur(i);
                        }
                    }
                }

            } else {
                $detailTriggerInner.removeClass("fixed");
            }
        }
    })

    var $addCart = $('#addCart');

    $addCart.on('click', function (e) {
        e.stopPropagation();
        var spec = {
            category: $('#dataCategories').val(),
            bagType: $('#bagType').text(),//袋型
            collarType: $('#collarType').text(),//领型
            satinType: $('#satinType').text(),//缎面
            linesType: $('#linesType').text(),//纹路
            color: $('#color img').attr('src'),//颜色
            fringeType: $('#fringeType').text(),//条纹
            fabricType: $('#fabricType').text(),//面料
            material: $('#material').text(),//材料
            technology: $('#technology').text()//工艺
        };
        var pid = $('#dataId').val();
        //$.get('/product/productInfo/' + pid, function (items) {
        var param = {
            userAchieve: $('#archivesType').text(),
            items: {
                materials: spec
            },
            remark: ''
        };
        $.post('/user/add_cart/'+pid, param, function (result) {
            if (result && result.resultCode === 0) {
                location.href = '/user/changing_room';
            } else if (result.resultCode === -100) {
                location.href = result.redirectUrl;
            } else {
                $modalBody.html($('<p class="text-warning">').text('加入购物车失败,请重新加入！'));
                $modal.modal('show');
            }
        });
        //});
    })
})