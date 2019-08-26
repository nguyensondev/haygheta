$(document).ready(function () {

  var url = $('#urlHidden').val();
  var thumnail = $('#urlThumnalHidden').val();
  var episodesID = $('#episodesID').val();
  var temp = $(".episode").find('a').attr('data-episode-id')
  if (episodesID === "-1") {
    $('.list-episode li:last a').addClass('active')
    jwplayer("player_haygheta").setup({
      image: thumnail,
      file: url,
      //file: "https://1fgqfvb.oloadcdn.net/dl/l/qZ5Ul5o8tOZNhHYW/5RUAW5VSuxE/%28autoP+-+mp4%29+One%2BPiece%2B%28Dub%29%2BEpisode%2B1.mp4",
      width: "100%",
      aspectratio: "16:9"
    });
  }
  else {
    console.log(episodesID)
    $.ajax({
      type: "GET",
      url: '/admin/get_a_episode/'+episodesID,
      
      success:function(response) {
        jwplayer("player_haygheta").setup({
          image: response.data.urlThumnail,
          file: response.data.url,
          //file: "https://1fgqfvb.oloadcdn.net/dl/l/qZ5Ul5o8tOZNhHYW/5RUAW5VSuxE/%28autoP+-+mp4%29+One%2BPiece%2B%28Dub%29%2BEpisode%2B1.mp4",
          width: "100%",
          aspectratio: "16:9"
        });
      },
      error:function(err){
        console.log(err)
      }
    });
  }
  //$('#player').attr('src', url)
  

  window.adblock = false;
  window.adblock2 = false;
  window.turnoff = true;
  window.open = function () { };
  //
  // @run-at document-end
  //

})

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

