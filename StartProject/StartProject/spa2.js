SwitchToStateFromURLHash();
window.onhashchange = SwitchToStateFromURLHash;
var list;

function SwitchToStateFromURLHash() {
    var URLHash = window.location.hash;

    var StateStr = URLHash.substr(1);

    if ( StateStr != "" ) {
        var PartsA = StateStr.split("_");

        var NewStateH = { pagename: PartsA[0]};
        if ( PartsA[1] ) {
            NewStateH.articleId = PartsA[1];
        }
        UpdateToState(NewStateH);
    } else {
        UpdateToState( { pagename:'' } );
    }
}

function ContentRequest() {
    var AjaxHandler = "https://dl.dropboxusercontent.com/u/75254542/spa-articles.json";
    $.ajax(
        {
            url : AjaxHandler,
            type : 'GET',
            dataType : 'JSON',
            cache : false,
            success : ContentReady,
            error : ErrorHandler
        }
    );
}

function ArticleRequest(NewStateH) {
    var AjaxHandlerArticle = "https://dl.dropboxusercontent.com/u/75254542/article_"+ NewStateH.articleId+".html";
    $.ajax(
        {
            url : AjaxHandlerArticle,
            type : 'GET',
            dataType : 'html',
            cache : false,
            success : ArticleReady,
            error : ErrorHandler
        }
    );
}

function UpdateToState(NewStateH) {
    SPAStateH = NewStateH;

    // обновляем вариабельную часть страницы под текущее состояние
    var PageHTML = "";

    switch ( SPAStateH.pagename )
    {
      case '':
        PageHTML+="<h3>ENCYCLO</h3>";
        PageHTML+="<p>общая информация о приложении</p>";
        PageHTML+="<a href='#contents'>оглавление</a>";
        break;
      case 'contents':
        // PageHTML+="<h3>Оглавление:</h3>";
        ContentRequest();
        break;
      case 'article':
        // PageHTML+="<h3>Статья</h3>";
        ArticleRequest(NewStateH);
        break;
    }
    document.body.innerHTML = PageHTML;
}

function ContentReady(data) {
    var contentItem = data;
    var sortedArticles = sortByAlf(contentItem);
}

function ArticleReady(data) {
    if(list !== undefined) {
        document.body.appendChild(list);
    } else {
         ContentRequest();
    }
    var article = data,
        newArticle = document.createElement('div');

        newArticle.classList.add('article');
        newArticle.innerHTML = article;
        
    document.body.appendChild(newArticle);
}

function ErrorHandler(jqXHR, StatusStr, ErrorStr) {
    alert(StatusStr+' '+ErrorStr);
}

function sortByAlfTitle(A,B) {
    if(A.title > B.title) return 1;
    if(A.title < B.title) return -1;    
}

function sortByAlf(array) {
    var body = document.body;
    list = document.createElement('ul');
    list.classList.add('menu');

    body.appendChild(list);
    array.sort(sortByAlfTitle);

    for(i = 0; i < array.length; i++){
        var listItem = document.createElement('li');
        var span = document.createElement('span');
        list.appendChild(listItem);
        var letter;
        for(var key in array[i]){
          var newlist = document.createElement('ul');
          if(key == "title") {
            if(letter !== array[i][key].substr(0, 1)) {
              span.innerHTML = array[i][key].substr(0, 1);
              listItem.appendChild(span);
            }
            letter = array[i][key].substr(0, 1);
            var newlistItem = document.createElement('li');
            var link = document.createElement('a');
            link.innerHTML = array[i][key];
          }  
            
            
        for(var key in array[i]){
            if(key == "url") {
                var slash = array[i][key].lastIndexOf("/");
                slash = slash + 1;
                link.href = "#" + array[i][key].slice(slash, -5);
            }
        }
            newlist.appendChild(newlistItem);
            newlistItem.appendChild(link);
            list.appendChild(newlist);
        }
    }
}

