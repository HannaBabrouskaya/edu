function logoDesignModel() {
    var that = this;
    var view = null;
    this.NewStateH = '';
    this.articleId;
    this.filterState - '';
    this.filterName- '';

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

    this.LoginRequest = function(inputsArrayValue) {
        console.log("ggggssss");
        var AjaxHandler = "http://fe.it-academy.by/AjaxStringStorage2.php";
        var UpdateNumber = Math.floor(Math.random());
        $.ajax(
            {
                url : AjaxHandler,
                type : 'POST',
                dataType : 'JSON',
                data : { f : 'INSERT', n : 'BOBROVSKAYA_FORM'+ UpdateNumber +'',
                v : JSON.stringify(inputsArrayValue) },
                cache : false,
                success : this.LoginReady,
                error : this.ErrorHandler
            }
        );
    }

    this.FormReady = function(data) {
        if(view.list == undefined) {
            that.ContentRequest();
        }
        var form = data;
        view.loginFormDraw(form);
    }

    this.LoginReady = function() {
        console.log("aaaaaa");
    }

    this.FormRequest = function() {
        var AjaxHandler = "https://dl.dropboxusercontent.com/u/75254542/"+this.articleId+".json";
        $.ajax(
            {
                url : AjaxHandler,
                type : 'GET',
                dataType : 'JSON',
                cache : false,
                success : this.FormReady,
                error : this.ErrorHandler
            }
        );
    }

    this.WorkInfoRequest = function() {
        var AjaxHandler = "https://dl.dropboxusercontent.com/u/75254542/"+this.articleId+".html";
        $.ajax(
            {
                url : AjaxHandler,
                type : 'GET',
                dataType : 'html',
                cache : false,
                success : this.WorkInfoReady,
                error : this.ErrorHandler
            }
        );
    }

    this.WorkInfoReady = function(data) {
        if(view.list == undefined) {
            that.ContentRequest();
        }
        var workItem = data;
        view.showWorkInfo(workItem);
    }

    this.WorkLogosRequest = function() {
        var AjaxHandler = "https://dl.dropboxusercontent.com/u/75254542/"+this.articleId+".json";
        $.ajax(
            {
                url : AjaxHandler,
                type : 'GET',
                dataType : 'JSON',
                cache : false,
                success : this.WorkLogosReady,
                error : this.ErrorHandler
            }
        );
    }

    this.WorkLogosReady = function(data) {
        if(view.list == undefined) {
            that.ContentRequest();
        }
        var workItem = data;
        view.showWorkLogos(workItem);
    }

    this.ArticleReady = function(data) {
        if(view.list == undefined) {
            that.ContentRequest();
        }
        var article = data;
        view.filterDraw();
        view.articleDraw(article);
    }

    this.ErrorHandler = function(jqXHR, StatusStr, ErrorStr) {
        alert(StatusStr+' '+ErrorStr);
    }

    this.sortByAlfTitle = function(A,B) {
        console.log("sss");
        if(A.title > B.title) return 1;
        if(A.title < B.title) return -1; 
        // console.log(); 
    }

    this.ArticleRequest = function() {
        var AjaxHandlerArticle = "https://dl.dropboxusercontent.com/u/75254542/"+this.articleId+".json";
        $.ajax(
            {
                url : AjaxHandlerArticle,
                type : 'GET',
                dataType : 'JSON',
                cache : false,
                success : this.ArticleReady,
                error : this.ErrorHandler
            }
        );
    }

    this.getPreviousSiblings = function(el) {
        var siblings = [];
        siblings.push(el);
        while (el = el.previousElementSibling) { 
            siblings.push(el); 
        }
        return siblings;
    }

    this.getNextSiblings = function(el) {
        var siblings = [];
        while (el= el.nextElementSibling) { 
            siblings.push(el); 
        }
        return siblings;
    }
}

