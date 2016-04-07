/**
 * Created by caijf on 15/11/13.
 */
$(function () {
    if($(".menu").length > 0){
        var $menu = $(".menu"),
            $menuList = $menu.find("dd a");
        var pathName = location.pathname;
        $menuList.each(function (i, el) {
            var $this = $(el);
            console.log($this.attr("href"))
            if (pathName.indexOf($this.attr("href")) >= 0) {
                $this.parents("dd").addClass("current");
            }
        })
    }
})