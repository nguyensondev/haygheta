$(function () {
    $(document).ready(function () {

        $('.btn-success').click(function () {

            // Get the Login Name value and trim it
            var name = $.trim($('#inputTitle').val());

            // Check if empty of not
            if (name === '') {
                alert('Name cannot be empty.');
                return false;
            }
            // Get the Login Name value and trim it
            var url = $.trim($('#inputSummary').val());

            // Check if empty of not
            if (url === '') {
                alert('Url cannot be empty.');
                return false;
            }
        });
        $('#btnUploadAnime').click(function () {
            var id = $('#movieID').val();
            $.ajax({
                url: '/admin/upload_episodes/',
                complete: function (data) {
                    console.log(data);
                }
            });
            //$('#image_file').show();
            // $('#btnUploadAnime').prop('disabled', false);
            // var filename = $('#basicUploadFile').val();

            // var sha1 = SHA1(filename);
            // //alert(filename);
            // //var fd = new FormData($("#fileinfo"));
            // //fd.append("CustomField", "This is some extra data");
            // $.ajax({            
            //     type: 'GET',
            //     url: "https://api.openload.co/1/file/ul?login=25c363bb39ee91f2&key=UmUrpthb&sha1="+sha1,
            //     success: function(datas){
            //         console.log(datas)
            //         $.ajax({
            //             dataType: "jsonp",
            //             crossDomain: true,
            //             headers: {  "Access-Control-Allow-Origin":"*" },                    
            //             type: 'POST',
            //             url: datas.result.url,
            //             contentType: 'application/json',
            //             data:{
            //                 files:filename,
            //                 contentType:"video/mp4"
            //             },
            //             success: function(datass){
            //                 console.log(datass)
            //             }
            //         });
            //     }
            // });
            // $.ajax({
            //     url: 'https://api.openload.co/1/file/ul?login=25c363bb39ee91f2&key=UmUrpthb&file='+filename,  
            //     dataType:"json",
            //     type: 'GET',
            //     success:function(data){
            //         $.ajax({
            //             dataType:"json",
            //             url: 'https://api.openload.co/1/remotedl/add?login=25c363bb39ee91f2&key=UmUrpthb&url='+data.result.url,  
            //             type: 'GET',
            //             // progress: function(e, data) {
            //             //     // Calculate the completion percentage of the upload
            //             //     var progress = parseInt(data.loaded / data.total * 100, 10);
            //             //     console.log(progress)
            //             //     // Update the hidden input field and trigger a change
            //             //     // so that the jQuery knob plugin knows to update the dial
            //             //     // data.context.find('input').val(progress).change();
            //             //     // if(progress == 100) {
            //             //     //     data.context.removeClass('working');
            //             //     // }
            //             // },
            //             success:function(data){
            //                 $.ajax({
            //                     dataType:"json",
            //                     url: 'https://api.openload.co/1/remotedl/status?login=25c363bb39ee91f2&key=UmUrpthb&limit=5&id='+data.result.id,  
            //                     type: 'GET',
            //                     // progress: function(e, data) {
            //                     //     // Calculate the completion percentage of the upload
            //                     //     var progress = parseInt(data.loaded / data.total * 100, 10);
            //                     //     console.log(progress)
            //                     //     // Update the hidden input field and trigger a change
            //                     //     // so that the jQuery knob plugin knows to update the dial
            //                     //     // data.context.find('input').val(progress).change();
            //                     //     // if(progress == 100) {
            //                     //     //     data.context.removeClass('working');
            //                     //     // }
            //                     // },
            //                     success:function(data){
            //                         console.log(data)
            //                     },
            //                     error:function(err){
            //                         console.log(err)
            //                     },
            //                     cache: false,
            //                     contentType: false,
            //                     processData: true
            //                 });
            //             },
            //             error:function(err){
            //                 console.log(err)
            //             },
            //             cache: false,
            //             contentType: false,
            //             processData: true
            //         });

            //     },
            //     error:function(err){
            //         console.log(err)
            //     },
            //     cache: false,
            //     contentType: false,
            //     processData: true
            // });
        });
        // $('#basicUploadFile').live('change', function ()
        // {
        //     debugger
        //     for (var i = 0; i < this.files.length; i++)
        //     {
        //         alert(this.files[i].name);
        //     }
        // });

    })
})