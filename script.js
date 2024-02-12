function searchGitHubUser(username) {
  let ajax = new XMLHttpRequest();
  ajax.open("GET", "https://api.github.com/users/" + username + "/repos", true);
  ajax.onload = function () {
    if (ajax.status === 200) {
      let repositories = JSON.parse(ajax.responseText);
      displayRepositories(repositories);
    } else {
      console.log("this user is not find");
    }
  };
  ajax.send();
}

function displayRepositories(repositories) {
  let repositoriesList = document.getElementById("repositories-list");
  repositoriesList.innerHTML = "";
  repositories.forEach(function (repo) {
    let repoItem = document.createElement("div");
    repoItem.textContent = repo.name;
    repoItem.style.cursor = "pointer";
    repoItem.addEventListener("click", function() {
      window.location.href = repo.html_url;
    });
    repositoriesList.appendChild(repoItem);
  });
}

let form = document.getElementById("search-form");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  let username = document.getElementById("username").value;
  searchGitHubUser(username);
});
