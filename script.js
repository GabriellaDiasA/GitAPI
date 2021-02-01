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
        if (this.repositories == undefined) {
            UserView.errorDraw();
            return;
        }
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

    static errorDraw(){
        let errorMsgDiv = document.createElement('div');
        errorMsgDiv.setAttribute('id', 'usernameDiv');
        let header = document.createElement('h2');
        header.textContent = `User ${searchBar.value} NOT FOUND! Oh no!`;
        errorMsgDiv.append(header);
        bottomDiv.append(errorMsgDiv);
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
            try{
                let response = JSON.parse(req.responseText);
                if(req.status == 404) throw new Error("User not found!");
                else if(req.status != 200) throw new Error("Something has gone awry!");
                this.userData = response;
                console.log(response);
                this.repositories = new Repositories(this.username);
            }
            catch (ex) {
                console.log(ex.message);
            }
        });
        req.send();
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
            console.log("responseRepos");
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