function logoDesignView() {
    var model = null; // с какой моделью работаем
    var body = document.body;
    var main = document.createElement('main');
    var that = this;

    this.init = function(myModel) {
        model = myModel;
        window.onload = function() {
            that.menuState(); // не работает по загрузке
        }
    }

    this.filterDraw = function(newClass, hashfilter) {
        var filtersRow = document.createElement('div');
        filtersRow.classList.add('section', 'row', 'filters-wrap');
        var filters = document.createElement('div');
        filters.classList.add('col-md-12', 'filters-wrap');
        filtersRow.appendChild(filters);

        for(i=0; i < 2; i++){
            var filterItem = document.createElement('div');
            filterItem.classList.add('col-md-5', 'filter');
            filters.appendChild(filterItem);
        }
        var ratingFilter = filters.firstChild;
        var alfFilter = filters.lastChild; 
        ratingFilter.classList.add('rating-filter');
        ratingFilter.innerHTML = '<span>Sort by Rating</span>' + '<i class="fa fa-caret-down" aria-hidden="true"></i>';
        alfFilter.classList.add('alf-filter');
        alfFilter.innerHTML = '<span>Sort by Alphabet</span>' + '<i class="fa fa-caret-down" aria-hidden="true"></i>';
        main.insertBefore(filtersRow, main.firstChild);

        if(newClass) {
            // console.log(document.getElementsByClassName('.sorted'));
            // if(alfFilter.classList.contains(''+newClass+'')) {
            //     // console.log(alfFilter.classList.contains(''+newClass+''));
            //     alfFilter.classList.remove(''+newClass+'');
            // }
            alfFilter.classList.toggle(''+newClass+'');
        }
    }

    this.articleDraw = function(article) {
        this.newArticle = document.createElement('div');
        this.newArticle.classList.add('section', 'row');
        main.classList.add('main-article');

        var workList = document.createElement('ul');
        workList.classList.add('work-list', 'col-md-12');
        body.appendChild(main);
        this.newArticle.appendChild(workList);

        for(i = 0; i < article.length; i++){
            for(var key in article[i]){
              if(key == "title") {
                this.newWorkItem = document.createElement('li');
                this.newWorkItem.classList.add('col-md-5');
                this.newWorkLink = document.createElement('a');
                var title = document.createElement('h3');
                var logoWrap = document.createElement('div');
                logoWrap.classList.add('logo-wrap');
                title.innerHTML = article[i][key];
                this.newWorkLink.appendChild(title);
                this.newWorkLink.appendChild(logoWrap);
              }  
                if(key == "url") {
                    logoWrap.style.backgroundImage = 'url('+article[i][key]+')';
                    var slash = article[i][key].lastIndexOf("/");
                    slash = slash + 1;
                    this.newWorkLink.href = "#" + article[i][key].slice(slash, -4);
                }
                // this.newWorkItem.addEventListener('click', model.WorkInfoRequest);
                workList.appendChild(this.newWorkItem);
                this.newWorkItem.appendChild(this.newWorkLink);
            }
            var rating = document.createElement('div');
            rating.classList.add('star-rating');
            var input = document.createElement('input');
            input.classList.add('rating-value');
            this.newWorkLink.appendChild(rating);

            input.setAttribute("value", 1);
            for(j = 0; j < 4; j++){
                var star = document.createElement('span');
                star.classList.add('fa', 'fa-star-o');
                star.setAttribute("data-rating", j);
                rating.appendChild(star);
            }
            rating.appendChild(input);
        }
        main.appendChild(this.newArticle);

        var ratingFilter = main.querySelector('.rating-filter');
        var alfFilter = main.querySelector('.alf-filter');
        this.hashAsc = 'asc';
        this.hashDesc = 'desc';

        this.filterChange = function() {
            // model.NewStateH += '_alf-filter';
            console.log("model.NewStateH");
            article.sort(model.sortByAlfTitle);
            main.innerHTML = '';
            //console.log(window.location.hash.substr(1)+'asc');
            //window.location.hash.substr(1).split("&");

            that.filterDraw("sorted", that.hashAsc);
            that.articleDraw(article);
        }
        alfFilter.addEventListener('click', that.filterChange);
    }


   this.starsRating = function(event) {
        this.starRating = document.querySelectorAll('.star-rating .fa');
        for(i = 0; i < this.starRating.length; i++) {
            event.currentTarget.parentNode.classList.add('active');
            var currentValue = event.currentTarget.parentNode.querySelector('.rating-value');

            if(event.currentTarget.parentNode.classList.contains('active')){
                if (parseInt( event.currentTarget.getAttribute('data-rating')) >= parseInt(currentValue.getAttribute('value'))) {
                    currentValue.setAttribute('value', ''+event.currentTarget.getAttribute('data-rating')+'');
                    var prevStars = model.getPreviousSiblings(event.currentTarget);
                    for(j = 0; j < prevStars.length; j++) {
                        prevStars[j].classList.add('fa-star-selected');
                    }   
                } else {
                    currentValue.setAttribute('value', ''+event.currentTarget.getAttribute('data-rating')+'');
                    var prevStars = model.getNextSiblings(event.currentTarget);
                    for(j = 0; j < prevStars.length; j++) {
                        prevStars[j].classList.remove('fa-star-selected');
                    }   
                }
            }
        }
    };

    this.showWorkInfo = function(workItem) {
        main.classList.add('works-info');
        main.innerHTML = workItem;
        if(model.NewStateH !== 'contact' && model.NewStateH !== 'about') {
            var starRating = main.querySelectorAll('.star-rating .fa');
            for(i = 0; i < starRating.length; i++) {
                starRating[i].addEventListener('click', that.starsRating);
            }
            model.WorkLogosRequest();
        } 
        if(model.NewStateH == 'contact') {
            var contactBtn = main.querySelector('.btn')
            var contactForm = main.querySelector('form');
            contactBtn.addEventListener('click', function() { 
                that.getInputsValue(contactForm);
            });
        }
    };

    this.showWorkLogos = function(array) {
        console.log(array);
        var workLogo = main.querySelector('.logo-image');
        var workLogosSlider = main.querySelector('.logo-variations');
        var workLogos = main.querySelectorAll('.logo-variations li');
        workLogosSlider.id = 'slider';
        for(i = 0; i < array.length; i++) {
            for(var key in array[i]){
                if(key == "url") {
                    console.log(array[i][key]);
                    workLogo.style.backgroundImage = "url("+array[i][key]+")";
                }
                if(key == "smallLogo") {
                    for(j=0; j < workLogos.length; j++) {
                        workLogos[j].style.backgroundImage = "url("+array[i][key][j]+")";
                        workLogos[j].addEventListener('click', function() { 
                            that.sliderShow(event);
                        });
                    }
                }
            }
        }
    };

    this.menuDraw = function(array) {
        var aside = document.createElement('aside');
        var logo = document.createElement('div');
        logo.classList.add('logo');
        var logoLink = document.createElement('a');
        logoLink.href = '';
        logo.appendChild(logoLink);

        this.list = document.createElement('ul');
        this.list.classList.add('nav', 'nav-pills', 'nav-stacked');

        body.appendChild(main);
        body.appendChild(aside);
        aside.appendChild(logo);
        aside.appendChild(this.list);

        for(i = 0; i < array.length; i++){
            for(var key in array[i]){
              if(key == "title") {
                var newlistItem = document.createElement('li');
                var link = document.createElement('a');
                link.innerHTML = array[i][key];
              }  
                if(key == "url") {
                    var slash = array[i][key].lastIndexOf("/");
                    slash = slash + 1;
                    link.href = "#" + array[i][key].slice(slash, -5);
                }
                this.list.appendChild(newlistItem);
                newlistItem.appendChild(link);
            }
        }
    }

    this.menuState = function() {
        var navLinks = document.querySelectorAll('.nav li a');
        for(i = 0; i < navLinks.length; i++) {
            navLinks[i].parentNode.classList.remove('active');
            var slash = navLinks[i].href.lastIndexOf("#");
                slash = slash + 1;
            var linkAddress = navLinks[i].href.slice(slash);
            if (window.location.hash.substr(1) == linkAddress) {
                navLinks[i].parentNode.classList.add('active');
            }
        }
     }

    this.loginFormDraw = function(data) {
        var newForm = document.createElement('div');
        var formWrap = document.createElement('div');
        var form = document.createElement('form');
        var regLink = document.createElement('a');
        var photoBlock = document.createElement('div');
        photoBlock.classList.add('photo');
        form.classList.add('form-horizontal');
        newForm.classList.add('row');
        formWrap.classList.add('col-md-6', 'login-block');
        main.classList.add('login');

        for(i=0; i < data.length; i++) {
            for (var key in data[i]) {
                if (key == "tag") {
                
                    var newInput = document.createElement(data[i][key]);
                    var label = document.createElement('label');
                    newInput.classList.add('form-control');    
                  
                }
                if (key == "label") {
                    label.innerHTML = data[i][key];
                }
                if (key == "placeholder") {
                    newInput.setAttribute('placeholder', data[i][key]);
                }
                if (key == "type") {
                    newInput.setAttribute('type', data[i][key])
                }
            }
            form.appendChild(label);
            form.appendChild(newInput);
        }

        var button = form.querySelector('button');
        
        if(model.articleId == 'login') {
            button.innerHTML = 'login';
            formWrap.innerHTML += '<h2>Login</h2><span>Thank you for your visit! </span><span>Please, login to view more information</span>';
        } else if (model.articleId == 'registration') {
            button.innerHTML = 'registration';
            formWrap.innerHTML += '<h2>Registration</h2><span>Thank you for your visit!</span>'+'\&nbsp;'+'<span>Please, register to view more information</span>';
        }
            formWrap.appendChild(form);
            newForm.appendChild(formWrap);
            main.appendChild(newForm);
            main.appendChild(photoBlock);
        if(model.articleId == 'login') {
            formWrap.innerHTML += '<span>New to our site?'+'\&nbsp;'+'</span>';
            regLink.innerHTML = 'Create account <span>'+'\&#187;'+'</span>';
            regLink.href = "#" + 'registration';
            formWrap.appendChild(regLink);
        } else if (model.articleId == 'registration') {
            formWrap.innerHTML += '<span>Already have an account?'+'\&nbsp;'+'</span>';
            regLink.innerHTML = 'Log In <span>'+'\&#187;'+'</span>';
            regLink.href = "#" + 'login';
            formWrap.appendChild(regLink);
        }

        var loginForm = main.getElementsByTagName('form');
            loginForm = loginForm[0];
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                that.getInputsValue(loginForm);
                return false;
        });
    }

    this.getInputsValue = function(loginForm) {
        var inputsArrayValue = [];
        var inputsArray = loginForm.querySelectorAll('input, textarea');
        for(i=0; i < inputsArray.length; i++) {
            inputsArrayValue.push(inputsArray[i].value);
            console.log("inputsArray[i]", inputsArray[i].value);
        }
        console.log(inputsArrayValue);
        model.LoginRequest(inputsArrayValue);
    }

    this.thankYouNote = function() {
        var newForm = document.createElement('div');
        var formWrap = document.createElement('div');
        var photoBlock = document.createElement('div');
        photoBlock.classList.add('photo');
        newForm.classList.add('row');
        formWrap.classList.add('col-xs-6', 'login-block');
        formWrap.innerHTML = '<span>Thank you for your message! We will write back as soon as possible.</span>';

        newForm.appendChild(formWrap);
        main.appendChild(newForm);
        main.appendChild(photoBlock);
    }

    this.sliderShow = function(event) {
        var lightBoxBg = document.createElement('div');
        var lightBox = document.createElement('div');
        var clone = event.currentTarget.cloneNode();
        var body = document.body;
        body.style.overflow = 'hidden';
        lightBoxBg.classList.add('boxBg');
        lightBox.classList.add('box');

        lightBoxBg.addEventListener('click', function() { 
            lightBoxBg.remove(); 
            lightBox.remove();
        })

        lightBox.appendChild(clone);
        body.appendChild(lightBoxBg);
        body.appendChild(lightBox);
    }

    this.update = function() {
        var PageHTML = "";

        switch (model.NewStateH)
        {
          case '':
            main.className = "";
            main.classList.add('homepage');
            main.innerHTML = '';
            main.innerHTML = '<h1>Logo Design</h1>'
            model.ContentRequest();
            break;
          case 'login':
            // if(this.newArticle) {
            //     document.body.innerHTML = '';
            // }
            main.className = "";
            main.innerHTML = '';
            model.FormRequest(model.NewStateH);
            break;
          case 'works':
            // if(this.newArticle) {
            //     this.newArticle.innerHTML = '';
            // }
            main.className = "";
            main.innerHTML = '';
            model.ArticleRequest(model.NewStateH);
            break;
          case 'registration':
                if(this.newArticle) {
                    document.body.innerHTML = '';
                }
                main.innerHTML = '';
                model.FormRequest(model.NewStateH);
                // document.body.innerHTML = '';
                // model.ContentRequest();
                break;
          case 'contact-note':
                if(this.newArticle) {
                    document.body.innerHTML = '';
                }
                main.innerHTML = '';
                model.ContentRequest();
                that.thankYouNote();
                break;
          default:
            main.className = "";
            main.innerHTML = '';
            model.WorkInfoRequest(model.NewStateH);
          break;
            }
        that.menuState();
    }
}

function logoDesignController() {
    var model = null; // с какой моделью работаем
    var view = null;

    this.init = function() {
        model = new logoDesignModel();
        view = new logoDesignView();

        model.init(view);
        view.init(model);

        this.stateChange();
        window.onhashchange = this.stateChange;
    }

    this.stateChange = function() {
        var URLHash = window.location.hash;
        var StateStr = URLHash.substr(1);

        if ( StateStr != "" ) {
            var PartsA = StateStr.split("&");
            model.NewStateH = PartsA[0];
            if ( PartsA[2] && PartsA[1]) {
                console.log(PartsA[2]);
                model.filterState = PartsA[2];
                model.filterName = PartsA[1];
            }
            model.articleId = StateStr;
            console.log(model.articleId);
            view.update(model.NewStateH);
        } else {
            model.NewStateH = '';
            view.update( model.NewStateH );
        }

    }
}

var controller = new logoDesignController();
controller.init();
