function ecycloModel() {
    var that = this;
    var view = null;
    this.NewStateH = '';
    this.articleId;

    this.init = function(myView) {
        view = myView;
    }

    this.ContentReady = function(data) {
        var contentItem = data;
        view.menuDraw(contentItem);
    }

    this.ContentRequest = function() {
        var AjaxHandler = "https://dl.dropboxusercontent.com/u/75254542/spa-articles.json";
        $.ajax(
            {
                url : AjaxHandler,
                type : 'GET',
                dataType : 'JSON',
                cache : false,
                success : this.ContentReady,
                error : this.ErrorHandler
            }
        );
    }

    this.ArticleReady = function(data) {
        if(view.list == undefined) {
            that.ContentRequest();
        }
        var article = data;
        view.articleDraw(article);
    }

    this.ErrorHandler = function(jqXHR, StatusStr, ErrorStr) {
        alert(StatusStr+' '+ErrorStr);
    }

    this.sortByAlfTitle = function(A,B) {
        if(A.title > B.title) return 1;
        if(A.title < B.title) return -1;    
    }

    this.ArticleRequest = function() {
        var AjaxHandlerArticle = "https://dl.dropboxusercontent.com/u/75254542/article_"+this.articleId+".html";
        $.ajax(
            {
                url : AjaxHandlerArticle,
                type : 'GET',
                dataType : 'html',
                cache : false,
                success : this.ArticleReady,
                error : this.ErrorHandler
            }
        );
    }
}

function ecycloView() {
    var model = null; // с какой моделью работаем

    this.init = function(myModel) {
        model = myModel;
    }

    this.articleDraw = function(article) {
        this.newArticle = document.createElement('div');
        this.newArticle.classList.add('article');
        this.newArticle.innerHTML = article;

        document.body.appendChild(this.newArticle);
    }

    this.menuDraw = function(array) {
        var body = document.body;

        this.list = document.createElement('ul');
        this.list.classList.add('menu');

        body.appendChild(this.list);
        array.sort(model.sortByAlfTitle);

        for(i = 0; i < array.length; i++){
            var listItem = document.createElement('li');
            var span = document.createElement('span');
            this.list.appendChild(listItem);
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
                this.list.appendChild(newlist);
            }
        }
    }


    this.update = function() {
        // обновляем вариабельную часть страницы под текущее состояние
        var PageHTML = "";

        switch (model.NewStateH)
        {
          case '':
            PageHTML+="<h3>ENCYCLO</h3>";
            PageHTML+="<p>общая информация о приложении</p>";
            PageHTML+="<a href='#contents'>оглавление</a>";
            document.body.innerHTML = PageHTML;
            break;
          case 'contents':
            document.body.innerHTML = '';
            model.ContentRequest();
            break;
          case 'article':
            if(this.newArticle) {
                this.newArticle.innerHTML = '';
            }
            model.ArticleRequest(model.NewStateH);
            break;
        }
    }
}

function ecycloController() {
    var model = null; // с какой моделью работаем
    var view = null;

    this.init = function() {
        model = new ecycloModel();
        view = new ecycloView();

        model.init(view);
        view.init(model);

        this.stateChange();
        window.onhashchange = this.stateChange;
    }

    this.stateChange = function() {
        var URLHash = window.location.hash;
        var StateStr = URLHash.substr(1);

        if ( StateStr != "" ) {
            var PartsA = StateStr.split("_");
            model.NewStateH = PartsA[0];
            if ( PartsA[1] ) {
                model.articleId = PartsA[1];
            }
            view.update(model.NewStateH);
        } else {
            model.NewStateH = '';
            view.update( model.NewStateH );
        }
    }
}

var controller = new ecycloController();
controller.init();
