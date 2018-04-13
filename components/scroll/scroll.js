/**
 * 滚轮放大缩小图片插件
 * 使用方法：
 * 1、在html文件中添加script标签加载scroll.js脚本
 * 2、对需要通过滚轮放大缩小的img元素添加scroll属性
 * 3、在页面上点击带有scroll标签的img元素，页面出现带有蒙版的图片查看，然后可以进行滚轮放大缩小图片。
 * 4、点击蒙版后图片查看功能消失。
 */
(function ($) {
  $(document).ready(function () {
      var scrollImage = function (event) {
          var imgWidth = $('#scrollTarget').width();
          imgWidth += parseInt(imgWidth * ( event.delta * 0.02));
          $('#scrollTarget').width(imgWidth > 50 ? imgWidth : 50);
          return false;
      }
      if ($('#scrollWrapper').length === 0) {
          $('body').append('<div id="scrollWrapper" style="overflow: hidden;display:none;position: fixed;top:0;left:0;right:0;bottom:0">' +
      '<div style="position: absolute;top:0;left:0;right:0;bottom:0;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#BF000000,endColorstr=#BF000000);background: rgba(0,0,0,0.3)"></div>' +
      '<div style="position: absolute;top:0;left:0;right:0;bottom:0;overflow: auto;">' +
        '<div id="scrollTargetParent" style="margin: 0 auto; text-align: center;" />' +
      '</div>' +
    '</div>');
      }
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var mousewheel = userAgent.indexOf("Firefox") > -1 ? 'DOMMouseScroll' : 'mousewheel';
//		$('#scrollWrapper').on(mousewheel, function(event){
//			event.stopPropagation();
//			var originalEvent = event.originalEvent;
//			event.delta = (originalEvent.wheelDelta) ? originalEvent.wheelDelta / 120 : -(originalEvent.detail) / 3;
//			scrollImage(event);
//			return false;
//		})
  var addEvent = (function(){
    if (window.addEventListener) {
      return function(el, sType, fn, capture) {
        el.addEventListener(sType, fn, (capture));
      };
    } else if (window.attachEvent) {
      return function(el, sType, fn, capture) {
        el.attachEvent("on" + sType, fn);
      };
    } else {
      return function(){};
    }
  })();
  addEvent(document.getElementById('scrollWrapper'), mousewheel, function(event){
    event = window.event || event;
    event.delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail) / 3;
    scrollImage(event)
    var event = event || window.event;  //用于IE  
    if(event.preventDefault) {
      event.preventDefault();  //标准技术  
    }
    if(event.returnValue) {
      event.returnValue = false;  //IE  
    }
    return false; 
  } , false);
  $('body').on('click', '#scrollWrapper', function () {
    $('#scrollWrapper').hide();
    $('#scrollTargetParent').innerHTML = '';
  });
  $('body').on('click', 'img[scroll="true"]', function (event) {
    $('#scrollTargetParent').html('<img border="0" id="scrollTarget" src="' + event.target.src + '" style="margin: 0 auto;display: inline-block;" />');
    $('#scrollWrapper').show();
  });
  });
})(jQuery)
