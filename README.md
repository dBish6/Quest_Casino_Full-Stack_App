## 🚀🚀 Active Development
The development of the complete overhaul of Quest Casino is now underway and we're now in the very early stages. The previous version (v1.2.8) will still remain available online for the time being, you can access the previous version through the releases section or the quest_casino_v1.2.8 branch. Quest Casino version 2 is a highly ambitious upgrade that promises to surpass its predecessor in every way. Stay Tuned! 🎰

# Quest_Casino_Full-Stack_App
This is a fun casino app that has different kinds of casino games. From the sound of the name, in addition, it has some quests/challenges to complete for some extra moolah!

## New Tech Stack
Quest Casino has transitioned to a `monoRepo`, which is very scalable. This setup allows for potential expansions into mobile development and additional web apps. Also, this allows for the API to communicate with the front-end via proxy which can provide better performance. This monoRepo uses `npm` and `turboRepo` as the build system.

### Web
The `web` (front-end) directory is a `TypeSript React` app which uses `Vite` and custom an SSR server for SEO, `Framer Motion` for dynamic animations, `Redux` for state management, `Storybook` for testing and component management with the help from `Class Variance Authority` for variants and `Radix UI` here and there for accessibly and other benefits. `PostCSS` and `CSS modules` handles styling.

### Api
The `api` (back-end) directory is the main API, developed using `TypeScript Express`. Despite considering alternative options, Quest Casino remains integrated with `Firebase`, I thought there was no reason to move the current `Firestore` database to some other document-oriented database, so we will still have the advantages of Firebase.

_This is the plan as of now._

## First Steps
I'm going to start with the new chat feature for Quest Casino, yes the app will have a chat now using `socket.io`.

## Collaboration Appreciated!
I would love to work with other people with this fun app I envisioned. Quest Casino's UI has undergone rigorous design and UX testing to ensure a great user experience, this is the real deal. If you're interested in exploring the design case study for the new version of Quest Casino you can find it on my portfolio website or just use this [link](https://docs.google.com/presentation/d/1cegjwMxQvDhePSHiwVTRRgHZQYwQCqj3NcJFy1GPhMk/edit?usp=sharing). You'll find it at [https://www.davidbishop.info/#design](https://www.davidbishop.info/#design) on my portfolio.

When collaborating, you don't have to help with the main UI, I am also looking for people to make some games for Quest Casino. So, if you think of a cool Casino game to be featured, go right ahead. You could use JavaScript with preferably TypeScript and no React if you really want to, but other games are using React.

To collaborate just shoot me a [email](mailto:davidbish2002@hotmail.com) or you can contact me on [Linkedin](https://www.linkedin.com/in/d-bish/).

### Getting Started
...

## Directory Structure
...

## Thanks!
I hope my work can inspire you too, thank you for your interest in the app!

_**Deployed Stable Version (Version 1):** [www.questcasino.xyz](https://www.questcasino.xyz)_

<a href="https://www.buymeacoffee.com/dBish" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

<br />

---
Shield: [![CC BY 4.0][cc-by-shield]][cc-by]

This work is licensed under a
[Creative Commons Attribution 4.0 International License][cc-by].

[![CC BY 4.0][cc-by-image]][cc-by]

[cc-by]: http://creativecommons.org/licenses/by/4.0/
[cc-by-image]: https://i.creativecommons.org/l/by/4.0/88x31.png
[cc-by-shield]: https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg
