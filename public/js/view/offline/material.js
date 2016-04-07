/**
 * Created by lmmeng on 2015-10-26.
 */
$(function () {

    var classPostType = "add", itemPostType = "add", key, cclass, clabel, ctype,
        tempDataSource, tempObj, tempItems = [],
        $editTitle = $('#editTitle');

    // 物料类型列表事件绑定
    var bindingItemClick = function () {
        $(".trItem").on("click", function () {
            cname = $(this).find(".name").text();
            cindex = $(this).find(".index").text();

            $('#name').val(cname);
            $('#index').val(cindex);
            $('#frmItems').show();
            $('#frmClass').hide();
            itemPostType = "edit";
            $editTitle.text(' 编辑物料');
        });

        $(".delItem").on("click", function () {
            var delIndex = $(this).data('index');
            if (showModal && typeof showModal === 'function') {
                showModal('删除确认', '是否真的删除该物料？', null, function () {

                    _.pullAt(tempItems, delIndex);

                    tempObj.items=tempItems;

                    // var data = "active=false";
                    $.post("/offline/material/edit/" + id, tempObj, function (res) {
                        if (res && res == 'ok') {
                            //location.reload();
                        } else {
                            alert("删除失败，请重试。")
                        }
                    });
                });
            }
        });
    };
    // 绑定物料列表事件
    var bindingClickEvent = function () {
        $(".trClass").on("click", function () {
            id = $(this).data('id');
            key = $(this).data('key');
            cclass = $(this).find(".cclass").text();
            clabel = $(this).find(".clabel").text();
            ctype = $(this).find(".ctype").text();
            var al = $('#al-items');

            $('#class').val(cclass);
            $('#label').val(clabel);

            if (ctype == "文字") {
                $("#picRadio").parents("span").removeClass("checked");
                $("#wordRadio").parents("span").addClass("checked");
            }
            else {
                $("#wordRadio").parents("span").removeClass("checked");
                $("#picRadio").parents("span").addClass("checked");
            }

            $('#frmItems').hide();
            $('#frmClass').show();
            classPostType = "edit";

            if (tempDataSource) {

                var filteObj = _.filter(tempDataSource, {
                    'category': key,
                    'class': cclass,
                    'label': clabel,
                    'type': ctype
                });

                $("#tbItem").html('');
                al.hide();

                if (filteObj && filteObj[0].items) {
                    tempObj = filteObj[0];
                    tempItems = filteObj[0].items;

                    $.each(tempItems, function (i, res) {

                        var tempTr = '<tr class="trItem" data-id="' + filteObj[0]._id + '"><td class="index">' + i + '</td><td class="name">' + res.name + '</td><td>' + res.icon +
                            '</td><td class="center"><a data-index="' + i +
                            '" class="btn btn-mini btn-danger delItem"><i class="halflings-icon white trash"></i></a></td></tr>';

                        $("#tbItem").append(tempTr);
                    });
                    bindingItemClick();

                }
                else {

                    $('#tbItem tr').remove();
                    al.show().text('暂无数据');
                }
            }
        });

        $(".delClass").on("click", function () {
            var $tr =$(this).parents('tr'),
                id =$tr.data('id');
            if (showModal && typeof showModal === 'function') {
                showModal('删除确认', '是否真的删除该物料类型？', null, function () {
                    var data = "active=false";
                    $.post("/offline/material/del/" + id, data, function (res) {
                        if (res && res == 'ok') {
                            //location.reload();
                            $tr.remove();
                        } else {
                            alert("删除失败，请重试。")
                        }
                    });
                });
            }
        });
    };

    var id;

    $(".trCategory").on("click", function () {
        var me = $(this), key = me.data('key'), al = $('#al-class');

        $('#category').val(key);

        $.get("/offline/material/detail/" + key, function (data) {
            if (data && data.length > 0) {

                tempDataSource = data;

                $("#tbClass").html('');
                al.hide();
                $.each(data, function (i, res) {
                    var tempTr = '<tr class="trClass" data-key="' + key + '" data-id="' + res._id + '"><td class="cclass">' + res.class + '</td><td class="clabel">' + res.label +
                        '</td><td class="ctype">' + res.type + '</td><td class="center"><a id="' + res.category +
                        '" class="btn btn-mini btn-danger delClass"><i class="halflings-icon white trash"></i></a></td></tr>';
                    $("#tbClass").append(tempTr);
                });
                bindingClickEvent();
            } else {
                $('#tbClass tr').remove();
                al.show().text('暂无数据');
            }
        });
    });

    // 编辑物料类型
    $('#firstSave').on('click', function () {
        if (classPostType == "add") {
            $.post('/offline/material/add/', $('#frmClass').serialize(), function (data) {
                //location.reload();
            });
        }
        else {
            $.post('/offline/material/edit/' + id, $('#frmClass').serialize(), function (data) {
                //location.reload();
            });
        }
    });

    $("#addClass").on("click", function () {
        $('#frmItems').hide();
        $('#frmClass').show();
        $('#class').val('');
        $('#label').val('');
        $("#wordRadio").parents("span").removeClass("checked");
        $("#picRadio").parents("span").addClass("checked");
        classPostType = "add";
        $editTitle.text(' 添加物料类型');
    });

    $('#addItem').on("click", function () {
        $('#frmItems').show();
        $('#frmClass').hide();
        $('#name').val('');
        itemPostType = "add";
        $editTitle.text(' 添加物料');
    });

    // 编辑物料项目
    $('#secondSave').on('click', function () {

        var itempost;
        if (itemPostType == "add") {

            var addItem = {
                "name": $("#name").val(),
                "icon": ""
            }

            tempItems.push(addItem);

            itempost = {
                category: key, // key
                class: cclass, // 款式、面辅料、特殊工艺
                label: clabel, // 领型、口袋型等...
                type: ctype, // 图片、文字
                items: tempItems
            }

            $.post('/offline/material/edit/' + id, itempost, function (data) {
                //location.reload();
            });
        }
        else {

            var editItem = {
                "name": $("#name").val(),
                "icon": ""
            }

            _.pullAt(tempItems, $("#index").val());

            tempItems.push(editItem);
            console.log(tempItems);

            tempObj.items = tempItems;

            $.post('/offline/material/edit/' + id, tempObj, function (data) {
                //location.reload();
            });
        }
    });


});