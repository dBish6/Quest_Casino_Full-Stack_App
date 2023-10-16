## Important Note 🚧
The previous Quest Casino application (v1.2.8) has been moved away from the `master` branch and now has its own dedicated branch named `quest_casino_v1.2.8`. This change is part of a significant overhaul of Quest Casino, as I prepare to introduce version 2 of Quest Casino. The upcoming version will bring a completely revamped codebase and a brand-new user interface.

# Quest_Casino_Full-Stack_App

This is a fun little "casino" app that has different kinds of card games. The first being blackjack, which is currently in version 1.5.15 and you can also view the blackjack change log in the rules overlay while playing the game. The app is called _Quest Casino_ and from the sound of the name, in addition, it has some quests/challenges to complete for some extra moolah!

To add, the blackjack game is not your standard simple blackjack game, it has all the functionally you'll think of from a blackjack game by also having sounds and animations. What sets this game apart is the fact that it was developed solely from scratch, without referencing other blackjack game's code. The entire game was conceptualized and implemented using my own creativity and problem-solving skills, making it truly one of a kind, this code is the most unique and genuine as it can get, I hope you enjoy it. As an aspiring developer, I hope my work can inspire you too. Thank you for your interest in my app!

I'm also open to collaborate with anyone who would like to help:) [Contact me here](mailto:davidbish2002@hotmail.com).

