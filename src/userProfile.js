function addBtn() {
    dev && console.log("This is user profile!");

    const userProfileDiv = document.getElementsByClassName('user-profile');
    const blacklistBtn = document.createElement('div');
    blacklistBtn.classList.add('button', 'blacklist-profile-btn');
    blacklistBtn.setAttribute('data-login', userProfileDiv[0].dataset.id);
    blacklistBtn.innerHTML = `<span data-login="${userProfileDiv[0].dataset.id}">Czarnolistuj</span>`;
    blacklistBtn.addEventListener('click', addToBlacklistFunc, true);
    const btnContainerDiv = userProfileDiv[0].querySelector('.folContainer').childNodes[3];
    btnContainerDiv.appendChild(blacklistBtn);

    dev && console.log('Button added to user profile!');
}

addBtn();
