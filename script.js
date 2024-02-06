function searchGitHubUser(username) {
  var ajax = new XMLHttpRequest();
  ajax.open("GET", "https://api.github.com/users/" + username + "/repos", true);
  ajax.onload = function () {
    if (ajax.status === 200) {
      var repositories = JSON.parse(ajax.responseText);
      displayRepositories(repositories);
    } else {
      console.log("Failed to fetch data.");
    }
  };
  ajax.send();
}

function displayRepositories(repositories) {
  var repositoriesList = document.getElementById("repositories-list");
  repositoriesList.innerHTML = "";
  repositories.forEach(function (repo) {
    var repoItem = document.createElement("div");
    repoItem.textContent = repo.name;
    repositoriesList.appendChild(repoItem);
  });
}

var form = document.getElementById("search-form");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  var username = document.getElementById("username").value;
  searchGitHubUser(username);
});
