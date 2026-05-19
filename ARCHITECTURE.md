# Akshara-Deepa Tutor Architecture

This document provides architecture suggestions for porting this React-based reference application to **Android (Kotlin + Jetpack Compose)**.

## 1. Suggested Architecture: MVVM + Clean Architecture

To ensure the application is scalable, testable, and maintainable, we recommend a three-layer clean architecture.

### Data Layer
- **Repositories:** `SyllabusRepository`, `UserRepository`, `QuizRepository`.
- **Local Source:** Room Database for persistent storage of syllabus state, user stats, and quiz history.
- **Remote Source:** Retrofit or Ktor for AI Tutor API (Gemini) and Firestore for leaderboards.

### Domain Layer (Use Cases)
- `CompleteChapterUseCase`: Logic for marking a chapter complete and awarding XP.
- `CalculatePerformanceUseCase`: Generating radar chart data from quiz results.
- `GetAIResponseUseCase`: Interacting with the AI Tutor.

### UI Layer (MVVM)
- **ViewModels:** `DashboardViewModel`, `QuizViewModel`, `TutorViewModel`.
- **State:** Use `StateFlow` or `Compose State` to manage screen states.
- **Navigation:** Jetpack Compose Navigation for shifting between screens.

## 2. UI Components (Jetpack Compose Mapping)

| React Component (Tailwind) | Compose Equivalent |
| -------------------------- | ------------------ |
| `motion.div`               | `AnimatedVisibility` / `AnimatedContent` |
| `card-premium`             | `Card` with `RoundedCornerShape(28.dp)` and `elevation` |
| `btn-modern`               | `Button` with `ButtonDefaults.buttonColors()` and custom `Shape` |
| `Recharts` (Radar)         | `Canvas` drawing or libraries like `Vico` or `Compose-Charts` |

## 3. Gamification Logic
- **XP System:** Store `totalXP` in DataStore or Room. Level = `(totalXP / 1000) + 1`.
- **Streaks:** Compare `last_active_date` with `current_date`. If difference is exactly 1 day, increment streak.

## 4. AI Tutor (Gemini)
Use the official **Google AI SDK for Android**:
```kotlin
val generativeModel = GenerativeModel(
    modelName = "gemini-1.5-flash",
    apiKey = BuildConfig.apiKey
)
val chat = generativeModel.startChat()
```

## 5. Engaging Features for Students
- **Haptic Feedback:** Use `LocalHapticFeedback.current` for quiz correct answers.
- **Lottie Animations:** Use `com.airbnb.android:lottie-compose` for celebration (badges, level up).
- **Dark Mode:** Leverage `MaterialTheme` color schemes to provide a seamless dark mode experience.
