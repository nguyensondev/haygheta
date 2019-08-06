$(function() {
    $('#add_episodes').click(function(e) {
        debugger
        var id =  $(this).attr("data-id")
        location.href = "/admin/add_episodes/"+id;
    });
});
