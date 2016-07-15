function logoDesignModel() {
    var that = this;
    var view = null;
    this.NewStateH = '';
    this.articleId;
    // this.filterState - '';
    // this.filterName- '';

    this.UserLogged = false;


    // var objec = 
    // {
    // "anderson": "0",
    // "binatone": "1",
    // "arimo": "2",
    // "luck": "4",
    // "jb": "2",
    // "liberation": "5"}


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
                    //             $.ajax(
                    //     {
                    //         url : "http://fe.it-academy.by/AjaxStringStorage2.php",
                    //         type : 'POST',
                    //         data : { f : 'INSERT', n : 'BOBROVSKAYA_RATINGS27', v : JSON.stringify(objec)},
                    //         cache : false,
                    //         success : this.updateRatingObject,
                    //         error : this.ErrorHandler
                    //     }
                    // )
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
                success : this.ContactFormReady,
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

    this.RegistartionRequest = function(inputsArrayValue) {
        var name = inputsArrayValue[0];
        var pass = inputsArrayValue[1];
        var passRepeat = inputsArrayValue[2];
        if(pass == passRepeat && pass.length > 4) {
            JSON.stringify(name);
            var res = name.replace(".", "").replace('@', '');
            name = res;
            // var AjaxHandler = "http://fe.it-academy.by/AjaxStringStorage2.php";
            // $.ajax(
            //     {
            //         url : AjaxHandler,
            //         type : 'POST',
            //         dataType : 'JSON',
            //         data : { f : 'INSERT', n : name,
            //         v : JSON.stringify(pass) },
            //         cache : false,
            //         success : this.RegistrationFormReady,
            //         error : this.ErrorHandler
            //     }
            // );
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

    this.ContactFormReady = function() {
        console.log("aaaaaa");
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

    this.WorkInfoReady = function(data) {
        if(view.list == undefined) {
            that.ContentRequest();
        }
        var workItem = data;
        // that.WorkRatingRequest();
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
        ratings = data;
        console.log("ratings", data);
        view.showWorkInfo(ratings);
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
        article = data;
        that.ArticleRatingRequest();
    }

    this.RatingsReady = function(data) {
        ratings = data;
        console.log("ratings", ratings);
        view.filterDraw();
        view.articleDraw(article, ratings);
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
        console.log("UpdatePassword", UpdatePassword);
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
                            success : this.updateRatingObject,
                            error : this.ErrorHandler
                        }
                    )
                }
            }
        );
    }

    this.updateRatingObject = function() {
        console.log("=================");
    };
}

function logoDesignView() {
    var model = null; // с какой моделью работаем
    var body = document.body;
    var main = document.createElement('main');
    var that = this;

    this.ratingsServerObj;
    this.ratingsObj;

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
                // this.newWorkItem.addEventListener('click', model.WorkInfoRequest);
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
                // console.log("ratings[i]", ratings[i]);
                var star = document.createElement('span');
                star.classList.add('fa', 'fa-star-o');
                if(this.ratingsObj[currentKey] > j) {
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
            lightBoxBg.remove(); 
            lightBox.remove();
        });

        lightBoxBg.addEventListener('click', function() { 
            lightBoxBg.remove(); 
            lightBox.remove();
        })
    }


   this.starsRating = function(event) {
        var currentItemTitle = main.querySelector('h2').innerHTML.toLowerCase(); 
        that.ratingsObj[currentItemTitle] = parseInt( event.currentTarget.getAttribute('data-rating'));
        var stringRating = that.ratingsObj;
        console.log("stringRating", stringRating);
        that.ratingsServerObj.result[0][currentItemTitle] = parseInt( event.currentTarget.getAttribute('data-rating'));
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

    this.showWorkInfo = function(workItem, data) {
        var currentKey;
        console.log("data", data);
        main.classList.add('works-info');
        main.innerHTML = workItem;
        if(model.NewStateH !== 'contact' && model.NewStateH !== 'about') {
            currentKey = model.NewStateH;
            var starRating = main.querySelectorAll('.star-rating .fa');
            for(i = 0; i < starRating.length; i++) {
                starRating[i].addEventListener('click', function(event) {
                    that.starsRating(event);
                });
                if(that.ratingsObj[currentKey] > i) {
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
        if(model.UserLogged == true) {
            console.log("lljo");
            var loginLink = document.querySelector("a[href='#login']");
            loginLink.innerHTML = "";
            loginLink.innerHTML = "Logout";
            loginLink.href = "#logout";
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
            console.log(model.UserLogged);
        if(model.UserLogged == true) {
            console.log(model.UserLogged);
            formWrap.innerHTML = "<span class='logout-note'>Thank you for your visit! See you soon</span><a href='' class='btn logout'>Logout</a>";
            var logoutBtn = main.querySelector(".logout");
            logoutBtn.addEventListener('click', function() { localStorage.removeItem("logged") });
        }
    }

    this.getInputsValue = function(formItem) {
        var inputsArrayValue = [];
        var inputsArray = formItem.querySelectorAll('input, textarea');
        for(i=0; i < inputsArray.length; i++) {
            inputsArrayValue.push(inputsArray[i].value);
        }
        if(formItem.classList.contains('login-form') ) {
            model.LoginRequest(inputsArrayValue);
        } else if (formItem.classList.contains('registration-form') ) {
            model.RegistartionRequest(inputsArrayValue);
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

        console.log("m", m[0]);

        var lightBoxBg = document.createElement('div');
        var lightBox = document.createElement('div');
        // var clone = event.currentTarget.cloneNode();
        var body = document.body;
        body.style.overflow = 'hidden';
        lightBoxBg.classList.add('boxBg');
        lightBox.classList.add('box', 'lightbox');
        var newLink = m[0].slice(0, - 6) + '2.png")';

        console.log("newLink", newLink);
        lightBox.style.backgroundImage = newLink;

        lightBoxBg.addEventListener('click', function() { 
            lightBoxBg.remove(); 
            lightBox.remove();
        })

        // lightBox.appendChild(clone);
        body.appendChild(lightBoxBg);
        body.appendChild(lightBox);
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
        console.log(localStorage.getItem("logged"));
        if( localStorage.getItem("logged") == "true") {
            model.UserLogged = true;
        } else {
            model.UserLogged = false;
        }

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
          case 'logout':
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
