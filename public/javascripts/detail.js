$(document).ready(function () {
  $('#player_haygheta').hide();
  var movieID = $('#movieID').val();
  var user = $('#user').val();
  var episodes = JSON.parse(($('#episodesID').val()));
  var episodesID = episodes._id;
  var temp = $(".episode").find('a').attr('data-episode-id')
  jwplayer("player_haygheta").setup({
        image: episodes.urlThumnail,        
        file: episodes.url,        
        width: "100%",
        aspectratio: "16:9",
        primary: "html5"
      })
  if (user !== "") {
    user = JSON.parse(user);    
    $("#commentInput").attr("placeholder", "Bình luận ở đây...");
  } else {
    $("#commentInput").attr("placeholder", "Vui lòng đăng nhập...");
  }
  //comment-reply
  getListEpisodes(movieID, episodesID, $("#movieNone").val())
  $.ajax({
    type: "GET",
    url: '/admin/get_a_episode/' + episodesID,

    success: function (response) {
      //jwplayer("player_haygheta").attr("file", response.data.url)
      $('#imgDefault').hide();
      // $('#player_haygheta').show();
      // jwplayer("player_haygheta").setup({
      //   image: response.data.urlThumnail,        
      //   file: response.data.url,        
      //   width: "100%",
      //   aspectratio: "16:9",
      //   primary: "html5"
      // })
    },
    error: function (err) {
      console.log(err)
    }
  });
  getCommends(movieID)
  window.adblock = false;
  window.adblock2 = false;
  window.turnoff = true;
  window.open = function () { };
  var isFocused = false;
  
  $('input[class="reply-input"]').keypress(function (event) {
    if (event.keyCode == 13) {  
      //$(this).attr("data-id"), 
      // tạm ẩn   
      // let content = $(this).val()
      // if (content === "" || content.length < 6) {
      //   $.dialog({
      //     title: 'Thông báo!',
      //     content: 'Bình luận quá ngắn...',
      //   });
      // } else {
      //   $.ajax({
      //     type: "POST", //rest Type
          
      //     url: "/detail/reply_comment",
      //     async: false,
      //     data: {
      //       id:$(this).attr("data-id"),
      //       user:user,
      //       content:content,
      //       movieID: movieID
      //     },
          
      //     success: function (msg) {  
      //       console.log()          
      //       $(this).val(" ")
      //       //$('.comment-list').append('<div data-id='+msg.data+' class="comment-item"><div class="author-avatar"><img src="'+user.avatar+'"></div><div class="comment-item-body"><div class="author-name">' + user.name + '</div><div class="comment-content">' + content + '</div><div class="comment-action"><span class="comment-reply"><i class="icon icon-comment"></i> trả lời</span><span class="comment-time"><i class="icon icon-time"></i> 1 ngày trước</span><input type="text" data-id='+msg.data+' name="reply-input" class="reply-input"/></div><div class="reply-list hidden"></div></div></div>')

      //     },
      //     error: function (request, status, error) {

      //       alert(error);
      //     }
      //   });
        
      // }
    }
  });
  $("#commentInput").keypress(function (event) {
    if (event.keyCode == 13) {
      let content = $(this).val()
      if (content === "" || content.length < 6) {
        $.dialog({
          title: 'Thông báo!',
          content: 'Bình luận quá ngắn...',
        });
      } else {
        $('.loading').removeClass("hidden")
        $("#commentInput").prop('disabled', true);
        $.ajax({
          type: "POST", //rest Type
          
          url: "/detail/comment",
          async: true,
          data: {
            user:user,
            content:content,
            movieID: movieID
          },
          
          success: function (msg) { 
            $("#commentInput").prop('disabled', false);
            $("#commentInput").blur();            
            $('.loading').addClass("hidden")           
            $("#commentInput").val("")
            let temp = $('.comment-list').html()
            if(temp.indexOf("Hãy trở thành")> -1){
              $('#noItem').remove()
            }  
             
              $('.comment-list').prepend('<div data-id='+msg.data.id+' class="comment-item"><div class="author-avatar"><img src="'+user.avatar+'"></div><div class="comment-item-body"><div class="author-name">' + user.name + '</div><div class="comment-content">' + content + '</div><div class="comment-action"><span class="comment-reply"><i class="icon icon-comment"></i> trả lời</span><span class="comment-time"><i class="icon icon-time"></i> vừa xong </span><input type="text" data-id='+msg.data.id+' name="reply-input" class="reply-input hidden"/></div><div class="reply-list hidden"></div></div></div>')
                       
            

          },
          error: function (request, status, error) {
            $('.loading').addClass("hidden") 
            $("#commentInput").prop('disabled', false);
            alert(error);
          }
        });
        
      }
    }
  });
  $('#commentInput').on("focus", function () {
    if (!isFocused && user === "") {
      $(this).blur();
      isFocused = true;
      $.confirm({
        title: 'Thông báo!',
        content: 'Mời bạn Đăng Nhập để bình luận.',
        buttons: {
          confirm: {
            text: 'Đăng Nhập',
            btnClass: 'btn-blue',
            keys: ['enter', 'shift'],
            action: function () {
              isFocused = false;
              $.alert('Something else?');
            }
          },
          cancel: {
            text: 'Huỷ',
            keys: ['enter', 'shift'],
            action: function () {
              isFocused = false;
              $.alert('Something else?');
            }
          }
        }
      });

    }

  });
  
})
function getCommends(movieID){
  $('.loading').removeClass("hidden")
  if(movieID){
    $.ajax({
      type: "GET", //rest Type      
      url: "/detail/get_comments/"+movieID,
      async: false,      
      success: function (msg) {
        $('.loading').addClass("hidden")            
        if(msg.data.length>0){
          let temp = $('.comment-list').html()
            if(temp.indexOf("Hãy trở thành")> -1){
              $('#noItem').remove()
            } 
          msg.data.forEach(element => {
            $('.comment-list').prepend('<div data-id='+element.id+' class="comment-item"><div class="author-avatar"><img src="'+element.fromAvatar+'"></div><div class="comment-item-body"><div class="author-name">' + element.fromName + '</div><div class="comment-content">' + element.content + '</div><div class="comment-action"><span onclick="showReplyInput('+element.id+')" class="comment-reply"><i class="icon icon-comment"></i> trả lời</span><span class="comment-time"><i class="icon icon-time"></i> '+timeAgo(element.meta.updateAt)+'</span><input type="text" name="reply-input" data-id='+element.id+' class="reply-input hidden"/></div><div class="reply-list hidden"></div></div></div>')
          });
        }
        

      },
      error: function (request, status, error) {
        $('.loading').addClass("hidden")
        $('.comment-list').append('<div id="noItem">Hãy trở thành người bình luận đầu tiên :)</div>')
        //alert(error);
      }
    });
  }
}
function showReplyInput(id){
  // tạm ẩn
  // if(id){
  //   let temp  = $('input[data-id="'+id+'"]');
  //   if(temp){
  //     if(temp.hasClass('hidden')){
  //       $('input[data-id="'+id+'"]').removeClass('hidden')
  //     }else{
  //       $('input[data-id="'+id+'"]').addClass('hidden')
  //     }
  //   }
  // }
}
var player;
function handleActivePlayer(e, video) {
  var activeDiv = e.target;
  if (player) {
    player.remove();
  }
  thumbs.forEach(function (thumb) {
    thumb.classList.remove('active');
  })
  activeDiv.classList.add('active');

  // Chain .play() onto player setup (rather than autostart: true)
  player = jwplayer(activeDiv.id).setup({
    file: '//content.jwplatform.com/manifests/' + video.mediaid + '.m3u8'
  }).play();

  // Destroy the player and replace with thumbnail
  player.on('complete', function () {
    player.remove();
    player = null;
  });
}

