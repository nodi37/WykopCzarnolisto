const dev = true;

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
const blacklistObserver = new MutationObserver(userObserverCallback);
const userObserverConfig = { attributes: false, childList: true, subtree: true };
blacklistObserver.observe(document, userObserverConfig);



//Dodać obsługę tagów



//Mutation observer callback funcion
function userObserverCallback() {
    dev && console.log("DOM changed!");
    addBlacklistBtn();
    findBlacklistedContent();
}


//Removes unwanted content nodes
async function findBlacklistedContent() {
    const blacklistedUsers = await getBlockedUsers();

    //Home page
    dev && console.log("Home page");
    const homePageLinks = document.getElementById('itemsStream').querySelectorAll('.link');
    homePageLinks.forEach((node, i) => {
        const someRow = node.querySelector('.fix-tagline');
        if (someRow) {
            const postAuthor = someRow.childNodes[1].innerText.slice(1);
            if (blacklistedUsers.indexOf(postAuthor) != -1) {
                dev ? node.style.background = 'black' : node.remove();
            }
        }
    });


    //Posts And Comments
    dev && console.log("Post and comments");
    document.querySelectorAll('.entry').forEach((node, i) => {
        const postAuthor = node.querySelector('.showProfileSummary').innerText;
        if (blacklistedUsers.indexOf(postAuthor) != -1) {
            dev ? node.style.background = 'black' : node.remove();
        } else {
            const comments = node.childNodes[3];
            if (comments) {
                comments.childNodes.forEach(cmnt => {
                    if (cmnt.querySelectorAll('.more').length === 0) {
                        const commentAuthor = cmnt.querySelector('.showProfileSummary').innerText;
                        if (blacklistedUsers.indexOf(commentAuthor) != -1) {
                            dev ? cmnt.style.background = 'black' : cmnt.remove();
                        }
                    }
                });
            } else {
                dev && console.log("No comments in this block!")
            }
        }
    });

    //Hot entries box on right aside bar and in hits page
    dev && console.log("Hot entries box");
    const hotEntriesBox = document.querySelector('#hotEntriesBox');
    if (hotEntriesBox) {
        dev && console.log("Hot entries box found!");

        hotEntriesBox.childNodes.forEach((node) => {
            if (node.tagName == "LI") {
                const someAuthor = node.querySelector('.author').childNodes[1].innerText;
                if (blacklistedUsers.indexOf(someAuthor) != -1) {
                    dev ? node.style.background = 'black' : node.remove();
                }
            }
        });
    } else {
        dev && console.log("No hot entries box on this page");
    }

    //Best comments box in hits page
    dev && console.log("Best comments");
    const bestCmntsBox = document.getElementById('upc');
    if (bestCmntsBox) {
        bestCmntsBox.childNodes.forEach((node, i) => {
            if (node.tagName == "LI") {
                const someAuthor = node.querySelector('.author').childNodes[1].innerText;
                if (blacklistedUsers.indexOf(someAuthor) != -1) {
                    dev ? node.style.background = 'black' : node.remove();
                }
            }
        });
    } else {
        dev && console.log("No best comments box on this page");
    }

}

//Adds "Czarnolistuj" btn to user info box when hover on nickname
function addBlacklistBtn() {
    const menus = document.getElementsByClassName('arrow-box-bubble');
    for (let i = 0; i < menus.length; i++) {
        if (('login' in menus[i].dataset) && !('blacklistModified' in menus[i].dataset)) {
            menus[i].setAttribute('data-blacklist-modified', true);
            const blacklistBtn = document.createElement('div');
            blacklistBtn.classList.add('blacklist-btn');
            blacklistBtn.setAttribute('data-login', menus[i].dataset.login);
            blacklistBtn.innerHTML = `<span data-login="${menus[i].dataset.login}">Czarnolistuj</span>`;
            blacklistBtn.addEventListener('click', addToBlacklistFunc, true);
            menus[i].appendChild(blacklistBtn);
        }
    }
}

//Adds user to blocklist
async function addToBlacklistFunc(e) {
    dev && console.log("addToBlacklistFunc triggered! Here was some error!");
    dev && console.log(e)
    const userToBlock = e.target.dataset.login;
    dev && console.log(userToBlock)
    const lockedArray = await getBlockedUsers();

    if (lockedArray.indexOf(userToBlock) === -1) {
        if (confirm(`Na pewno chcesz dodać ${userToBlock} do czarnej listy?`)) {
            const arrayToSave = [...lockedArray, userToBlock];
            browser.storage.local.set({
                "wykopsBlacklistedUsers": arrayToSave
            });
            alert(`Od teraz nie będziesz już widzieć zawartości od ${userToBlock}.`);
        }
    }
}

//Gets blocked users
function getBlockedUsers() {
    dev && console.log("getBlockedUsers triggered!");
    return new Promise(resolve => {
        const gettingItem = browser.storage.local.get();
        gettingItem.then((onGot, onError) => {
            resolve(onGot.wykopsBlacklistedUsers);
        });
    })
}

//Prepares extension to work
function addonLoader() {
    browser.storage.local.get().then((onGot, onError) => {
        if (!onError) {
            if (!onGot.hasOwnProperty('wykopsBlacklistedUsers')) {
                browser.storage.local.set({
                    "wykopsBlacklistedUsers": []
                });
            }
        }
    });
    findBlacklistedContent();
    console.log('Blacklist loaded!');
}

document.addEventListener("DOMContentLoaded", addonLoader);