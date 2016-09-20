$(function() {
    'use strict';

    //set sidebar accordion
    var Accordion = function(el, multiple) {
        this.el = el || {};
        this.multiple = multiple || false;

        var links = this.el.find('.link');
        links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
    }
    Accordion.prototype.dropdown = function(e) {
        var $el = e.data.el,
            $this = $(this),
            $next = $this.next();

        $next.slideToggle();
        $this.parent().toggleClass('open');
    }
    var accordion = new Accordion($('#accordion'), false);

    // set sidebar current
    var setCurrent = function (el) {
        var location = decodeURIComponent(window.location.hash);
        var link = decodeURIComponent(el.attr('href'));
        if(location == link) {
            el.parents("#accordion").find('li').removeClass("current");
            el.parent().addClass('current');
        }
    }
    $('#accordion').find('a').each(function(){
        setCurrent($(this));
    });

    //set device position
    var showDevice = function() {
        if ($(window).width() <= 1024) {
            $('.J-device').css({
                'opacity': '0'
            });
        } else {
            $('.J-device').css({
                'opacity': '1',
                'top': ($(window).height() - $('.J-device').height() + 10) / 2
            });
        }
    };
    $(window).on('resize', function(){
        showDevice();
    });

    //set demo highlight
    $('pre code.html-demo').each(function(i, block) {
        var el = $(this);
        el.after('<textarea class="J-code demo-code">' + el.text() + '</textarea>');
    });
    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
        $(this).after('<div class="J-code-btngroup code-btngroup"></div>');
        $(this).parent().find('.J-code-btngroup').append('<span class="J-code-demo-copy highlight-copy" data-clipboard-action="copy">复制代码</span>');
        if($(block).hasClass('html-demo')) {
            $(this).parent().find('.J-code-btngroup').append('<span class="J-code-demo-show">查看DEMO</span>');
        }
    });

    //set demo event
    $('pre code').on('mouseover',function(e){
        $(this).next().css('opacity', '1');
    });
    $('pre code').on('mouseout',function(e){
        $(this).next().css('opacity', '0');
    });
    $('.J-code-btngroup').on('mouseover',function(e){
        $(this).css('opacity', '1');
    });
    $('.J-code-btngroup').on('mouseout',function(e){
        $(this).css('opacity', '0');
    });
    $('body').on('click', '.J-code-demo-show',function(e){
        if($('.J-device').css('opacity') == 0) {
            showDevice();
        }
        var demoText = $(this).closest('pre').find('.J-code').val();
        var demoCss = $(this).closest('pre').prev().hasClass('html-demo-style') ? $(this).closest('pre').prev().html() : '';
        if(demoText != '') {
            var device = $('.J-device').find('iframe');
            var postMessage = function() {
                device[0].contentWindow.postMessage(demoCss + demoText ,'*');
            }
            device.on('load',function(e){
                postMessage();
            });
            postMessage();
        }
    });

    //code copy
    var clipboard = new Clipboard('.J-code-demo-copy', {
        target: function(trigger) {
            return $(trigger).parent().parent().find('code')[0];
        }
    });
    clipboard.on('success', function(e) {
        var el = $(e.trigger);
        var sourceText = el.html();
        el.html('复制成功').css('background', '#008C00');
        window.setTimeout(function(){
            el.html(sourceText).removeAttr('style');
        }, 3000);
        e.clearSelection();
    });

    //scrollspy
    $('.J-article-title').each(function(i) {
        var position = $(this).offset();
        $(this).scrollspy({
            min: parseInt(position.top - 50),
            max: parseInt(position.top + $(this).closest('.article').height()),
            onEnter: function(el) {
                var accordion = $("#accordion");
                var current = $('#accordion').find('#' + $(el).attr('data-target-id'));

                //set sidebar
                accordion.find('li').removeClass("current");
                current.addClass('current');
                //sidebar scroll to current
                var currentScrollTop = current.offset().top - accordion.offset().top + $('.accordion').scrollTop();
                if($('.accordion').height() - currentScrollTop < $('.accordion').height()/2 + 50) {
                    accordion.animate({
                        scrollTop: currentScrollTop - $('.accordion').height()/2 + 50
                    }, 250)
                }
            }
        });
    });
    $('.html-demo').each(function(i) {
        var position = $(this).offset();
        $(this).scrollspy({
            min: parseInt(position.top - 150),
            max: parseInt(position.top + $(this).height() - 150),
            onEnter: function(el) {
                $(el).parent().find('.J-code-demo-show').trigger('click');
            }
        });
    });
});




