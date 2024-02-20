async function fetchRepositories(username) {
    let url = `https://api.github.com/users/${username}/repos`;
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    let data = await response.json();
    return data;
}

async function displayRepositories() {
    let searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        let username = document.getElementById('username').value;
        try {
            let repositories = await fetchRepositories(username);
            let repositoriesList = document.getElementById('repositoriesList');
            repositoriesList.innerHTML = '';
            repositories.forEach(repository => {
                let repositoryItem = document.createElement('ul');
                repositoryItem.classList.add('col-12', 'card', 'm-0', 'border', 'border-0', 'text-dark', 'align-baseline');

                let repositoryLink = document.createElement('a');
                repositoryLink.href = 'javascript:void(0);';
                repositoryLink.classList.add('card-footer', 'w-100', 'bg-green', 'm-1', 'text-bold', 'd-flex', 'justify-content-between');

                let deleteIcon = document.createElement('i');
                deleteIcon.classList.add('fas', 'fa-trash-alt');
                deleteIcon.style.cursor = 'pointer'; // Set cursor to pointer to indicate it's clickable
                deleteIcon.addEventListener('click', function(event) {
                    event.stopPropagation(); // Prevent the repositoryLink click event from triggering
                    event.preventDefault();
                    // Here you can implement your delete logic
                    // For now, let's just log a message
                    console.log('Delete repository:', repository.name);
                });

                repositoryLink.appendChild(document.createTextNode(repository.name));
                repositoryLink.appendChild(deleteIcon); // Append the delete icon to the right of the repository name

                repositoryItem.appendChild(repositoryLink);
                repositoriesList.appendChild(repositoryItem);

                repositoryLink.addEventListener('click', function (event) {
                    event.preventDefault();
                    showRepositoryDetails(username, repository.name);
                });
            });
        } catch (error) {
            console.error('User not found');
        }
    });
}


async function showRepositoryDetails(username, repoName) {
    let repositoryDetails = document.getElementById('repositoryDetails');
    try {
        let response = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents`);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        let data = await response.json();
        repositoryDetails.innerHTML = '';
        data.forEach(item => {
            let contentItem = document.createElement('ul');
            contentItem.classList.add( 'col-12', 'card', 'm-0', 'border', 'border-0',  'text-dark' , 'align-baseline');
            let icon = document.createElement('i');
            icon.classList.add('fas', item.type === 'dir' ? 'fa-folder' : 'fa-file', 'mx-2', 'text-dark');
            let itemName = document.createElement('span');
            itemName.textContent = item.name;
            let contentLink = document.createElement('a');
            contentLink.href = 'javascript:void(0);';
            contentLink.classList.add('card-footer', 'w-100' , 'bg-light' , 'm-1' , 'text-bold');
            contentLink.appendChild(icon);
            contentLink.appendChild(itemName);
            contentLink.addEventListener('click', async () => {
                if (item.type === 'file') {
                    let fileResponse = await fetch(item.download_url);
                    let fileContent = await fileResponse.text();
                    let fileContentElement = document.createElement('pre');
                    fileContentElement.classList.add('card', 'p-0');
                    fileContentElement.textContent = fileContent;
                    repositoryDetails.appendChild(fileContentElement);
                } else if (item.type === 'dir') {
                    showDirectoryContents(username, repoName, item.path);
                }
            });
            contentItem.appendChild(contentLink);
            repositoryDetails.appendChild(contentItem);
        });
    } catch (error) {
        console.error('Error fetching repository details:', error);
    }
}

async function showDirectoryContents(username, repoName, path) {
    try {
        let response = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/${path}`);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        let data = await response.json();
        let repositoryDetails = document.getElementById('repositoryDetails');
        repositoryDetails.innerHTML = '';
        data.forEach(item => {
            let contentItem = document.createElement('ul');
            contentItem.classList.add( 'col-12', 'card', 'm-0', 'border', 'border-0',  'text-light' , 'align-baseline');
            let icon = document.createElement('i');
            icon.classList.add('fas', item.type === 'dir' ? 'fa-folder' : 'fa-file', 'mx-2');
            let itemName = document.createElement('span');
            itemName.textContent = item.name;
            let contentLink = document.createElement('a');
            contentLink.href = 'javascript:void(0);';
            contentLink.classList.add('card-footer', 'w-100' , 'bg-secondary' , 'm-1' , );
            contentLink.appendChild(icon);
            contentLink.appendChild(itemName);
            contentLink.addEventListener('click', async () => {
                if (item.type === 'file') {
                    let fileResponse = await fetch(item.download_url);
                    let fileContent = await fileResponse.text();
                    let fileContentElement = document.createElement('pre');
                    fileContentElement.classList.add('card', 'p-3', 'bg-light' , 'm-5' );
                    fileContentElement.textContent = fileContent;
                    repositoryDetails.appendChild(fileContentElement);
                } else if (item.type === 'dir') {
                    showDirectoryContents(username, repoName, item.path);
                }
            });
            contentItem.appendChild(contentLink);
            repositoryDetails.appendChild(contentItem);
        });
    } catch (error) {
        console.error('Error fetching directory contents:', error);
    }
}





displayRepositories();
