# WykopCzarnolisto
## External blacklist for wykop.pl 
This is web browser extension that adds an unlimited external blacklist for wykop.pl website.


## Installation

Installation is simple, go to [release page](https://github.com/nodi37/WykopCzarnolisto/releases) and click right version for your web browser.

## Instructions 

- To add user to blacklist go to profile and click "Czarnolistuj" button on the right side next to the username. Now all content from this user will be removed after DOM is generated.
- To remove user from blacklist go to addons settings in web browser, open extension options page and remove user by clicking on 'x', next to the username.

## How it works...

This is simple addon written in Vanilla JavaScript. It finds authors usernames in DOM and removes elements if author is blacklisted. Filter function is called on every DOM change.

## To do...
 - Add hashtags support 
 