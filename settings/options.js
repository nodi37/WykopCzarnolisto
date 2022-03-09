async function listUsers() {
    const table = document.getElementById("blacklist-table");
    const users = await getBlockedUsers();
    users.forEach((user, i) => {
        const userRow = document.createElement('div');
        const classToApply = i % 2 ? 'table__item--white' : 'table__item--black';
        userRow.classList.add(classToApply, 'table__item');

        const userName = document.createElement('p');
        userName.classList.add('table__item-text');
        userName.innerText = user;

        const deleteBtn = document.createElement('p');
        deleteBtn.classList.add('table__item-delete-btn');
        deleteBtn.setAttribute('data-user', user);
        deleteBtn.setAttribute('data-row-index', i + 1);
        deleteBtn.innerHTML = '&times;';
        deleteBtn.addEventListener('click', deleteBtnHandler);

        userRow.appendChild(userName);
        userRow.appendChild(deleteBtn);
        table.appendChild(userRow);
    });
};

function getBlockedUsers() {
    return new Promise(resolve => {
        const gettingItem = browser.storage.local.get();
        gettingItem.then((onGot, onError) => {
            resolve(onGot.wykopsBlacklistedUsers);
        });
    })
}

async function deleteBtnHandler(e) {
    const userName = e.target.dataset.user;
    const rowIndex = e.target.dataset.rowIndex;
    const usrArr = await getBlockedUsers();
    usrArr.splice(usrArr.indexOf(userName), 1);
    browser.storage.local.set({
        "wykopsBlacklistedUsers": usrArr
    });
    document.querySelectorAll('.table__item')[rowIndex - 1].remove();
}

document.addEventListener("DOMContentLoaded", listUsers);