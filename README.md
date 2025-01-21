# Medical Content Review App (Frontend)

**Key Features and Components:**

* **Firebase Integration:** The app heavily relies on Firebase for various functionalities:
    * **Authentication:** Uses `firebase/auth` for user authentication and manages user sessions. The `useAuth` hook provides real-time authentication state and redirects users to the sign-in page if not authenticated.
    * **Firestore:** Uses `firebase/firestore` for real-time database interactions. It handles creating new chats, adding messages, retrieving chat data, updating chat titles, listening for chat changes, and managing uploaded files' metadata.
    * **Storage:** Uses `firebase/storage` for uploading and retrieving files associated with chat messages.

* **Chat Interface (`Chat.tsx`):**
    * **Message Input:** Allows users to type and send messages.
    * **File Uploads:** Supports uploading files along with messages using the `UploadCard` component (not shown in the provided code but referenced).
    * **Message Display:** Displays chat messages with different components for questions and answers (`Question`, `Answer`).
    * **New Chat Creation:** Handles creating new chats and setting initial messages.
    * **Chat History:** Integrates with the `History` component to display chat history and allow users to switch between chats.
    * **Real-time Updates:** Uses `listenToChatChanges` to update the chat interface in real-time as new messages are added or the chat status changes.
    * **Mode Selection:** Allows users to select the style mode for the generated responses (e.g., descriptive, marketing, scientific).
    * **Loading State:** Displays a loading animation while waiting for responses from the backend.
    * **Navigation:** Uses `next/navigation` for routing between chats and other pages.

* **Chat Tab (`ChatTab.tsx`):**
    * **Chat Initialization:** Initializes the chat by checking if a chat exists for the given `documentsReviewId`. If not, it creates a new chat.
    * **Loading State:** Displays a loading animation while the chat is being initialized.
    * **Chat Display:** Renders the `Chat` component once the chat is initialized.

* **Documents Tab (`DocumentsTab.tsx`):**
    * **File Display:** Displays uploaded files associated with the chat. Supports PDF and image rendering.
    * **Download URL Fetching:** Fetches download URLs for uploaded files from Firebase Storage.

* **Medical Claims Tab (`MedicalClaimsTab.tsx`):**
    * **Medical claims display:** Displays the identified medical claims, citations, and alternative improved claims.

* **Imprecise Language Tab (`ImpreciseLanguageTab.tsx`):**
    * **Imprecise Language Display:** Displays identified imprecise language instances, along with context, improvement suggestions, severity, and confidence score.
    * **Expandable Content:** Allows users to expand and collapse the details of each imprecise language instance.
    * **Loading State:** Displays a loading animation while the analysis is in progress.

* **Documents Review Page (`DocumentsReviewPage.tsx`):**
    * **Layout and Navigation:** Uses a `Layout` component and `next/navigation` for page structure and navigation.
    * **Tab Management:** Uses `Tabs` and `Select` components to allow users to switch between different tabs (Documents, Chat, Medical Claims, Imprecise Language).
    * **Data Fetching:** Fetches data for the documents review, including messages, claims, and imprecise language instances, from Firestore.
    * **Approve Button:** Includes an "Approve" button that triggers navigation back to the home page.
    * **Loading State/Checkmark:** Shows a loading animation during processing and a checkmark animation upon approval.


**Technical Details:**

* **Client-side Rendering:** The `use client` directive indicates that these components are rendered on the client-side
* **Hooks:** Uses React hooks like `useState`, `useEffect`, `useCallback`, `useMemo`, `useRouter`, `usePathname`, and `useColorMode` for managing state, side effects, memoization, routing, and color mode.
* **Markdown Rendering:** Uses `react-markdown` and `remark-gfm` for rendering Markdown content in messages and other components.
* **Lottie Animations:** Uses `lottie-react` for displaying loading and checkmark animations.
