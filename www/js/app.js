// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.testapp', // App bundle ID
  name: 'Framework7', // App name
  theme: 'auto', // Automatic theme detection
  // App root data
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };
  },
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  // App routes
  routes: routes,
});

// Init/Create main view
var mainView = app.views.create('.view-main', {
  url: '/'
});

// Login Screen Demo
$$('#my-login-screen .login-button').on('click', function () {
  var username = $$('#my-login-screen [name="username"]').val();
  var password = $$('#my-login-screen [name="password"]').val();

  // Close login screen
  app.loginScreen.close('#my-login-screen');

  // Alert username and password
  app.dialog.alert('Username: ' + username + '<br>Password: ' + password);
});

$(function() {
    function mediawiki_apicall() {

    		// 検索語
        var Keyword = document.getElementById("Keyword").value;
        
        // 検索語がない場合はアラート
        if("" == Keyword || Keyword ==null){
            alert("人名を入力してください。");
        };

        $.ajax({
            type: "GET",
            dataType: "jsonp",
            url: "https://ja.wikipedia.org/w/api.php?format=json&action=query&prop=revisions&rvprop=content&titles=" + encodeURIComponent(Keyword),
            success: function(data) {
                var key = Object.keys(data.query.pages)[0];

                // 検索結果ありの場合
                if(key != '-1'){
                    var title = data.query.pages[key].title;
                    // キーワードの検索結果
                    var searchVal = data.query.pages[key].revisions[0]['*'];
                    result.innerHTML = null;
                    
                    // *************************                    
                    // 結婚有無分析function
                    // *************************
                    // "配偶者"キーワードに設定されている値
                    var partnerVal ='';
                    // 本文中の"配偶者"の文字位置
                    var startPosition = searchVal.indexOf('配偶者');
                    // 日本語でない場合があるので、"spouse"の場合も考慮
                    if(startPosition==-1){
                        startPosition = searchVal.indexOf('spouse');
                    };

                    // 1:"配偶者"もしくは"spouse"のキーワードが存在するか
                    if(startPosition==-1){
                        document.getElementById('result_img').innerHTML = '<img src="img/single.png">';
                        // 存在しない場合は独身と判断
                        result.innerHTML = '独身';
                        spouse.innerHTML = '';
                    }
                    // 2:"配偶者"キーワードの内容が独身であるか
                    else{
                        // 2-1:"配偶者"のキーワードの値取得
                        // "配偶者"のキーワード以降で一番最初に出てくるセパレータ(|)まで繰り返し
                        for(i=startPosition; i<searchVal.length; i++){
                            // 一文字ずつ文字を取り出し
                            takeOutChar = searchVal.charAt(i);
                            if('|' == takeOutChar){
                                break;
                            }
                            else {
                                // 取り出した文字を連結し、配偶者のフィールドを文字列化する
                                partnerVal = partnerVal + takeOutChar;
                            };
                        };
                        // 基準文字（=）の位置を取得
                        var baseIndex = partnerVal.indexOf('=');
                        // 基準文字から後の文字列を切り出して表示
                        partnerVal = partnerVal.slice(baseIndex + 1);
                        // 空白文字をトリムする
                        partnerVal = partnerVal.replace(/\s+/g, "");

                        // 独身キーワードが含まれる、もしくは値無しの場合は独身と判断
                        if (/独身|未婚|無|無し|なし/.test(partnerVal) ||
                            partnerVal == '') {
                                // 結果イメージを表示
                                //画像の高さ・幅を1pxに変更
                                document.getElementById('result_img').innerHTML = '<img src="img/single.png">';
                                result.innerHTML = '独身';
                                spouse.innerHTML = '';
                        }
                        // 上記以外は既婚と判断
                        else{
                            document.getElementById('result_img').innerHTML = '<img src="img/couple.png">';
                            // 不要な記号をトリム
                            var partnerVal = partnerVal.split('[').join('');
                            var partnerVal = partnerVal.split(']').join('');
                            spouse.innerHTML = partnerVal;
                        };
                    };
                    // JSONデータのHTML表示
                    content.innerHTML = searchVal;
                }
                // 検索結果なしの場合
                else{
                    alert('検索結果が見つかりません。入力内容を確認のうえ、再度検索をしてください。');
                };
            }
        });
    }
    $('#start').on('click',function() {
      mediawiki_apicall();
    });
    $('#reset').on('click',function() {
      document.getElementById("Keyword").value = null;
    });
    $('#send').on('click',function() {
      var address, subject, body, hiddenData;
      address = 'yutawatanabe.biz@gmail.com';
      subject = 'してたかな(1.0.0):[Support]';
      body = 'こちらにお問い合わせ内容をご記入ください。';
      location.href = 'mailto:' + address + '?subject=' + subject + '&body=' + body;
    });
});