function getListEpisodes(movieID, episodesID, titleNon) {
  $.ajax({
    type: "GET",
    url: '/admin/get_list_episode/' + movieID,

    success: function (response) {
      if (response.data.length > 0) {
        response.data.forEach(element => {
          if (element.episodeNameNon === episodesID)
            $(".list-episode").append("<li class='episode' data-link=" + element.url + "><a title=" + element.name + " data-episode-id=" + element._id + " data-num='1' data-type='watch' class='btn-episode btn3d black active' href='/anime/" + titleNon + "/" + element.episodeNameNon + "'>" + element.name + "</a></li>")
          else
            $(".list-episode").append("<li class='episode' data-link=" + element.url + "><a title=" + element.name + " data-episode-id=" + element._id + " data-num='1' data-type='watch' class='btn-episode btn3d black' href='/anime/" + titleNon + "/" + element.episodeNameNon + "'>" + element.name + "</a></li>")
        });
      }

    },
    error: function (err) {
      console.log(err)
    }
  });
}

function UrlExists(response) {
  jQuery.ajax({
    url: response.data.url,
    dataType: 'text',
    type: 'GET',
    error: function () {
      console.log("link khong ton tai")
    },
    success: function () {
      console.log("link co ton tai")
      jwplayer("player_haygheta").setup({
        image: response.data.urlThumnail,
        file: response.data.url,
        //file: "https://1fgqfvb.oloadcdn.net/dl/l/qZ5Ul5o8tOZNhHYW/5RUAW5VSuxE/%28autoP+-+mp4%29+One%2BPiece%2B%28Dub%29%2BEpisode%2B1.mp4",
        width: "100%",
        aspectratio: "16:9"
      });
    }
  });
}
function timeAgo(dateCommend) {
  let date = new Date(dateCommend)
  var seconds = Math.floor((new Date() - date) / 1000);

  if(Math.round(seconds/(60*60*24*365.25)) >= 1) return Math.round(seconds/(60*60*24*365.25)) + " năm trước";
  
  else if(Math.round(seconds/(60*60*24*30.4)) >= 1) return Math.round(seconds/(60*60*24*30.4)) + " tháng trước";
  
  else if(Math.round(seconds/(60*60*24*7)) >= 1) return Math.round(seconds/(60*60*24*7)) + " tuần trước";
  
  else if(Math.round(seconds/(60*60*24)) >= 1) return Math.round(seconds/(60*60*24)) + " ngày trước";
  
  else if(Math.round(seconds/(60*60)) >= 1) return Math.round(seconds/(60*60)) + " giờ trước";
  
  else if(Math.round(seconds/60) >= 1) return Math.round(seconds/60) + " phút trước";
  
  else if(seconds >= 1)return seconds + " giây trước";
  
}

