# Detect++ - Git Guide

This guide is designed to help users of Windows and Linux operating systems use Git to clone the Detect++ repository, create new branches, stage and commit changes, and create pull requests.

## Clone the Project:

To clone the Detect++ repository, follow these steps:

+ Open a command prompt window or Git Bash terminal.

+ Change to the directory where you want to clone the repository.

+ Run the following command:

```
git clone https://github.com/your-username/DetectPlusPlus.git
```

## Create a New Branch Locally:

To create a new branch locally, follow these steps:

+ Open a command prompt window or Git Bash terminal.

+ Change to the directory where the repository was cloned.

+ Run the following command to create a new branch:

```
git checkout -b new-branch-name
```
## Stage and Commit Changes:

To stage and commit changes, follow these steps:
### 1. Windows and Linux (CLI):

+ Open a command prompt window or terminal.

+ Change to the directory where the repository was cloned.

+ Run the following command to stage changes:

```
git add .
```

Run the following command to commit changes:

```
git commit -m "Your commit message here"
```

### 2. VS Code:

 + Open the repository in Visual Studio Code.

 + Make changes to the files as needed.

 + Open the Source Control panel by clicking on the Source Control icon on the left side of the window.

 + Click the "+" icon next to the file(s) you want to stage.

 + Enter your commit message in the textbox provided.

 + Click the checkmark icon to commit changes.

### 3. Sublime Merge:

+ Open the repository in Sublime Merge.

+ Make changes to the files as needed.

+ Click on the file(s) you want to stage to select them.

+ Press the "Stage" button to stage changes.

+ Enter your commit message in the textbox provided.

+ Press the "Commit" button to commit changes.

## Create and Push to Remote Repository:

To create and push to the remote repository, follow these steps:
### 1. Windows and Linux (CLI):

+ Open a command prompt window or terminal.

+ Change to the directory where the repository was cloned.

+ Run the following command to push changes to the remote repository:

```
git push origin new-branch-name
```
### 2. VS Code:

+ Open the repository in Visual Studio Code.

+ Open the Source Control panel by clicking on the Source Control icon on the left side of the window.

+ Click the three dots icon to open the menu.

+ Click "Push".

### 3. Sublime Merge:

+ Open the repository in Sublime Merge.

+ Click the "Push" button in the toolbar.

## Create a Pull Request:

To create a pull request, follow these steps:

+ Go to the GitHub website and navigate to the repository.

+ Click the "Pull Requests" tab.

+ Click the "New Pull Request" button.

+ Select the branch you want
