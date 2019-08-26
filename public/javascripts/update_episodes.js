$(function () {
    $(document).ready(function () {

        $('#btnUploadThumnail').click(function (event) {
            event.preventDefault();
            var xhr = new XMLHttpRequest();
            var filename = $('#imgDataThumnail').val();
            $.ajax({
                type: 'POST',
                url: "https://api.openload.co/1/file/ul?login=25c363bb39ee91f2&key=UmUrpthb&file=" + filename,
                data: {
                },
                success: function (data) {

                    console.log(data)
                    if (data.status == 200) {
                        let temp = data.result.url.replace(/\s/g, '')
                        let array = temp.toString().split('/')
                        let id = array[4]
                        console.log(id)
                        $.ajax({
                            type: 'POST',
                            url: "https://api.openload.co/1/file/dlticket?login=25c363bb39ee91f2&key=UmUrpthb&file=" + id,
                            data: {
                            },
                            success: function (result) {
                                console.log(result)
                                // xhr.open("POST", "https://api.openload.co/1/file/dl?file="+id+"&ticket="+result.result.ticket)
                                // xhr.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:3000")
                                // xhr.setRequestHeader("Access-Control-Allow-Credentials", "true")
                                // xhr.setRequestHeader("Access-Control-Expose-Headers", "FooBar")
                                // xhr.setRequestHeader("Content-type", "application/json")
                                // let data = {
                                //     headers: {
                                //         Accept: "application/json",
                                //         Origin: "https://api.openload.co"
                                //     },
                                //     method: 'GET'
                                // };
                                // xhr.send(JSON.stringify(data));
                                $.ajax({
                                    headers: {
                                        'Access-Control-Allow-Credentials' : true,
                                        'Access-Control-Allow-Origin':'http://localhost:3000',
                                        'Access-Control-Allow-Methods':'POST',
                                        'Access-Control-Allow-Headers':'application/json',
                                      },
                                    type: 'POST',
                                    url: "https://api.openload.co/1/file/dl?file="+id+"&ticket="+result.result.ticket,  
                                    data:{                   
                                    },              
                                    success : function (result){

                                        console.log(result)

                                    },
                                    error : function (error){

                                        console.log(error)

                                    }
                                });

                            }
                        });
                    }
                }
            });
        })


    })
})