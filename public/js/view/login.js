/**
 * Created by caijf on 15/11/13.
 */
$(function(){
    var $loginBox = $(".login-box"),
        $loginBoxReg = $("#j_regBox"),
        $loginBoxLogin = $("#j_loginBox"),
        $tipReg = $loginBoxReg.find(".tiptext"),
        $tipLogin = $loginBoxLogin.find(".tiptext"),
        $loginBoxRegInputs = $loginBoxReg.find("input"),
        $loginBoxLoginInputs = $loginBoxLogin.find("input"),
        burl = '#{burl}' || '/';

    var CONFIG_LOGIN = {
        INPUT_STATE_ERROR: "has-error",
        INPUT_STATE_SUCCESS: "has-success"
    }

    var hash = location.hash.slice(1);

    function showLoginBox(urlHash) {
        var _hash = urlHash || hash;
        $loginBox.hide();
        if (_hash === "reg") {
            $loginBoxRegInputs.parents(".form-group").removeClass(CONFIG_LOGIN.INPUT_STATE_ERROR);
            $tipReg.hide();
            $loginBoxReg.show();
            location.hash = "reg";
        } else {
            $loginBoxLoginInputs.parents(".form-group").removeClass(CONFIG_LOGIN.INPUT_STATE_ERROR);
            $tipLogin.hide();
            $loginBoxLogin.show();
            location.hash = "login";
        }

    }
    showLoginBox(hash);

    window.onhashchange = function () {
        var _hash = location.hash.slice(1);
        showLoginBox(_hash);
    }

    // 登录注册验证
    var regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
        regPwd = /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,22}$/,
        regVerify = /^[0-9]{4}$/;

    $loginBox.find("input").on("change", function (e) {
        var $this = $(this),
            $formGroup = $this.parents(".form-group"),
            $tiptext = $this.parents(".login-box").find(".tiptext");
        if ($formGroup.hasClass(CONFIG_LOGIN.INPUT_STATE_ERROR)) {
            $formGroup.removeClass(CONFIG_LOGIN.INPUT_STATE_ERROR);
            hideTip($tiptext);
        }
    })

    $("#txtMobile").bind("keyup", function () {
        var btn = $("#btnYzm");
        if (btn.hasClass("disabled")) {
            btn.removeClass("disabled");
        }
    })

    $("#btnLogin").on("click", function () {
        if (checkInput("login")) {
            var form = $('#loginForm').serialize();
            $.post("/login", form, function (data) {
                if (data.state === "ok") {
                    showTip($tipLogin, CONFIG_LOGIN.INPUT_STATE_SUCCESS, data.msg);
                    location.href = burl;
                    return true;
                } else if (data.state == "fail") {
                    showTip($tipLogin, data.msg);
                    return false;
                }
            });
        } else {
            return false;
        }
    });
    $("#btnReg").on("click", function () {
        if (checkInput()) {
            var form = $('#regForm').serialize();
            $.post("/reg", form, function (data) {
                if (data.state == "ok") {
                    showTip($tipReg, CONFIG_LOGIN.INPUT_STATE_SUCCESS, data.msg);
                    location.href = burl;
                    return true;
                } else if (data.state == "fail") {
                    showTip($tipReg, data.msg);
                    return false;
                }
            });
        } else {
            return false;
        }

    });
    $("#btnYzm").on("click", function () {
        var $this = $(this),
            $mobile = $("#txtMobile"),
            value = $mobile.val(),
            $tiptext = $this.parents(".login-box").find(".tiptext");

        if (!$this.hasClass("disabled") && verifyInput($mobile)) {
            $this.addClass("disabled").html("发送中...");
            $.post('/reg_check', {mobile: value}, function (res) {
                if (res.state === "ok") {
                    time($mobile, 120);
                } else if (res.state === "fail") {
                    $("#txtMobile").addClass("error");
                    $this.html("获取验证码");
                    showTip($tiptext, res.msg);
                }
            })
        }
    });

    function time($input, num) {
        var btn = $("#btnYzm");
        var timeoutTime = null;

        var t = num || 60;

        $input.attr("readonly", true);

        btn.html(t + "s后重新获取");

        function countDown() {
            if (t > 0) {
                t--;
                btn.html(t + "s后重新获取");
                timeoutTime = setTimeout(countDown, 1000);
            } else {
                clearTimeout(timeoutTime);
                timeoutTime = null;
                $input.attr("readonly", false);
                btn.removeClass("disabled").html("获取验证码");
            }
        }

        countDown();
    }

    function verifyInput($input) {
        if($input && typeof $input === "object"){
            var type = $input.attr("name"),
                $formGroup = $input.parents(".form-group"),
                value = $input.val(),
                $tiptext = $input.parents(".login-box").find(".tiptext");

            switch (type) {
                case "tel":
                    if (value === "") {
                        $formGroup.addClass(CONFIG_LOGIN.INPUT_STATE_ERROR);
                        showTip($tiptext, "请输入手机号");
                        return false;
                    } else if (!regMobile.test(value)) {
                        $formGroup.addClass(CONFIG_LOGIN.INPUT_STATE_ERROR);
                        showTip($tiptext, "手机号格式不正确");
                        return false;
                    }
                    break;
                case "passwd":
                    if (value === "") {
                        $formGroup.addClass(CONFIG_LOGIN.INPUT_STATE_ERROR);
                        showTip($tiptext, "请输入密码");
                        return false;
                    } else if (!regPwd.test(value)) {
                        $formGroup.addClass(CONFIG_LOGIN.INPUT_STATE_ERROR);
                        showTip($tiptext, "密码格式错误（密码格式：6～22字母、数字、符号）");
                        return false;
                    }
                    break;
                case "passwdag":
                    if (value === "") {
                        $formGroup.addClass(CONFIG_LOGIN.INPUT_STATE_ERROR);
                        showTip($tiptext, "请再次输入密码");
                        return false;
                    } else if (value !== $("#pwd").val()) {
                        $formGroup.addClass(CONFIG_LOGIN.INPUT_STATE_ERROR);
                        showTip($tiptext, "两次输入的密码不一致，请重新输入");
                        return false;
                    }
                    break;
                case "yzm":
                    if (value === "") {
                        $formGroup.addClass(CONFIG_LOGIN.INPUT_STATE_ERROR);
                        showTip($tiptext, "请输入验证码");
                        return false;
                    } else if (!regVerify.test(value)) {
                        $formGroup.addClass(CONFIG_LOGIN.INPUT_STATE_ERROR);
                        showTip($tiptext, "验证码格式错误");
                        return false;
                    }
                    break;
                default :
            }
            var form = $('#regForm').serialize();

            return true;
        }
        return false;
    }

    function checkInput(type) {
        var type = type || "reg";
        var $inputs;
        var boolVerify = true;

        if (type === "reg") {
            $inputs = $loginBoxReg.find("input");
        } else {
            $inputs = $loginBoxLogin.find("input");
        }

        var i, len;
        for (i = 0, len = $inputs.length; i < len; i++) {
            if (!verifyInput($inputs.eq(i))) {
                boolVerify = false;
                break;
            }
            ;
        }

        return boolVerify;

    };

    function showTip($el, state, str) {
        var args = arguments;
        if (args.length === 1 && typeof args[0] === "string") {
            str = args[0];
            $el = $(".login-box:visible .tiptext");
            state = CONFIG_LOGIN.INPUT_STATE_ERROR;
        } else if (args.length === 2 && typeof args[0] === "object") {
            $el = args[0];
            str = args[1];
            state = CONFIG_LOGIN.INPUT_STATE_ERROR;
        }

        $el.addClass(state).html(str).show();
    }

    function hideTip($el) {
        $el = $el || $(".login-box:visible .tiptext");
        $el.hide();
    }
})