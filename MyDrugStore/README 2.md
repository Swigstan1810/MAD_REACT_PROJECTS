# Drug Speak

Drug Speak is a React Native mobile application designed to assist pharmacy students in learning the correct pronunciation of drug names. The app provides a comprehensive collection of drugs organized by categories, with each drug entry including its name, description, molecular formula, and audio pronunciations by both female and male speakers. Students can listen to pronunciations at varying speeds, record their own attempts, and receive a simulated evaluation score (randomly generated between 0 and 100 for this assignment). The app integrates with a dedicated Drug Speak Server for user authentication and learning record storage, enabling students to view a ranking of all users based on their pronunciation practice.

## Features

- **Drug Catalog**: Browse drugs organized by categories, with details including name, description, molecular formula, and audio pronunciations.
- **Pronunciation Practice**: Listen to drug name pronunciations at different speeds and record personal attempts.
- **Simulated Evaluation**: Receive a random score (0–100) simulating pronunciation accuracy.
- **User Authentication**: Sign up and sign in to access personalized features.
- **Learning Records**: Submit practice records to the backend server.
- **Ranking System**: View a leaderboard of all students based on pronunciation practice.

## Prerequisites

To run the Drug Speak application, ensure you have the following installed:

- **Node.js**: Version 16 or higher
- **npm** or **yarn**: Package manager for installing dependencies
- **React Native CLI**: For running the app on iOS/Android simulators or devices
- **Xcode** (for iOS): Latest version with iOS simulator
- **Android Studio** (for Android): Configured with an Android emulator
- **Drug Speak Server**: Access to the course-provided backend server for authentication and data storage

## Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd drug-speak
   ```

2. **Install Dependencies**:
   Using npm:
   ```bash
   npm install
   ```
   Or using yarn:
   ```bash
   yarn install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the server URL:
   ```env
   API_URL=<drug-speak-server-url>
   ```

4. **Run the App**:
   - For iOS:
     ```bash
     npx react-native run-ios
     ```
   - For Android:
     ```bash
     npx react-native run-android
     ```

## Project Structure

```plaintext
drug-speak/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # Main app screens (e.g., DrugList, Pronunciation, Login)
│   ├── services/         # API calls and server communication logic
│   ├── assets/           # Images, audio files, and other static resources
│   ├── navigation/       # React Navigation setup
│   └── utils/            # Helper functions (e.g., score generation)
├── .env                  # Environment variables
├── App.js                # Main app entry point
├── package.json          # Project dependencies and scripts
└── README.md             # Project documentation
```

## Usage

1. **Sign Up / Sign In**: Create an account or log in using credentials.
2. **Browse Drugs**: Navigate through categories to view drug details.
3. **Practice Pronunciation**: Select a drug, listen to audio pronunciations, and record your attempt.
4. **View Score**: Receive a randomly generated score (0–100) after each attempt.
5. **Check Rankings**: View the leaderboard to see your standing among other students.

## API Integration

The app communicates with the Drug Speak Server for:
- User authentication (sign-up and sign-in)
- Storing learning records
- Fetching drug data and audio files
- Retrieving student rankings

Ensure the `API_URL` in the `.env` file points to the correct server endpoint.

## Development Notes

- **Score Simulation**: The pronunciation evaluation is simulated using a random number generator (`Math.random() * 100`).
- **Audio Handling**: Audio files are fetched from the server and played using a library like `react-native-sound`.
- **React Navigation**: Used for navigating between screens (e.g., Home, Drug Details, Leaderboard).
- **State Management**: Basic state management with React hooks; consider Redux for larger-scale apps.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit changes (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For issues or inquiries, contact the project maintainers or refer to the course instructor for Drug Speak Server details.