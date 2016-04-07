/**
 * Created by caijf on 15/11/13.
 */
$(function(){

    var $filterbar = $("#filterbar"),
        $filterbarInner = $filterbar.find(".filterbar-inner"),
        $filterbarList = $filterbarInner.find(".dropdown");

    var distanceTop = $filterbar.offset().top,
        t = $(window).scrollTop();

    // 筛选栏固定顶部
    function scrollFilterFixed(v) {
        if (v > distanceTop) {
            $filterbarInner.addClass("fixed");
        } else {
            $filterbarInner.removeClass("fixed");
        }
    }
    scrollFilterFixed(t);

    $(window).bind("scroll", function (e) {
        t = $(window).scrollTop();
        scrollFilterFixed(t);
    });

    // 筛选栏下拉
    $filterbarList.on("mouseover", function (e) {
        $(this).addClass("hover");
    }).on("mouseout", function (e) {
        $(this).removeClass("hover");
    });

    // 滚动翻页加载
    var $productCount = $('#productCount'),
        $pageIndex = $('#pageIndex'),
        _pageSize = 9,
        _count = Math.ceil(parseInt($productCount.val(), 10)/_pageSize) || 1, // 总页数
        _index = parseInt($pageIndex.val(), 10) || 1, // 当前页
        url = '/product/list', // 请求url
        btnAjax = true, // ajax 开关，防止滚动重复加载
        $product = $('#productWrap');

    var $footer = $('#footer'),
        $slogan = $('slogan'),
        distanceLoad = 330;

    var distanceScroll = distanceLoad + $(window).height() + $footer.outerHeight() + $slogan.outerHeight(); // 滚动加载位置

    // 创建dom
    function createDom(data){
        var html = '';

        var data = data ? data : [],
            i,len;

        for(i = 0, len = data.length; i < len; i++){

            if(data[i] && data[i]._id){
                html += '<div class="col-md-4 col-sm-6">';
                html += '<a href="/product/' + data[i]._id + '" class="product-item">';
                html += '<img src="' + data[i].images[0].url + '" alt="'+ data[i].images[0].alt +'" />';
                html += '<div class="info">';
                html += '<p class="title">'+ data[i].name +'</p>';
                html += '<p class="desc">'+ data[i].subTitle +'</p>';
                html += '<div class="other"><span class="price"><em>&yen;</em>'+ data[i].originPrice +'</span></div>';
                html += '</div>';
                html += '</a>';
                html += '</div>';
            }

        }

        return html;
    }

    // 产品render dom
    function render(html){
        $product.append(html);
    }

    // 获取url参数
    function getUrlParam(param){
        var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

    // 获取产品分页数据
    function getProducts(){
        btnAjax = false;
        if(_index < _count){

            var t = getUrlParam('t'),
                cat = getUrlParam('cat'),
                key = getUrlParam('key');

            var criteria = {};

            switch (t){
                case 'category':
                    criteria.category = cat;
                    break;
                case 'style':
                    criteria.style = cat;
                    break;
                case 'year':
                    criteria.year = cat;
                    break;
                default :
                    break;
            }

            if(key){
                criteria.key = key;
            }

            criteria.page = _index + 1;
            criteria.pageSize = _pageSize;

            $.ajax({
                type: 'POST',
                url: url,
                data: criteria,
                success: function(data){
                    _index++;
                    btnAjax = true;
                    render(createDom(data));
                },
                error: function(err){
                    // console.log("加载失败");
                    btnAjax = true;
                }
            });
        }
    }

    // 滚动加载
    function loadProduct(){
        if(_index < _count) {
            var t = $(window).scrollTop();

            var domHeight = $('body').height();

            if ((t > domHeight - distanceScroll) && btnAjax) {
                getProducts();
            }
        }
    }

    loadProduct();

    // 事件注册
    $(window).on('scroll', function(e){
        loadProduct();
    })

});