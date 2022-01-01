var load = null;
var write = null;

// $(document).ready(callback) : 페이지가 모두 로딩되고 나서 작업을 처리하기 위한 부분
$(document).ready(function () {
  load = function () {
    // $.get : 서버에 /load라는 API를 요청하기 위한 jQuery 메서드 ($.ajax의 단축 함수)
    $.get('/load', function (data) {
      // 내용 갱신을 위해 memo라는 ID 값을 가진 <div>의 내용 비우기
      $('#memo').empty();

      // 서버로부터 응답받은 데이터인 JSON 형식의 data를 이용하여 반복문을 실행
      $(data).each(function (i) {
        var id = this._id;
        $('#memo').prepend("<div class='item'></div>");
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
      });
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

  // 쓰기 영역에서 엔터 버튼을 눌렀을 때
  $('#write textarea').keypress(function (evt) {
    if ((evt.keyCode || evt.which) == 13) {
      if (this.value != '') {
        write(this.value);
        evt.preventDefault();
        $('#author').val('');
        $(this).val('');
      }
    }
  });

  // 쓰기 버튼을 클릭했을 때
  $('#write_button').click(function (evt) {
    write($('#write textarea').val());
    $('#write #author').val('');
    $('#write textarea').val('');
  });

  load();
});
