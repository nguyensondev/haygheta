$(function () {
    $(document).ready(function () {
        var fileinfo = $('#fileinfo');
        var id = $('#movieID').val();
        fileinfo.submit(function () {
            // $.ajax({
            //     type: 'POST',
            //     url: "/admin/upload_episodes",
            //     data : { id : id }
            // }).done(function (response) {
            //     console.log(response)
            // });
            // var filename = $('#basicUploadFile').val();
            // var formData = new FormData();
            // formData.append("basicUploadFile", filename);
            // console.log(formData)
            // $.ajax({
            //     url: '/admin/upload_episodes',
            //     type: 'POST',
            //     data: fileinfo.serialize(),
            //     contentType: false,
            //     processData: false,
            //     successs: function () {
            //         console.log('success');
            //     },
            //     error: function () {
            //         console.log('error');
            //     }
            // })
            // $(this).ajaxSubmit({

            //     error: function(xhr) {
            //         console.log('Error: ' + xhr.status);
            //     },

            //     success: function(response) {
            //         console.log('Success: ' + response);
            //     }
            // });

            // return false;
        });
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
        
        $('#btnUploadThumnail').click(function () {
            var filename = $('#imgDataThumnail').val();
            $.ajax({
                type: 'POST',
                url: "https://api.openload.co/1/file/ul?login=25c363bb39ee91f2&key=UmUrpthb&file="+filename,  
                data:{                   
                },              
                success : function (result){
                    debugger
                    console.log(result)
                }
            });
        })
        $('#btnUploadAnime').click(function () {
            var filename = $('#basicUploadFile').val();
            $.ajax({
                type: 'GET',
                url: "/admin/add_episodes/5d46fc9a5db3e45f564ddb02",                
                success : function (result){
                    console.log(result)
                }
            });
            // var id = $('#movieID').val();
            // $.ajax({
            //     type: 'GET',
            //     url: '/admin/upload_episodes',
            //     success: function (data) {
            //         console.log(data);
            //     }
            // });
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
        function SHA1(msg) {




            function rotate_left(n, s) {


                var t4 = (n << s) | (n >>> (32 - s));


                return t4;


            };




            function lsb_hex(val) {


                var str = "";


                var i;


                var vh;


                var vl;




                for (i = 0; i <= 6; i += 2) {


                    vh = (val >>> (i * 4 + 4)) & 0x0f;


                    vl = (val >>> (i * 4)) & 0x0f;


                    str += vh.toString(16) + vl.toString(16);


                }


                return str;


            };




            function cvt_hex(val) {


                var str = "";


                var i;


                var v;




                for (i = 7; i >= 0; i--) {


                    v = (val >>> (i * 4)) & 0x0f;


                    str += v.toString(16);


                }


                return str;


            };






            function Utf8Encode(string) {


                string = string.replace(/\r\n/g, "\n");


                var utftext = "";




                for (var n = 0; n < string.length; n++) {




                    var c = string.charCodeAt(n);




                    if (c < 128) {


                        utftext += String.fromCharCode(c);


                    }


                    else if ((c > 127) && (c < 2048)) {


                        utftext += String.fromCharCode((c >> 6) | 192);


                        utftext += String.fromCharCode((c & 63) | 128);


                    }


                    else {


                        utftext += String.fromCharCode((c >> 12) | 224);


                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);


                        utftext += String.fromCharCode((c & 63) | 128);


                    }




                }




                return utftext;


            };




            var blockstart;


            var i, j;


            var W = new Array(80);


            var H0 = 0x67452301;


            var H1 = 0xEFCDAB89;


            var H2 = 0x98BADCFE;


            var H3 = 0x10325476;


            var H4 = 0xC3D2E1F0;


            var A, B, C, D, E;


            var temp;




            msg = Utf8Encode(msg);




            var msg_len = msg.length;




            var word_array = new Array();


            for (i = 0; i < msg_len - 3; i += 4) {


                j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 |


                    msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);


                word_array.push(j);


            }




            switch (msg_len % 4) {


                case 0:


                    i = 0x080000000;


                    break;


                case 1:


                    i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;


                    break;




                case 2:


                    i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;


                    break;




                case 3:


                    i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;


                    break;


            }




            word_array.push(i);




            while ((word_array.length % 16) != 14) word_array.push(0);




            word_array.push(msg_len >>> 29);


            word_array.push((msg_len << 3) & 0x0ffffffff);






            for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {




                for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];


                for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);




                A = H0;


                B = H1;


                C = H2;


                D = H3;


                E = H4;




                for (i = 0; i <= 19; i++) {


                    temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;


                    E = D;


                    D = C;


                    C = rotate_left(B, 30);


                    B = A;


                    A = temp;


                }




                for (i = 20; i <= 39; i++) {


                    temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;


                    E = D;


                    D = C;


                    C = rotate_left(B, 30);


                    B = A;


                    A = temp;


                }




                for (i = 40; i <= 59; i++) {


                    temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;


                    E = D;


                    D = C;


                    C = rotate_left(B, 30);


                    B = A;


                    A = temp;


                }




                for (i = 60; i <= 79; i++) {


                    temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;


                    E = D;


                    D = C;


                    C = rotate_left(B, 30);


                    B = A;


                    A = temp;


                }




                H0 = (H0 + A) & 0x0ffffffff;


                H1 = (H1 + B) & 0x0ffffffff;


                H2 = (H2 + C) & 0x0ffffffff;


                H3 = (H3 + D) & 0x0ffffffff;


                H4 = (H4 + E) & 0x0ffffffff;




            }




            var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);




            return temp.toLowerCase();



        }

    })
})