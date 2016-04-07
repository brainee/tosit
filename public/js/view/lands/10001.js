'use strict';
$(function () {
  // 日期控件绑定
  $('.form_datetime').datetimepicker({
    language: 'zh-CN',
    weekStart: 1,
    todayBtn: 1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    forceParse: 0,
    showMeridian: 1
  });
  $('.form_date').datetimepicker({
    language: 'zh-CN',
    weekStart: 1,
    todayBtn: 1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    minView: 2,
    forceParse: 0
  });

  var exceptionFn = function (domId) {
    $("#" + domId).addClass("blankTip").focus();
  };

  var checkForm = function () {
    var checkArray = [], result = true;

    checkArray.push({key: "userName", value: $("#userName").val()});
    checkArray.push({key: "marryDate", reg: /^(\d{4})\-(\d{2})\-(\d{2})$/, value: $("#marryDate").val()});
    checkArray.push({key: "birth", reg: /^(\d{4})\-(\d{2})\-(\d{2})$/, value: $("#birth").val()});
    checkArray.push({key: "height", reg: /^\d{1,3}$/, value: $("#height").val()});
    checkArray.push({key: "weight", reg: /^\d{2,3}$/, value: $("#weight").val()});
    checkArray.push({key: "area", value: $("#area").val()});
    checkArray.push({key: "phoneNumber", reg: /^0?1[3|4|5|8][0-9]\d{8}$/, value: $("#phoneNumber").val()});
    checkArray.push({key: "vCode", reg: /^[0-9]\d{3}$/, value: $("#vCode").val()});
    checkArray.push({key: "bookDate", value: $("#bookDate").val()});

    $.each(checkArray, function (i, o) {
      if (o.value === "" || o.value == '所在地区') {
        exceptionFn(o.key);
        result = false;
        return false;
      }
      else {
        var t = $("#" + o.key);
        t.removeClass("blankTip");
        if (o.reg && !o.reg.test(o.value)) {
          exceptionFn(o.key);
          result = false;
          return false;
        } else {
          result = true;
        }
      }
    });

    return result;
  };

  $("#btnSubmit").on("click", function () {
    if (!checkForm())
      return;

    var sendBody = $('#personalForm').serialize();
    $.post('/lands/input10001', sendBody, function (data) {
      var mbody =$('#myModal .modal-body');
      if(!data){
        mbody.html($('<p class="text-warning">').text('服务器返回有误'));
      }else{
        if(data.state=='ok') {
          mbody.html($('<p class="text-success">').text('提交成功，稍后会有工作人员联系您！'));
        }else{
          mbody.html($('<p class="text-danger">').text(data.msg));
        }
      }
      $('#myModal').modal('show');
      /*var error = $('.alert-danger'),
        warning = $('.alert-warning'),
        success = $('.alert-success');
      if (!data) {
        error.text('服务器返回有误');
        error.removeClass('hide');
      }
      if (data.state == 'ok') {
        success.removeClass('hide');
        error.addClass('hide');
      } else {
        error.text(data.msg).model('show');
        error.removeClass('hide');
        success.addClass('hide');
      }*/
    });
  });

  var sendVCodeFn = function () {

    var $phoneNumber = $("#phoneNumber");
    if ($phoneNumber.val() === "") {
      exceptionFn("phoneNumber");
      return;
    }
    var reg = /^0?1[3|4|5|8][0-9]\d{8}$/;
    if (!reg.test($phoneNumber.val()) || $phoneNumber.val().length != 11) {
      exceptionFn("phoneNumber");
      return;
    }

    $("#sendVCode").off("click");

    var toggleSendStatusFn = function () {

      //$("#sendVCode").addClass("greyBtn");
      var $sendVCode = $("#sendVCode");
      var oldBackground = $sendVCode.css("background-color");
      var oldBorder = $sendVCode.css("border-color");

      $sendVCode.css("background-color", "grey");
      $sendVCode.css("border-color", "black");

      var leftSecond = 60;

      var changeSecond = setInterval(function () {
        leftSecond--;
        var $sendVCode = $("#sendVCode");
        if (leftSecond === 0) {
          clearInterval(changeSecond);
          //$("#sendVCode").removeClass("greyBtn");

          $sendVCode.css("background-color", oldBackground)
          $sendVCode.css("border-color", oldBorder);

          $sendVCode.text("发送验证码");

          $sendVCode.on("click", function () {

            sendVCodeFn();
          });

          return;
        }
        var textDisplay = leftSecond + "秒后重发";
        $sendVCode.text(textDisplay);
      }, 1000);
    };

    toggleSendStatusFn();

    $.post('/utils/sms', {mobile: $phoneNumber.val()}, function (data) {
      if (data && data.state == "ok") {
        //todo:提示验证码已发送
      }
    });
  };

  $("#sendVCode").on("click", function () {
    sendVCodeFn();
  });

});