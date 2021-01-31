const bottomDiv = document.getElementById("bottomDiv");
const searchBar = document.getElementById("searchBar");
const searchBtn = document.getElementById("searchButton");

function loadPage(){
    searchBtn.addEventListener('click', Controller.newUser);
}

class UserView{
    constructor(model){
        this.username = model.username;
        this.repositories = model.repositories.collection;
    }

    get reposDiv(){
        let div = document.createElement('div');
        div.setAttribute('class', 'reposContainer');
        return div;
    }

    get userNameDiv(){
        let div = document.createElement('div');
        div.setAttribute('id', 'usernameDiv');
        div.setAttribute('class', 'flexContainer');
        let link = document.createElement('a');
        let header = document.createElement('h2');
        header.textContent = `User found: ${this.username}`;
        link.href = `https:/github.com/${this.username}`;
        link.target = "_blank";
        link.append(header);
        div.append(link);
        return div;
    }

    static clearRepos(){
        while(bottomDiv.children.length > 0){
            bottomDiv.children[0].remove();
        }
    }

    draw(){
        bottomDiv.append(this.userNameDiv);

        for(let repos in this.repositories){
            let div = this.reposDiv;
            let current = this.repositories[repos];
            let link = document.createElement('a');
            link.href = current.html_url;
            link.textContent = current.name;
            link.target = "_blank";
            div.append(link);

            let language = document.createElement('p');
            language.setAttribute('class', 'language');
            let languageText = current.language;
            language.textContent = `(${languageText})`;
            div.append(language);

            let description = document.createElement('p');
            description.setAttribute('class', 'description');
            let descriptionText = current.description;
            description.textContent = descriptionText;
            div.append(description);

            bottomDiv.append(div);
        }
    }
}

class UserModel{
    constructor(){
        this.username = "";
        this.userData = {};
        this.repositories = {};
    }

    recieveData(){
        this.username = searchBar.value;

        let req = new XMLHttpRequest();
        req.open("GET", `https://api.github.com/users/${this.username}`, false);
        req.addEventListener('load', () => {
            let response = JSON.parse(req.responseText);
            this.userData = response;
        });
        this.repositories = new Repositories(this.username);
    }
}

class Repositories{
    constructor(username){
        this.collection = [];
        this.addToCollection(username);
    }

    addToCollection(username){
        let req = new XMLHttpRequest();
        req.open("GET", `https://api.github.com/users/${username}/repos`, false);
        req.addEventListener('load', () => {
            let response = JSON.parse(req.responseText);
            this.collection = response;
        });
        req.send();
    }
}

class Controller{
    static newUser(){
        UserView.clearRepos();
        let model = new UserModel();
        model.recieveData();
        let view = new UserView(model);
        view.draw();
    }
}

loadPage();