// 处理删除电影数据的逻辑

$(function () {
  $(".dropdown-menu li a").click(function () {
    var selText = $(this).text().substring(0, $(this).text().length - 1);;
    $("#txtTypeID").html($(this).find('span').text())
    $('#txtType').text(selText);
  });
  $("#txtQuery").keyup(function (event) {
    if (event.keyCode == 13) {
      if ($(this).val() === "") {
        alert("Nhập tên anime cần tìm!");

      } else { 
        let query = $(this).val()
        let type = $("#txtTypeID").html()  
        window.location.href = "/search/" + query + "/" + type;         
      }
    }
  });
  $('#btnSearchMovie').click(function (event) {
    if ($("#txtQuery").val() === "") {
      alert("Nhập tên anime cần tìm!");

    } else {
      let query = $("#txtQuery").val()
      let type = $("#txtTypeID").html()
      //$('#btnSearchMovie').attr("href", "/search/" + query + "/" + type)
    }   
  });


});
