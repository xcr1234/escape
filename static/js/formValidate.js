/*$表单验证插件
 
 使用validator控件作为验证器
 usage : <validator></validator>
 QQ:530551426
 版本：1.1
 
 [可选]您使用
 <html  xmlns:validator>
 来符合w3c规范。
 */

document.createElement("validator");
document.write("<style>validator{display:none;}</style>");

(function ($) {


    __validator = {};

    $.extend({
        validators: __validator
    });



    __validator.ShowErrorBreak = true;
    __validator.va_selector = "";


    __validator.Exps = {
        url: /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/,
        email: /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
        telphone: /(\(\d{3}\)|\d{3}-)?\d{8}/,
        mobile: /1\d{10}/,
        postcode: /\d{6}/,
        idcode: /\d{17}[\d|X]|\d{15}/,
        date: / ^(^(\d{4}|\d{2})(\-|\/|\.)\d{1,2}\3\d{1,2}$)|(^\d{4}年\d{1,2}月\d{1,2}日$)$/,
        time: /^(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$/


    };


    __validator.opeartors = {};
    __validator.opeartors.RequierdValidator = function (v1, c, v2) {


        return v2.length > 0;
    }
    __validator.opeartors.CompareValidator = function (CompareValidator, control, val) {

        var controlcompare = $(CompareValidator.data("control-compare"));
        var operator = CompareValidator.data("operator");
        switch (operator) {
            case "equal":
                return control.val() == controlcompare.val();
                break;
            case "bigger":
                return control.val() > controlcompare.val();
                break;
            case "smaller":
                return control.val() < controlcompare.val();
                break;
            case "biggerEq":
                return control.val() >= controlcompare.val();
                break;
            case "smallerEq":
                return control.val() <= controlcompare.val();
                break;
            case "NotEq":
                return control.val() != controlcompare.val();
                break;

            default:
                return true;
        }

    }
    __validator.opeartors.RangeValidator = function (RangeValidator, control, val) {
        var max = RangeValidator.data("max");
        var min = RangeValidator.data("min");

        return val >= min && val <= max;


    }

    __validator.opeartors.RegularExpressionValidator = function (RegularExpressionValidator, control, val) {
        var control = $(RegularExpressionValidator.data("control"));

        var exp = RegularExpressionValidator.data("customexp") ? eval(RegularExpressionValidator.data("exp")) : __validator.Exps[RegularExpressionValidator.data("exp")];
        return exp.test(val);
    }
    //解决data-role属性的大小写问题
    __validator.opeartorMatches = {
        requierdvalidator: __validator.opeartors.RequierdValidator,
        comparevalidator: __validator.opeartors.CompareValidator,
        rangevalidator: __validator.opeartors.RangeValidator,
        regularexpressionvalidator: __validator.opeartors.RegularExpressionValidator
    };

    //--控件不存在、role属性错误时的错误解决方案--
    __validator.errColor = "red";
    $(function () {
        $("validator").each(function () {
            var control_selector = $(this).data("control");
            if (control_selector == "" || control_selector == null) {
                $(this).show().css("color", __validator.errColor).text("JavaScript错误CE1：表单验证器control属性为空！")
                        .data("errControl", "true");
                return true;
            }

            if ($(control_selector).length == 0) {

                $(this).show()
                        .css("color", __validator.errColor)
                        .text("JavaScript错误CE2：表单验证器control属性对应的控件（" + control_selector + "）不存在!")
                        .data("errControl", "true");
                return true;

            }
            var role = $(this).data("role");
            if (typeof __validator.opeartorMatches[role.toLowerCase()] != "function") {
                $(this).show()
                        .css("color", __validator.errColor)
                        .text("JavaScript错误CE3：表单验证器role属性配置不正确！")
                        .data("errControl", "true");
                return true;
            }
        });
    });

    //--控件不存在、role属性错误时的错误解决方案--




    __validator.forForm = function (selector, event_checking, event_checked) {

        __validator.form = selector;
        $(selector).on("submit", function () {

            return __validator.opencheck(event_checking, event_checked, selector + " validator");

        });
    }

    __validator.forFormBl = function (selector, hide_other, event_checking, event_checked) {
        __validator.form = selector;
        $(selector).on("submit", function () {
            return $(selector + " validator:not([data-control])").length + $(selector + " validator[data-control='']").length + $(selector + " validator[data-errControl='true']").length > 0 ? false : __validator.opencheck(event_checking, event_checked, selector + " validator");

        });
        $(selector + " validator").each(function () {
            var c = $(this);
            var data = $(this).data("control");
            if (data == undefined || data == "" || $(data).length == 0) {
                return false;
            }
            $(data).on("blur", function () {
                if (hide_other == true)
                    $(selector + " validator").hide();
                __validator.opencheck(event_checking, event_checked, c);
            });

        });

    }




    __validator.opencheck = function (event_checking, event_checked, va_selector) {


        var returnValue = true;
        $(va_selector).each(function () {

            var data = $(this).data("control");

            //--控件不存在或role属性错误时的错误解决方案--
            if (data == "" || data == null) {
                returnValue = false;
                return false;
            }

            var control = $(data);

            if (control.data("errControl")) {

                returnValue = false;
                return false;
            }
            //--控件不存在或role属性错误时的错误解决方案--

            //解决某些浏览器对textarea的val属性兼容问题
            //2.兼容非input标签的情况。
            var val = control.is("textarea") ? control.text() : control.is("input") || control.is("select") ? control.val() : control().text();
            var role = $(this).data("role");
            var opeartor = __validator.opeartorMatches[role.toLowerCase()];

            var op = opeartor($(this), control, val);
            if (typeof event_checking == "function")
                event_checking($(this), control, true);

            if (op == false) {
                __validator.showerror($(this), control);

                returnValue = false;
                if (typeof event_checked == "function")
                    event_checked($(this), control, returnValue);
                if (__validator.ShowErrorBreak == true) {
                    return false;
                }
            }


        }

        );
        return returnValue;
    }



    __validator.showerror = function (validator, control) {

        if (validator.data("showmsg")) {

            control.on("focus", function () {
                validator.hide();
            });
            validator.show();
        }
        if (validator.data("alert")) {
            alert(validator.text());
        }
    }





    __validator.customValidator = function (name, callback) {

        __validator.opeartorMatches[name.toLowerCase()] = function (validtor, control, val) {
            return typeof callback == "function" ? callback(validtor, control, val) : callback == true;
        };


    }
})(jQuery);