function onready(fn) { if (document.readyState != 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

onready(function () {

  if (document.location.href.match(/\/embed\//) || $('#realdl>a')) {

    $('#btnView').hide();
    $('#btnDl').hide();
    $('.dlButtonContainer').show();
    $('h3.dlfile.h-method').hide();
    $('.col-md-4.col-centered-sm *').remove();
    $('#mgiframe,#main>div[id]').remove();
    $('#downloadTimer').hide();
    $('#mediaspace_wrapper').prepend($('<div/>').attr('id', 'realdl')
      .attr('style', 'position: absolute; top: 0 ; left: 0 ; right: 0; text-align: center; z-index: 9999; background-color: #000; padding: .5em 0;')
      .on('mouseenter', function () { $(this).fadeTo(500, 1); }).on('mouseleave', function () { $(this).fadeTo(500, 0); })
      .append($('<a/>').attr('href', '').attr('style', 'color: #fff; text-decoration: none; -moz-user-select: none;').text('DOWNLOAD'))
      .append($('<span/>').attr('style', 'color: #fff; padding-left: 1em;').attr('id', 'steamcopy')));
    $('#realdl').show();
    var streamurl_tmr = setInterval(function () {
      // <@snippet edited author="https://greasyfork.org/forum/profile/daedelus" src="https://greasyfork.org/forum/discussion/36362/x">
      var streamurl_src;
      var streamurl_end = false;
      $('p[id]').each(function () {
        if (!streamurl_end) {
          streamurl_src = streamurl_src || ($(this).text().match(/^[\w\.~-]+$/) /*TEMP_FIX: && $(this).text().match(/~/) */) ? $(this).text() : streamurl_src;
          if (streamurl_src)
            streamurl_end = true;
        }
      });
      // </@snippet>
      if (streamurl_src) {
        var streamurl_url = location.origin + '/stream/' + /*TEMP_FIX: streamurl_src + */$('#DtsBlkVFQx').text();
        $('#realdl a').attr('href', streamurl_url);
        $('#steamcopy').text(streamurl_url);
        $('#videooverlay').click();
        $('div[style]').each(function () { if (this.style.zIndex && this.id != 'realdl') this.remove(); });
        clearInterval(streamurl_tmr);
      }
    }, 100);
  }
  window.onclick = function () { };
  document.onclick = function () { };
  document.body.onclick = function () { };
});

