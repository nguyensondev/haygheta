$(document).ready(function () {

  jwplayer("player_haygheta").setup({ 
    image: $('#posterLink').val(),
    file:"",  
    autostart: 'viewable',
    mute: false,    
    width: "100%",
    height: 500,    
    aspectratio: "16:9"
  });
  var movieID = $('#movieID').val();
  var episodesID = $('#episodesID').val();
  var temp = $(".episode").find('a').attr('data-episode-id')
  getListEpisodes(movieID, episodesID)
  $.ajax({
    type: "GET",
    url: '/admin/get_a_episode/' + episodesID,

    success: function (response) {
      jwplayer("player_haygheta").attr("file", response.data.url)
      // jwplayer("player_haygheta").setup({
      //   image: response.data.urlThumnail,
      //   file: response.data.url,
      //   //file: "https://1fgqfvb.oloadcdn.net/dl/l/qZ5Ul5o8tOZNhHYW/5RUAW5VSuxE/%28autoP+-+mp4%29+One%2BPiece%2B%28Dub%29%2BEpisode%2B1.mp4",
      //   width: "100%",
      //   aspectratio: "16:9"
      // }).play();
    },
    error: function (err) {
      console.log(err)
    }
  });
  // if (episodesID === "-1") {
  //   $('.list-episode li:last a').addClass('active')
  //   jwplayer("player_haygheta").setup({
  //     image: thumnail,
  //     file: url,
  //     //file: "https://1fgqfvb.oloadcdn.net/dl/l/qZ5Ul5o8tOZNhHYW/5RUAW5VSuxE/%28autoP+-+mp4%29+One%2BPiece%2B%28Dub%29%2BEpisode%2B1.mp4",
  //     width: "100%",
  //     aspectratio: "16:9"
  //   });
  // }
  // else {
  //   console.log(episodesID)
  //   $.ajax({
  //     type: "GET",
  //     url: '/admin/get_a_episode/' + episodesID,

  //     success: function (response) {
  //       jwplayer("player_haygheta").setup({
  //         image: response.data.urlThumnail,
  //         file: response.data.url,
  //         //file: "https://1fgqfvb.oloadcdn.net/dl/l/qZ5Ul5o8tOZNhHYW/5RUAW5VSuxE/%28autoP+-+mp4%29+One%2BPiece%2B%28Dub%29%2BEpisode%2B1.mp4",
  //         width: "100%",
  //         aspectratio: "16:9"
  //       });
  //     },
  //     error: function (err) {
  //       console.log(err)
  //     }
  //   });
  // }
  //$('#player').attr('src', url)


  window.adblock = false;
  window.adblock2 = false;
  window.turnoff = true;
  window.open = function () { };
  //
  // @run-at document-end
  //

})
var player;
function handleActivePlayer(e, video) {
  var activeDiv = e.target;
  if (player) {
    player.remove();
  }
  thumbs.forEach(function(thumb) {
    thumb.classList.remove('active');
  })
  activeDiv.classList.add('active');

  // Chain .play() onto player setup (rather than autostart: true)
  player = jwplayer(activeDiv.id).setup({
    file: '//content.jwplatform.com/manifests/' + video.mediaid + '.m3u8'
  }).play();

  // Destroy the player and replace with thumbnail
  player.on('complete', function() {
    player.remove();
    player = null;
  });
}

function getListEpisodes(movieID, episodesID) {
  $.ajax({
    type: "GET",
    url: '/admin/get_list_episode/' + movieID,

    success: function (response) {
      if (response.data.length > 0) {
        response.data.forEach(element => {
          if (element._id === episodesID)
            $(".list-episode").append("<li class='episode' data-link=" + element.url + "><a title=" + element.name + " data-episode-id=" + element._id + " data-num='1' data-type='watch' class='btn-episode btn3d black active' href='/detail/" + element.movieID + "/" + element._id + "'>" + element.name + "</a></li>")
          else
            $(".list-episode").append("<li class='episode' data-link=" + element.url + "><a title=" + element.name + " data-episode-id=" + element._id + " data-num='1' data-type='watch' class='btn-episode btn3d black' href='/detail/" + element.movieID + "/" + element._id + "'>" + element.name + "</a></li>")
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

