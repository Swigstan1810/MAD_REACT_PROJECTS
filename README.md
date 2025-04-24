# Mobile Application Development Projects

This repository contains two React Native mobile applications developed for the 3701IC Mobile Application Development (MAD) course: **My Todo List** (Assignment 1) and **Drug Speak** (Assignment 2). These projects demonstrate skills in mobile app development, version control, and user interface design, adhering to the course assignment specifications.

## Repository Overview

- **GitHub Repository**: A private repository for version control, with commits labeled as "Milestone 1", "Milestone 2", or "Final Submission" for each project.
- **Projects**:
  - **My Todo List**: A task management app for adding, viewing, editing, and deleting to-do items with persistent storage.
  - **Drug Speak**: An educational app for pharmacy students to practice drug name pronunciation, integrated with a server for authentication and rankings.
- **Assessor Access**: The course assessor must be invited as a collaborator to monitor progress and provide feedback.

## Project Details

### My Todo List (Assignment 1)

**Overview**: My Todo List is a personal task manager allowing users to manage to-do items with features for adding, editing, deleting, and marking tasks as finished, with data persistence using AsyncStorage.

**Features**:

- **Home Screen**: Displays a dynamic to-do list using FlatList, with expandable/collapsible views for task details.
- **Add New Todo Screen**: Input fields for title and description with validation, featuring Save and Back buttons.
- **Task Management**: Mark tasks as finished, delete tasks, and toggle between contracted and expanded views.
- **Data Persistence**: Stores tasks and their states (finished/not finished) across app sessions using AsyncStorage.

**Milestones**:

- **Milestone 1 (Week 3)**: Main page with hardcoded to-do list, "My Todo List" title, and a non-functional "Add New Todo" button.
- **Milestone 2 (Week 4)**: Customized "Add New Todo" button with navigation to a screen featuring title/description inputs and Cancel/Save buttons.
- **Final Submission (Week 5)**: Full functionality including dynamic task listing, input validation, task state management, and data persistence.

**Submission Requirements**:

- Word document with:
  - GitHub repository URL
  - Screenshots of app screens (Home, Add New Todo, expanded task view)
  - Screenshot of GitHub commit history
  - Link to a 5-minute video demonstration (uploaded to YouTube, unlisted) with voice narration explaining features

### Drug Speak (Assignment 2)

**Overview**: Drug Speak helps pharmacy students learn drug name pronunciations through a categorized drug catalog, audio playback, recording capabilities, and server integration for user authentication and community rankings.

**Features**:

- **Drug Category Screen**: Lists drug categories with counts, loaded from provided resources.
- **Drug List & Detail Screens**: Scrollable drug lists and detailed views with name, molecular formula, description, and pronunciation audio (male/female, variable speeds).
- **Learning List Screen**: Manages Current Learning and Finished drug lists with compact/extended display modes and a badge for Current Learning count.
- **User Authentication**: Sign-up, sign-in, profile management, and sign-out with server-side validation.
- **Pronunciation Practice**: Play audio at speeds (0.25, 0.33, 0.75, 1.0), record attempts, and simulate evaluation with random scores (0–100).
- **Community Ranking**: Displays a sorted user ranking list (fetched from the server) with rank, name, gender, and progress details.

**Milestones**:

- **Milestone 1 (Week 7)**: Drug Category, List, and Detail screens with resource loading and navigation.
- **Milestone 2 (Week 9)**: Bottom tab navigation (Drugs, Learning), Learning List screen with toggle modes, and Learning screen layout.
- **Final Submission (Week 11)**: Full API integration, authentication, recording/evaluation, and community ranking features.

**Submission Requirements**:

- Word document with:
  - GitHub repository URL
  - Screenshots of app screens and Redux code (e.g., learning slice)
  - Screenshot of GitHub commit history
  - Link to an 8-minute video demonstration (uploaded to YouTube, unlisted) showcasing all functionalities with two user accounts
- **Master’s students**: One-page reflection on learning outcomes and technical insights

## Prerequisites

To run either project, ensure the following are installed:

- Node.js (v16 or higher)
- npm or yarn
- React Native CLI
- Xcode (for iOS) with iOS simulator
- Android Studio (for Android) with an emulator
- **Drug Speak Server** (for Drug Speak): Access to the course-provided backend server
