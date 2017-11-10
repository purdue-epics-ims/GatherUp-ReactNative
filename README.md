# GatherUp-ReactNative
Event attendance tracker web app for Purdue's Office of International Programs, containing abilities to view events and add to their attendance.

### Getting Started
1. Download the latest Node.js from [here](https://nodejs.org/en/)
2. Download the latest Git from [here](https://git-scm.com/downloads)
  - If you are Windows user, make sure you check getting git bash while you install
3. Open up terminal (git bash for windows), cd to the directory that you want to store this project
4. Type in the following command to clone down the project

 `git clone git@github.com:purdue-epics-ims/GatherUp-ReactNative.git`

 If you fail cloning:
  - Check your permission to the project with your team leader
  - Check if you have added the ssh key of your computer to Github, if not, follow [this tutorial to create a new ssh-key](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/) and [this tutorial to add your ssh-key to Github ](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/)

5. cd into GatherUp-ReactNative/Application after you finish cloning
6. Follow the [React-Native website](https://facebook.github.io/react-native/docs/getting-started.html) to download and install react-native as well as set up your emulator (android studio avd or physical devices). Make sure to [Enable Gradle](https://docs.gradle.org/2.9/userguide/gradle_daemon.html) if you are using Android. If this step gives you trouble check the links below

7. Type in the following command to download all the libraries for the project with npm:

  `npm install`

8. Finally, you can run the project with the following command if you are using npm:

  `react-native run-android`
              or
  'react-native run-ios'

### Software to Use for Development

- [Atom](https://atom.io/) or [VSCode](https://code.visualstudio.com/) as text editor, make sure you download packages (such as language-babel, eslint, etc.) for react development after you install these editors
- (Optional) [GitKraken](https://www.gitkraken.com/) nice and free git client if you hate using terminal and github client

### Trouble Shooting ###
- Make sure your environment variables for JAVA_HOME and ANDROID_HOME are set. Using android studio's directories is a solid idea.
- Try doing npm uninstall react-native and then npm install -g react-native-cli
- If windows gives you trouble try a linux machine.
- If linux give you trouble then buy a MAC

### Technologies to Learn
Please add or update more resources listed over time

- Basics:
  - Bash 
    - [Resource list for bash navigation](https://whatbox.ca/wiki/Bash_Shell_Commands)
  - Git
    - [15 minutes quick tutorial](https://try.github.io/levels/1/challenges/1)
    - [Beginner tutorial](http://product.hubspot.com/blog/git-and-github-tutorial-for-beginners)
  - HTML, CSS, JavaScript
    - [CodeCademy](https://www.codecademy.com/catalog/language/javascript)
  - React.js
    - [Official Docs](https://reactjs.org/)
    - [CodeCademy](https://www.codecademy.com/catalog/language/javascript)
  - Firebase
    - [Firebase Overview](https://firebase.google.com/docs/)
    - [Official References](https://firebase.google.com/docs/reference/js/)
- Advanced:
  - Redux
    - [Official Docs](http://redux.js.org/docs)
    - [Another Tutorial](https://github.com/happypoulp/redux-tutorial/blob/master/00_introduction.js)
  - React-Router 3
    - [Github](https://github.com/ReactTraining/react-router/tree/master/packages/react-router)
    - [Tutorial by Facebook](https://github.com/reactjs/react-router-tutorial)
