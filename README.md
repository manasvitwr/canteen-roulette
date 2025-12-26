# Canteen Roulette 

A food decision engine for the Techsprint Hackathon by GDG KJSSE featuring a slot-machine randomizer, canteen explorer, and simulated order tracking representing a centralized platform for canteens and mess across campus

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/manasvitwr/canteen-roulette.git
    cd canteen-roulette
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the built-in fix script (if needed):**
    If you encounter missing dependency errors, strictly:
    ```bash
    npm install firebase
    npm install -D @babel/core
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

##  Firebase Setup Configuration

Follow these steps to configure the backend services.

### 1. Install & Login to Firebase
```bash
npm install -g firebase-tools
firebase login
# Opens browser; authenticate with your Google account.
```

### 2. Initialize Firebase
```bash
firebase init
```
**Select these options:**
- **Hosting:** Yes
- **Firestore:** Yes
- **Authentication:** Yes
- **Functions:** No
- **Emulators:** No
- **Use an existing project:** Yes (select yours)

### 3. Firestore Database Setup
1.  **Create Database:** Go to [Firebase Console](https://console.firebase.google.com/) > Firestore Database > Create Database.
    - Location: `us-central1` (or closest)
    - Mode: **Test mode**

2.  **Security Rules:**
    Replace existing rules in **Firestore > Rules** with:
    ```javascript
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        
        // Users can read/write their own doc
        match /users/{userId} {
          allow read, write: if request.auth.uid == userId;
        }
        
        // Everyone can read canteens and menu items
        match /canteens/{document=**} {
          allow read: if request.auth != null;
        }
        
        match /menu_items/{document=**} {
          allow read: if request.auth != null;
        }
        
        // Users can create/read their own orders
        match /orders/{document=**} {
          allow read, write: if request.auth.uid == resource.data.userId;
          allow create: if request.auth.uid == request.resource.data.userId;
        }
        
        // Deny all other access
        match /{document=**} {
          allow read, write: if false;
        }
      }
    }
    ```

### 4. Google Auth Setup
1.  **Enable Google Sign-In:** Console > Authentication > Sign-in method > Google > Enable.
2.  **OAuth Consent Screen:** 
    - Go to Google Cloud Console.
    - **User Type:** Internal (for @somaiya.edu restriction testing).
    - **Scopes:** `openid`, `email`, `profile`.
    - **Test Users:** Add your specific @somaiya.edu emails.

### 5. Environment Variables
Create a `.env.local` file in the root directory and add your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Deployment

```bash
npm run build
firebase deploy
```

## Features

- **Roulette**: Randomly select food items based on veg/non-veg preference.
  - Off Campus feature lets user explore options at any location
- **Explore**: Search for specific dishes across canteens.
- **Orders**: Simulated order tracking system. (centralised for all canteens & mess across campus)
- **Profile**: track stats and toggle preferences

  Made with <3 by Manasvi 
