function logoDesignModel() {
    var that = this;
    var view = null;
    this.NewStateH = '';
    this.articleId;
    this.article;
    this.ratings;

    this.UserLogged = false;

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

    this.ContactFormRequest = function(inputsArrayValue) {
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
                error : this.ErrorHandler
            }
        );
    }

    this.LoginRequest = function(inputsArrayValue) {
        var name = inputsArrayValue[0];
        JSON.stringify(name);
        var res = name.replace(".", "").replace('@', '');
        name = res;
        var AjaxHandler = "http://fe.it-academy.by/AjaxStringStorage2.php";
        $.ajax(
            {
                url : AjaxHandler,
                type : 'POST',
                dataType : 'JSON',
                data : { f : 'READ', n : name,
                v : JSON.stringify(inputsArrayValue) },
                cache : false,
                success : this.LoginFormReady,
                error : this.ErrorHandler
            }
        );
    }

    this.LoginFormReady = function(data) {
        view.loginCorrect(data);
    }

    this.RegistrationRequest = function(inputsArrayValue) {
        var name = inputsArrayValue[0];
        var pass = inputsArrayValue[1];
        var passRepeat = inputsArrayValue[2];
        if(pass == passRepeat && pass.length > 4) {
            JSON.stringify(name);
            var res = name.replace(".", "").replace('@', '');
            name = res;
            var AjaxHandler = "http://fe.it-academy.by/AjaxStringStorage2.php";
            $.ajax(
                {
                    url : AjaxHandler,
                    type : 'POST',
                    dataType : 'JSON',
                    data : { f : 'INSERT', n : name,
                    v : JSON.stringify(pass) },
                    cache : false,
                    success : this.RegistrationFormReady,
                    error : this.ErrorHandler
                }
            );
        } else if (pass !== passRepeat) {
            view.RegistrationError("Passwords dismatch");
        } else {
            view.RegistrationError("Password min length is 5");
        }
    }

    this.RegistrationFormReady = function(data) {
        if(data.result !== 'OK') {
            var errorText = "User with such email address already has been created";
            view.RegistrationError(errorText);
        } else {
            view.regCorrect(data);
        }
    }

    this.FormReady = function(data) {
        if(view.list == undefined) {
            that.ContentRequest();
        }
        var form = data;
        view.loginFormDraw(form);
    }

    this.FormRequest = function() {
        if (this.articleId == 'logout') {
            this.articleId = 'login';
        }
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
                error : this.ErrorHandler,
                success : this.WorkInfoReady
            }
        );
    }

    this.workItem;

    this.WorkInfoReady = function(data) {
        if(view.list == undefined) {
            that.ContentRequest();
        }
        that.workItem = data;
        that.WorkRatingRequest();
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

    this.WorkRatingRequest = function() {
        $.ajax(
            {
                url : "http://fe.it-academy.by/AjaxStringStorage2.php",
                type : 'POST',
                data : { f : 'READ', n : 'BOBROVSKAYA_RATINGS27'},
                cache : false,
                success : this.WorkRatingsReady,
                error : this.ErrorHandler
            }
        );
    }

    this.WorkRatingsReady = function(data) {
        that.ratings = data;
        var ratingsFormatted = JSON.parse(that.ratings.result)
        view.showWorkInfo(that.workItem, ratingsFormatted);
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
        that.article = data;
        that.ArticleRatingRequest();
    }

    this.implementFilter = function() {
        if(that.filterName == "filter=alphabet") {
            if(that.filterState == "sort=asc") {
                that.article.sort(that.sortByAlfTitle);
            } else if(that.filterState == "sort=desc") {
                that.article.sort(that.sortByAlfTitleInverse);
            }        
        } else if(that.filterName == "filter=rating") {
            if(that.filterState == "sort=asc") {
                that.article.sort(that.sortByRating);
            } else if(that.filterState == "sort=desc") {
                that.article.sort(that.sortByRatingInverse);
            } 
        }
    };

    this.RatingsReady = function(data) {
        that.ratings = data;
        that.ratingsItemObj = JSON.parse(that.ratings.result);
        that.article.forEach(function(item, index, array) {
            item["rating"] = that.ratingsItemObj[item.title];
        });
        if(that.filterName) {
            that.implementFilter();            
        }
        view.filterDraw(that.filterName, that.filterState);
        view.articleDraw(that.article, that.ratings);
    }

    this.ErrorHandler = function(jqXHR, StatusStr, ErrorStr) {
        alert(StatusStr+' '+ErrorStr);
    }

    this.sortByAlfTitle = function(A,B) {
        if(A.title > B.title) return 1;
        if(A.title < B.title) return -1;
    }

    this.sortByAlfTitleInverse = function(A,B) {
        if(A.title < B.title) return 1;
        if(A.title > B.title) return -1;
    }

    this.sortByRating = function(A,B) {
        if(A.rating > B.rating) return 1;
        if(A.rating < B.rating) return -1;
    }

    this.sortByRatingInverse = function(A,B) {
        if(A.rating < B.rating) return 1;
        if(A.rating > B.rating) return -1;
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

    this.ArticleRatingRequest = function() {
        $.ajax(
            {
                url : "http://fe.it-academy.by/AjaxStringStorage2.php",
                type : 'POST',
                data : { f : 'READ', n : 'BOBROVSKAYA_RATINGS27'},
                cache : false,
                success : this.RatingsReady,
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

    this.sendRating = function(ratingObj) {
        var UpdatePassword = Math.random();
        $.ajax(
            {
                url : "http://fe.it-academy.by/AjaxStringStorage2.php",
                type : 'POST',
                data : { f : 'LOCKGET', n : 'BOBROVSKAYA_RATINGS27', p : UpdatePassword },
                cache : false,
                error : this.ErrorHandler,
                success : function(data) {
                    $.ajax(
                        {
                            url : "http://fe.it-academy.by/AjaxStringStorage2.php",
                            type : 'POST',
                            dataType : 'JSON',
                            data : { f : 'UPDATE', n : 'BOBROVSKAYA_RATINGS27', v : JSON.stringify(ratingObj), p : UpdatePassword },
                            cache : false,
                            error : this.ErrorHandler
                        }
                    )
                }
            }
        );
    }

    this.animate = function(opts) {
        var start = new Date();
        var timer = setInterval(function (){ 
           var progress = (new Date - start)/opts.duration;
           if(progress > 1)progress = 1;    
            opts.step(opts.delta(progress));
            if(progress == 1){
                clearInterval(timer);
                opts.compleat && opts.compleat(opts.elem); 
            };    
        },opts.delay || 1000/60);
        
        return timer;
    }

    this.Prop = function(opts) {
        opts.step = function (prog){    
        var value;
            for(var i = opts.prop.length;i--;){
                value = opts.start[i] + ((opts.value[i] - opts.start[i] )*prog);
                opts.elem.style[opts.prop[i]] = value+ opts.units;
            }; 
        }

        if (!opts.delta) {
            opts.delta = function (progress){
                return progress;
            }
        }  
        return that.animate(opts);
    }
}


function logoDesignView() {
    var model = null; // с какой моделью работаем
    var body = document.body;
    var main = document.createElement('main');
    main.id = 'main'
    var that = this;

    this.ratingsServerObj;
    this.ratingsObj;

    this.init = function(myModel) {
        model = myModel;
    }

    this.filterDraw = function(filterType, filterOrder) {
        var filtersRow = document.createElement('div');
        filtersRow.classList.add('section', 'row', 'filters-wrap');
        var filters = document.createElement('div');
        filters.classList.add('col-md-12', 'filters-wrap');
        filtersRow.appendChild(filters);

        for(i=0; i < 2; i++){
            var filterItem = document.createElement('a');
            filterItem.classList.add('col-md-5', 'filter');
            filters.appendChild(filterItem);
        }
        var ratingFilter = filters.firstChild;
        var alfFilter = filters.lastChild;
        ratingFilter.classList.add('rating-filter');
        alfFilter.classList.add('alf-filter');
        
        if(filterType == "filter=alphabet") {
            ratingFilter.innerHTML = '<span>Sort by Rating</span>' + '<i class="fa fa-caret-down" aria-hidden="true"></i>';
            ratingFilter.href = '#works&filter=rating&sort=asc';
            if(filterOrder == "sort=asc") {
                alfFilter.href = '#works&filter=alphabet&sort=desc';
                alfFilter.innerHTML = '<span>Sort by Alphabet</span>' + '<i class="fa fa-caret-up" aria-hidden="true"></i>';
            } else if(filterOrder == "sort=desc") {
                alfFilter.href = '#works&filter=alphabet&sort=asc';
                alfFilter.innerHTML = '<span>Sort by Alphabet</span>' + '<i class="fa fa-caret-down" aria-hidden="true"></i>';
            }  

        } else if (filterType == "filter=rating") {
            alfFilter.href = '#works&filter=alphabet&sort=asc';
            alfFilter.innerHTML = '<span>Sort by Alphabet</span>' + '<i class="fa fa-caret-down" aria-hidden="true"></i>';
            if(filterOrder == "sort=asc") {
                ratingFilter.href = '#works&filter=rating&sort=desc';
                ratingFilter.innerHTML = '<span>Sort by Rating</span>' + '<i class="fa fa-caret-up" aria-hidden="true"></i>';
            } else if(filterOrder == "sort=desc") {
                ratingFilter.href = '#works&filter=rating&sort=asc';
                ratingFilter.innerHTML = '<span>Sort by Rating</span>' + '<i class="fa fa-caret-down" aria-hidden="true"></i>';
            }
        } else {
            ratingFilter.href = '#works&filter=rating&sort=asc';
            ratingFilter.innerHTML = '<span>Sort by Rating</span>' + '<i class="fa fa-caret-down" aria-hidden="true"></i>';
            alfFilter.href = '#works&filter=alphabet&sort=asc';
            alfFilter.innerHTML = '<span>Sort by Alphabet</span>' + '<i class="fa fa-caret-down" aria-hidden="true"></i>';
        }
        main.insertBefore(filtersRow, main.firstChild);
    }

    this.articleDraw = function(article, ratings) {
        var currentKey;
        this.ratingsServerObj = ratings;
        this.ratingsObj = JSON.parse(ratings.result);
        this.newArticle = document.createElement('div');
        this.newArticle.classList.add('section', 'row');
        main.classList.add('main-article');

        var workList = document.createElement('ul');
        workList.classList.add('work-list', 'col-md-12');
        body.appendChild(main);
        this.newArticle.appendChild(workList);

        for(var i = 0; i < article.length; i++){
            for(var key in article[i]){
              if(key == "title") {
                this.newWorkItem = document.createElement('li');
                this.newWorkItem.classList.add('col-md-5');
                this.newWorkLink = document.createElement('a');
                var title = document.createElement('h3');
                var logoWrap = document.createElement('div');
                logoWrap.classList.add('logo-wrap');
                currentKey = article[i][key];
                title.innerHTML = currentKey;
                this.newWorkLink.appendChild(title);
                this.newWorkLink.appendChild(logoWrap);
              }  
                if(key == "url") {
                    logoWrap.style.backgroundImage = 'url('+article[i][key]+')';
                    var slash = article[i][key].lastIndexOf("/");
                    slash = slash + 1;
                    this.newWorkLink.href = "#" + article[i][key].slice(slash, -4);
                }
                workList.appendChild(this.newWorkItem);
                this.newWorkItem.appendChild(this.newWorkLink);
            }
            if(model.UserLogged == false) {
                this.newWorkItem.addEventListener('click', that.workInfoShow);
            }
            var rating = document.createElement('div');
            rating.classList.add('star-rating');
            var input = document.createElement('input');
            input.classList.add('rating-value');
            this.newWorkLink.appendChild(rating);

            input.setAttribute("value", 1);
            for(var j = 0; j < 5; j++){
                var star = document.createElement('span');
                star.classList.add('fa', 'fa-star-o');
                if(article[i].rating > j) {
                    star.classList.add('fa-star-selected');
                }
                star.setAttribute("data-rating", j);
                rating.appendChild(star);
            }
            rating.appendChild(input);
        }
        main.appendChild(this.newArticle);

        var ratingFilter = main.querySelector('.rating-filter');
        var alfFilter = main.querySelector('.alf-filter');
    }

    this.workInfoShow = function(event) {
        event.preventDefault();

        var lightBoxBg = document.createElement('div');
        var lightBox = document.createElement('div');
        var body = document.body;
        body.style.overflow = 'hidden';
        lightBoxBg.classList.add('boxBg');
        lightBox.classList.add('box');
        lightBox.innerHTML = '<span>Please login to view logo info</span><a href="#login" class="login-link btn">Login here</a>'

        body.appendChild(lightBoxBg);
        body.appendChild(lightBox);

        var loginLink = document.querySelector(".login-link");
        loginLink.addEventListener('click', function() {
            body.style.overflow = 'visible';
            lightBoxBg.remove(); 
            lightBox.remove();
            console.log("hhh");
        });

        lightBoxBg.addEventListener('click', function() {
            body.style.overflow = 'visible';
            lightBoxBg.remove(); 
            lightBox.remove();
            console.log(body);
        })
    }


   this.starsRating = function(event) {
        var currentItemTitle = main.querySelector('h2').innerHTML.toLowerCase(); 
        that.ratingsObj[currentItemTitle] = parseInt(event.currentTarget.getAttribute('data-rating'));
        var stringRating = that.ratingsObj;
        that.ratingsServerObj.result[0][currentItemTitle] = parseInt(event.currentTarget.getAttribute('data-rating'));
        model.sendRating(stringRating);

        this.starRating = document.querySelectorAll('.star-rating .fa');
        for(i = 0; i < this.starRating.length; i++) {
            event.currentTarget.parentNode.classList.add('active');
            var currentValue = event.currentTarget.parentNode.querySelector('.rating-value');

            if(event.currentTarget.parentNode.classList.contains('active')){
                if (parseInt( event.currentTarget.getAttribute('data-rating')) > parseInt(currentValue.getAttribute('value'))) {
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

    this.showWorkInfo = function(workItem, ratingObject) {
        that.ratingsObj = ratingObject;
        that.ratingsServerObj = {};
        that.ratingsServerObj.result = [];
        that.ratingsServerObj.result[0] = [];
        var currentKey;
        main.classList.add('works-info');
        main.innerHTML = workItem;
        if(model.NewStateH !== 'contact' && model.NewStateH !== 'about') {
            currentKey = model.NewStateH;
            var starRating = main.querySelectorAll('.star-rating .fa');
            for(i = 0; i < starRating.length; i++) {
                starRating[i].addEventListener('click', function(event) {
                    that.starsRating(event);
                });
                if(ratingObject[currentKey] > i) {
                    starRating[i].classList.add('fa-star-selected');
                }
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
        var workLogo = main.querySelector('.logo-image');
        var workLogosSlider = main.querySelector('.logo-variations');
        var workLogos = main.querySelectorAll('.logo-variations li');
        workLogosSlider.id = 'slider';
        for(i = 0; i < array.length; i++) {
            for(var key in array[i]){
                if(key == "url") {
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
        if(model.UserLogged == true) {
            var loginLink = document.querySelector("a[href='#login']");
            loginLink.innerHTML = "";
            loginLink.innerHTML = "Logout";
            loginLink.href = "#logout";
        }
        that.menuState();
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
        this.errorBlock = document.createElement('div');
        this.errorBlock.classList.add('error');
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
                    newInput.setAttribute('required', 'true');    
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

        form.appendChild(this.errorBlock);
        var button = form.querySelector('button');
        
        if(model.articleId == 'login') {
            form.classList.add('login-form');
            button.innerHTML = 'login';
            formWrap.innerHTML += '<div claass="form-title"><h2>Login</h2><span>Thank you for your visit! </span><span>Please, login to view more information</span></div>';
        } else if (model.articleId == 'registration') {
            form.classList.add('registration-form');
            button.innerHTML = 'registration';
            formWrap.innerHTML += '<div claass="form-title"><h2>Registration</h2><span>Thank you for your visit!</span>'+'\&nbsp;'+'<span>Please, register to view more information</span><div>';
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
        if(model.UserLogged == true) {
            formWrap.innerHTML = "<span class='logout-note'>Thank you for your visit! See you soon</span><a href='' class='btn logout'>Logout</a>";
            var logoutBtn = main.querySelector(".logout");
            logoutBtn.addEventListener('click', function() { localStorage.removeItem("logged") });
        }
    }

    this.getInputsValue = function(formItem) {
        var inputsArrayValue = [];
        var inputsArray = formItem.querySelectorAll('input', 'textarea');
        for(i=0; i < inputsArray.length; i++) {
            inputsArrayValue.push(inputsArray[i].value);
        }
        if(formItem.classList.contains('login-form') ) {
            model.LoginRequest(inputsArrayValue);
        } else if (formItem.classList.contains('registration-form') ) {
            model.RegistrationRequest(inputsArrayValue);
        } else {
             model.ContactFormRequest(inputsArrayValue);
        }
    }

    this.thankYouNote = function(thankYouText) {
        var newForm = document.createElement('div');
        var formWrap = document.createElement('div');
        var photoBlock = document.createElement('div');
        photoBlock.classList.add('photo');
        newForm.classList.add('row');
        formWrap.classList.add('col-xs-6', 'login-block');
        formWrap.innerHTML = thankYouText;

        newForm.appendChild(formWrap);
        main.appendChild(newForm);
        main.appendChild(photoBlock);
    }

    this.sliderShow = function(event) {
        var m = (window.getComputedStyle(event.currentTarget).getPropertyValue("background-image")).match(/url\(([^)]+)\)/i); 
        var lightBoxBg = document.createElement('div');
        var lightBox = document.createElement('div');
        var cross = document.createElement('div');
        var body = document.body;
        body.style.overflow = 'hidden';
        lightBoxBg.classList.add('boxBg');
        cross.classList.add('close');
        lightBox.classList.add('box', 'lightbox');
        lightBox.style.opacity = '0';
        lightBox.id = "animate";
        var newLink = m[0].slice(0, - 6) + '2.png")';
        cross.innerHTML = '<i class="fa fa-times-circle" aria-hidden="true"></i>';

        lightBox.style.backgroundImage = newLink;

        lightBox.appendChild(cross);
        body.appendChild(lightBoxBg);
        body.appendChild(lightBox);

        var elem = document.getElementById("animate"); 
        var shadow = lightBoxBg;
        var elemArray = [elem, shadow];
        var closeArray = [cross, shadow];

        model.Prop({
          elem:elem,//элемент на котором происходит анимация 
          start:[0],// начальное значение
          value:[1],// конечное значение
          prop:['opacity'],// свойство анимации
          duration:1000,// время анимации
          units:'',//единицы измерение px || % || ''-без единици измерения
        });

        for(i=0; i < closeArray.length; i++) {
            closeArray[i].addEventListener('click', function() { 
                for(j=0; j < elemArray.length; j++) {
                    model.Prop({
                      elem: elemArray[j],
                      start:[1],
                      value:[0],
                      prop:['opacity'],
                      duration: 500,
                      units:'',
                    });
                }
                body.style.overflow = 'visible';
                setTimeout(function(){
                    lightBoxBg.remove(); 
                    lightBox.remove();
                }, 600);
            })
        }
    }

    this.loginCorrect = function(data) {
        var pass = JSON.stringify(main.querySelector('input[type=password]').value);
        if(data.result == pass) {
            history.pushState(null, null, ' ');
            model.NewStateH = '';
            localStorage.setItem("logged", "true");
            var loginLink = document.querySelector("a[href='#login']");
            loginLink.innerHTML = "";
            loginLink.innerHTML = "Logout";
            loginLink.href = "#logout";
            that.update();
        } else {
            var errorText = 'Email or password is invalid';
            that.RegistrationError(errorText);
        }
    }

    this.regCorrect = function(data) {
        main.innerHTML = '';
        var note = '<span>Thank you for registration! Please login <a href="#login">here'+'\&#187;'+'</a></span>';
        that.thankYouNote(note);
    }

    this.RegistrationError = function(errorText) {
        var form = main.querySelector('form');
        this.errorBlock.innerHTML = '<span>'+errorText+'</span>';
        form.insertBefore(this.errorBlock, form.firstChild);
    }

    this.update = function() {
        if( localStorage.getItem("logged") == "true") {
            model.UserLogged = true;
        } else {
            model.UserLogged = false;
        }

        var PageHTML = "";

        if(model.NewStateH == "logout" || model.NewStateH == "login" || model.NewStateH == "works" ||  model.NewStateH == "registration" || model.NewStateH == "contact-note" || model.NewStateH == "about" || model.NewStateH == "contact") {
            model.Prop({
              elem:main,
              start:[0],
              value:[100],
              prop:['width'],
              duration:1000,
              units:'%',
            });
        } else {
             model.Prop({
              elem:main,
              start:[0],
              value:[1],
              prop:['opacity'],
              duration:1000,
              units:'',
            });
        }

        switch (model.NewStateH)
        {
          case '':
            main.className = "";
            main.classList.add('homepage');
            main.innerHTML = '';
            main.innerHTML = '<h1>Logo Design</h1>'
            model.ContentRequest();
            break;
          case 'logout':
          case 'login':
            main.className = "";
            main.innerHTML = '';
            model.FormRequest(model.NewStateH);
            break;
          case 'works':
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
                break;
          case 'contact-note':
                if(this.newArticle) {
                    document.body.innerHTML = '';
                }
                var note = '<span>Thank you for your message! We will write back as soon as possible.</span>';
                main.innerHTML = '';
                model.ContentRequest();
                that.thankYouNote(note);
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
    var model = null;
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
                model.filterState = PartsA[2];
                model.filterName = PartsA[1];
            } else {
                model.filterState = "";
                model.filterName = "";
            }
            model.articleId = model.NewStateH;
            view.update(model.NewStateH);
        } else {
            model.NewStateH = '';
            view.update( model.NewStateH );
        }
    }
}

var controller = new logoDesignController();
controller.init();
