var load = null;
var write = null;
var modify = null;
var del = null;

// $(document).ready(callback) : 페이지가 모두 로딩되고 나서 작업을 처리하기 위한 부분
$(document).ready(function () {
  load = function () {
    // $.get : 서버에 /load라는 API를 요청하기 위한 jQuery 메서드 ($.ajax의 단축 함수)
    $.get('/load', function (data) {
      $('#memo').empty(); // 내용 갱신을 위해 memo라는 ID 값을 가진 <div>의 내용 비우기

      // 서버로부터 응답받은 데이터인 JSON 형식의 data를 이용하여 반복문을 실행
      $(data).each(function (i) {
        var id = this._id;
        $('#memo').prepend("<div class='item'></div>");
        $('#memo .item:first').append("<div class='photo_thumb'></div>");
        $('#memo .item:first').append(
          "<div class='author'><b>" +
            this.author +
            '</b> (' +
            this.date +
            ")&nbsp;&nbsp; <span class='text_button modify'>MODIFY</span> <span class='text_button del'>DELETE</span></div>"
        );
        $('#memo .item:first').append(
          "<div class='contents " + id + "'>" + this.contents + '</div>'
        );

        var cnt = 0;

        $('#memo .item:first .modify').click(function (evt) {
          // modify 버튼을 눌렀을 때
          var contents = $('#memo .' + id).html();
          if (cnt == 0) {
            $('#memo .' + id).html(
              "<textarea id='textarea_" +
                id +
                "' class='textarea_modify'>" +
                contents +
                '</textarea>'
            );
            cnt = 1;
          }
          $('#textarea_' + id).keypress(function (evt) {
            if ((evt.keyCode || evt.which) == 13) {
              // 키보드에서 엔터버튼이 눌러졌을 때
              if (this.value != '') {
                modify(this.value, id);
                evt.preventDefault();
              }
            }
          });
        });

        $('#memo .item:first .del').click(function (evt) {
          // del 버튼이 눌러졌을 때
          del(id);
        });
      });
    });
  };

  modify = function (contents, id) {
    var postdata = {
      author: $('#author').val(),
      contents: contents,
      _id: id,
    };
    $.post('/modify', postdata, function () {
      load();
    });
  };

  write = function (contents) {
    var postdata = {
      author: $('#author').val(),
      contents: contents,
    };
    $.post('/write', postdata, function () {
      load();
    });
  };

  del = function (id) {
    console.log(id);
    var postdata = {
      _id: id,
    };

    $.post('/del', postdata, function () {
      load();
    });
  };

  $('#write textarea').keypress(function (evt) {
    if ((evt.keyCode || evt.which) == 13) {
      // 쓰기 영역에서 엔터 버튼을 눌렀을 때
      if (this.value != '') {
        write(this.value);
        evt.preventDefault();
        $(this).val('');
      }
    }
  });

  $('#write_button').click(function (evt) {
    // 쓰기 버튼을 클릭했을 때
    console.log($('#write textarea').val());
    write($('#write textarea').val());
    $('#write textarea').val('');
  });

  load();
});
