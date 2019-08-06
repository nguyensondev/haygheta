// 处理删除电影数据的逻辑

$(function() {   
    $(".dropdown-menu li a").click(function(){
        var selText = $(this).text();       
        $('#txtType').text(selText);       
  });
  
});