_**Deployed Stable Version:** [www.questcasino.xyz](https://www.questcasino.xyz)_

## Keyboard Navigation Controls
In Quest Casino, you can enhance your user experience with keyboard navigation controls. Here are the keys you can use:
- `Tab` to move focus forward to the next interactive element.
- `Shift + Tab` to move focus backward to the previous interactive element.
- `Enter or Space` to select or activate the focused item.
- `Escape` to exit modals or toggle the menu in Davy Blackjack. It can also be used to close the rules overlay in Davy Blackjack.

## Tech Stack
This React application is built using Create React App (CRA) and uses Redux and Chakra UI on the front-end for state management and styling. On the back-end, Node.js is used with Firebase Authentication and 
Firestore for data storage. The application is deployed via Firebase Functions.

## Folder Structure
This is here to give you an idea of how the Folder Structure works and for me to mention some things I would like to explain about the 'guidelines' of this structure. Here's an overview:

### Front-end Structure:
`Features`
- The files and folders outside the `features` folder serve as `global` and `home` files.
- There are 3 key feature folders; `authentication`, `games`, and `quests`.
- Each feature folder follows the `pages` folder files (except for the `quests` feature which doesn't have a page, just a `modal` component) and mimics the `global` structure; components, contexts, hooks, utils, etc.

`Games Feature`
- The `games` feature folder holds each game featured in Quest Casino.
- The `general` folder includes files that are used across all games and files from the `games` page.
- Each game uses Redux shown in the `redux` folder for a lot of the game's data.
<br />

`contexts`
- The `contexts` folder within the root of the `src` folder contains the Cache.jsx file, which serves as a global store.
- `AuthContext` in the authentication feature folder stores the user and other functionality for the user.
<br />

`styles`
- The `styles` folder holds all the Chakra UI styles and configurations.
- The `components` folder within the `styles` folder defines the default styles and variants for Chakra components; Button, Link, Card, Tab, etc.

```
/
├── firebase.json
├── package.json
├── ...
├── node_modules/
|   └── ...
├── public/
│   ├── favicon.ico
|   ├── index.html
|   └── ...
└── src/
    ├── App.jsx
    ├── index.jsx
    ├── components/
    │   ├── GetBalance.jsx
    |   ├── ...
    |   ├── home/
    |   |   └── WelcomeSection.jsx
    |   ├── modals/
    |   |   ├── ModalTemplate.jsx
    |   |   └── ...
    |   ├── partials/
    |   |   ├── Footer.jsx
    |   |   ├── NavBar.jsx
    |   |   └── sideBar/
    |   |       ├── index.jsx
    |   |       ├── Navigation.jsx
    |   |       └── mobile/
    |   |           └── ...
    |   └── skeletons/
    |       └── PlayerSkeleton.jsx
    ├── contexts/ 
    |   └── Cache.jsx
    ├── features/
    |   ├── authentication/
    |   |   ├── PrivateRoute.jsx
    |   |   ├── api_services/
    |   |   |   ├── GetUser.js
    |   |   |   └── ...
    |   |   ├── components/
    |   |   |   ├── LoginForm.jsx
    |   |   |   ├── profile/
    |   |   |   |   └── ...
    |   |   |   └── ...
    |   |   ├── contexts/
    |   |   |   └── AuthContext.jsx
    |   |   └── ...
    |   ├── games/
    |   |   ├── blackjack/
    |   |   |  ├── index.jsx
    |   |   |  ├── assets/
    |   |   |  ├── components/
    |   |   |  |   ├── Dealer.jsx
    |   |   |  |   ├── player/
    |   |   |  |   |   ├── Player.jsx
    |   |   |  |   |   ├── BettingButtons.jsx
    |   |   |  |   |   └── ...
    |   |   |  ├── redux/  
    |   |   |  |   └── ...
    |   |   |  └── utils/
    |   |   |      ├── createDeck.js
    |   |   |      └── ...
    |   |   ├── general/
    |   |   |   ├── api_services/
    |   |   |   |   ├── persistCurrentGameData.js
    |   |   |   |   ├── updateUserWinsAndBalance.js
    |   |   |   |   └── ...
    |   |   |   ├── components/
    |   |   |   |   ├── gamesDisplay/
    |   |   |   |   |   └── ...
    |   |   |   |   ├── modals/
    |   |   |   |   |   └── MatchOrForFunModal.jsx
    |   |   |   |   └── ...
    |   |   |   └── ...
    |   |   └── ...
    |   ├── quests/
    |   |   └── staticQuests.js
    |   ├── hooks/
    |   |   └── useBlackjackQuestsCompletion.js
    |   └── ...   
    ├── hooks/
    |   ├── useAuth.js
    |   ├── useKeyboardHelper.js
    |   └── ...
    ├── pages/
    |   ├── Home.jsx
    |   ├── Profile.jsx
    |   ├── games/
    |   |   ├── Blackjack.jsx
    |   |   ├── GamesHome.jsx
    |   |   └── ...
    |   └── ...
    ├── redux/
    |   └── store.js
    ├── styles/
    |   ├── theme.js
    |   └── components/
    |       ├── buttonStyles.js
    |       ├── linkStyles.js
    |       └── ...
    └── ...
```

### Back-end Structure:
- The back-end structure uses `model`, `controller`, and `route` folders, but files and folders are separated by feature; `authentication` and `games` folders respectively.
- Again, files and folders outside the feature folders serve as `global` files.
- The entire back-end is encapsulated within the `functions` folder because it is deployed with Firebase Functions.

```
/
├── firebase.json
└── functions/
    ├── package.json
    ├── server.js
    ├── ...
    ├── node_modules/
    |   └── ...
    ├── middleware/
    |   └── verifyCsrfToken.js
    ├── model/
    |   └── firebaseConfig.js
    |   └── ...
    |   └── ...
    ├── authentication/
    |   ├── controller/
    |   |   └── auth.dal.js
    |   ├── middleware/
    |   |   ├── verifySessionCookie.js
    |   |   └── ...
    |   ├── route/
    |   |   └── auth.js
    |   ├── utils/
    |   |   ├── deleteInactiveProfilePictures.js
    |   |   └── ...
    └── games/
        ├── controller/
        |   └── games.dal.js
        ├── route/
        |   └── games.js
        └── utils/
            └── deleteInactiveGameSessions.js
```

<br /><br />

Shield: [![CC BY 4.0][cc-by-shield]][cc-by]

This work is licensed under a
[Creative Commons Attribution 4.0 International License][cc-by].

[![CC BY 4.0][cc-by-image]][cc-by]

[cc-by]: http://creativecommons.org/licenses/by/4.0/
[cc-by-image]: https://i.creativecommons.org/l/by/4.0/88x31.png
[cc-by-shield]: https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg
