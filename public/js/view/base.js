/**
 * Created by caijf on 15/11/13.
 */
// 全局变量M
var M = {};

// M.util 工具方法
M.util = typeof util !== 'undefined' ? util : {};

// 可视区宽度
M.util.winWidth = $(window).outerWidth();

(function ($) {
    // search
    var $searchForm = $('#searchForm'),
        $searchInput = $('#searchTxt'),
        $searchBtn = $('#searchBtn'),
        $searchVal = $('#searchVal');

    if ($searchVal.val() !== '') {
        $searchInput.val($searchVal.val());
    }

    // 搜索
    function search() {
        var value = $.trim($searchInput.val());

        // 关键字不能为空
        if (value === '') {
            return false;
        }

        return true;

    }

    // 事件处理
    $searchForm.on('submit', function (e) {
        return search();
    });

    $searchBtn.on('click', function (e) {
        $searchForm.submit();
    })
})(jQuery);

(function ($) {
    // nav 导航
    var $nav = $(".navbar"),
        $navList = $nav.find("li");

    var CLASS_HIGHLIGHT = "active";

    // 导航高亮
    function lighthighNav(index) {
        $navList.removeClass(CLASS_HIGHLIGHT).eq(index).addClass(CLASS_HIGHLIGHT);
    }

    function navCurrent(path) {
        if (path.indexOf("/about/brand") > 0) {
            lighthighNav(1);
        } else if (path.indexOf("/product") > 0 || path.indexOf("/detail") > 0) {
            lighthighNav(2);
        } else if (path.indexOf("/about/contact") > 0) {
            lighthighNav(3);
        } else {
            lighthighNav(0);
        }
    }

    var pathname = "/" + location.pathname;
    navCurrent(pathname);

    function createSubHtml(data) {
        var html = "";
        html += "<ul class='dropdown-menu'>";
        for (var i = 0, len = data.length; i < len; i++) {
            html += '<li role="separator" class="dropdown-menu-title"><span class="caret"></span>' + data[i].cat + '</li>';

            for (var m = 0, n = data[i].list.length; m < n; m++) {
                html += "<li><a href= '/product?t=" + data[i].type +'&cat=' + data[i].list[m].name + "'>" + data[i].list[m].name + "</a></dd>";
            }
        }
        html += "</ul>";
        return html;
    }

    $.get('/json/attr', function (data) {
        $navList.eq(2).addClass("dropdown").append(createSubHtml(data));
    });

    $navList.hover(function () {
        var $this = $(this);
        $this.addClass("hover");
    }, function () {
        var $this = $(this);
        $this.removeClass("hover");
    });

}(jQuery))