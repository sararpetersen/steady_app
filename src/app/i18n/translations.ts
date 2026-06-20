export type Lang = "en" | "da";

const en = {
  lang: "en" as Lang,
  dateLocale: "en-GB",

  greeting: {
    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",
  },

  nav: {
    overview: "Home",
    tasks: "Tasks",
    routines: "Routines",
    habits: "Habits",
    focus: "Focus",
    note: "Note",
    profile: "Profile",
  },

  auth: {
    signUp: "Sign up",
    logIn: "Log in",
    emailLabel: "Email address",
    passwordLabel: "Password",
    confirmPasswordLabel: "Confirm password",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "At least 6 characters",
    confirmPasswordPlaceholder: "Repeat your password",
    createAccount: "Create account",
    continueWithGoogle: "Continue with Google",
    continueWithApple: "Continue with Apple",
    continueAsGuest: "Continue as guest (no account)",
    socialComingSoon: "Social login coming soon — use email to get started.",
    passwordsNoMatch: "Passwords don't match.",
    emailRequired: "Please enter your email address.",
    passwordTooShort: "Password must be at least 6 characters.",
    emailInUse: "An account with this email already exists.",
    invalidCredentials: "Incorrect email or password.",
    localDataNote: "Your data is stored locally on this device. Nothing is sent to any server.",
  },

  account: {
    heading: "Account",
    guestHeading: "Guest account",
    guestNote: "You're using Steady as a guest. Create an account to keep your settings safe.",
    createAccount: "Create an account",
    emailLabel: "Email",
    changeEmail: "Change email",
    newEmailLabel: "New email address",
    newEmailPlaceholder: "new@example.com",
    verifyPasswordLabel: "Current password (to confirm)",
    changePassword: "Change password",
    currentPasswordLabel: "Current password",
    newPasswordLabel: "New password",
    confirmNewPasswordLabel: "Confirm new password",
    save: "Save changes",
    saved: "Saved!",
    cancel: "Cancel",
    signOut: "Sign out",
    wrongPassword: "Current password is incorrect.",
    passwordTooShort: "New password must be at least 6 characters.",
    passwordsNoMatch: "Passwords don't match.",
    emailInUse: "This email is already in use.",
    emailRequired: "Please enter a new email address.",
  },

  settings: {
    title: "Settings",
    sections: {
      appearance: "Appearance",
      readability: "Readability",
      language: "Language",
      data: "Data & Privacy",
      account: "Account",
    },
    darkMode: { label: "Dark mode", description: "Switch to a dark colour theme" },
    fontSize: { label: "Text size", normal: "Normal", large: "Large", xlarge: "Extra large" },
    font: { label: "Font", standard: "Standard", readable: "Dyslexia-friendly (Atkinson)" },
    lineSpacing: { label: "Line spacing", normal: "Normal", spacious: "Spacious" },
    reduceMotion: { label: "Reduce motion", description: "Turn off animations across the app" },
    highContrast: { label: "High contrast", description: "Stronger text and border contrast" },
    resetOnboarding: "Restart onboarding",
    clearData: "Clear all my data",
    clearConfirm: "Are you sure? This will delete all tasks, notes, habits and mood history.",
    clearYes: "Yes, clear everything",
    clearNo: "Cancel",
    dataCleared: "All data cleared.",
  },

  moodHistory: {
    heading: "Mood History",
    description: "Your check-ins over the last 7 days.",
    noData: "No mood entries yet — check in daily from the Overview.",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },

  strengths: {
    heading: "My Strengths",
    description: "These are your superpowers. Celebrate them.",
    options: [
      { key: "hyperfocus", label: "Hyperfocus", emoji: "🎯" },
      { key: "creative", label: "Creative thinking", emoji: "🎨" },
      { key: "patterns", label: "Pattern recognition", emoji: "🔍" },
      { key: "empathy", label: "Deep empathy", emoji: "💗" },
      { key: "detail", label: "Attention to detail", emoji: "🔬" },
      { key: "outofbox", label: "Out-of-the-box ideas", emoji: "💡" },
      { key: "passionate", label: "Passionate interests", emoji: "⭐" },
      { key: "honest", label: "Honest & direct", emoji: "💬" },
      { key: "solver", label: "Creative problem solver", emoji: "🧩" },
      { key: "intuition", label: "Strong intuition", emoji: "🌊" },
    ],
  },

  noteHistory: {
    heading: "Previous Notes",
    empty: "No previous notes yet.",
    today: "Today",
    deleteEntry: "Delete this entry",
  },

  onboarding: {
    welcome: {
      title: "Welcome to Steady",
      subtitle:
        "Your calm daily companion for neurodivergent minds.",
      start: "Get started",
      returning: "I've been here before",
    },
    name: {
      title: "What should we call you?",
      subtitle: "A name or nickname — whatever feels right.",
      namePlaceholder: "Your name…",
      pronounPlaceholder: "Pronouns (optional)",
    },
    avatar: {
      title: "Pick your avatar",
      subtitle: "Choose one that feels like you.",
    },
    language: {
      title: "Choose your language",
      subtitle: "You can change this anytime in your profile.",
    },
    sensory: {
      title: "What's sometimes tricky for you?",
      subtitle:
        "Select anything that feels true — or skip. This is just for you.",
      skip: "Skip this step",
    },
    support: {
      title: "What helps you most?",
      subtitle: "These will shape your daily tips in the app.",
      skip: "Skip this step",
    },
    setup: {
      title: "How should the app look?",
      subtitle:
        "You can change all of this later in your profile.",
      textSize: "Text size",
      darkMode: "Dark mode",
      font: "Dyslexia-friendly font",
    },
    done: {
      title: "You're all set!",
      subtitle:
        "Steady is ready. Let's take today one step at a time.",
      enter: "Start my day",
    },
    next: "Next",
    back: "Back",
    stepOf: (current: number, total: number) =>
      `${current} of ${total}`,
  },

  overview: {
    tasksLeft: "Tasks left",
    habitsDone: "Habits done",
    streakDays: "Streak days",
    reminderTitle: "💡 Reminder",
    reminderText:
      "You don't have to do everything perfectly. Just do the next small step. That's enough.",
    tipForYou: "✨ A tip for you",
  },

  supportTips: {
    "Gentle reminders":
      "A gentle nudge: take a moment to check your routine list.",
    Checklists:
      "Try breaking your biggest task today into 3 small checkable steps.",
    "Quiet focus time":
      "Ready to focus? Silence notifications and try the timer.",
    "Written instructions":
      "Write down your top 3 must-dos before you start the day.",
    "Extra time to process":
      "It's okay to take your time. You don't need to rush.",
    "Visual cues":
      "Your colour-coded routines are ready when you need a visual guide.",
    default:
      "You're doing well. Take it one small step at a time.",
  } as Record<string, string>,

  sensoryTips: {
    "Noise-sensitive":
      "🎧 If it's noisy, try headphones or earplugs to protect your focus.",
    "Light-sensitive":
      "🌙 Dark mode is on. You can also lower your screen brightness.",
    "Need lots of movement":
      "🚶 Remember to take short movement breaks throughout the day.",
    "Need stillness":
      "🧘 Find a calm spot before diving into tasks — stillness helps.",
    "Texture-sensitive":
      "🤲 Wear comfortable clothing today — comfort supports focus.",
    "Smell-sensitive":
      "🪟 Opening a window for fresh air can help clear your head.",
  } as Record<string, string>,

  mood: {
    heading: "How are you feeling right now?",
    description:
      "Just pick the one that feels closest — no wrong answer.",
    result: (label: string, emoji: string) =>
      `Got it — you're feeling ${label.toLowerCase()} ${emoji}. That's okay.`,
    options: [
      { key: "Tired", label: "Tired", emoji: "😴" },
      { key: "Stressed", label: "Stressed", emoji: "😟" },
      { key: "Okay", label: "Okay", emoji: "😐" },
      { key: "Good", label: "Good", emoji: "🙂" },
      { key: "Great", label: "Great", emoji: "😄" },
    ],
  },

  tasks: {
    heading: "Today's Tasks",
    description:
      "Check things off as you go — every little thing counts!",
    left: "left",
    placeholder: "Add a new task...",
    add: "Add",
    markComplete: "Mark complete",
    markIncomplete: "Mark incomplete",
    remove: "Remove task",
    emptyTitle: "No tasks yet",
    emptySubtitle: "Add something small to start — even one thing is enough.",
  },

  routines: {
    heading: "Daily Routines",
    description:
      "Your day broken into easy steps. Tap a section to open it.",
    addStepPlaceholder: "Add a step…",
    addStepButton: "Add",
    deleteStep: "Delete step",
    noSteps: "No steps yet — tap below to add your first one.",
    sections: {
      morning: { label: "Morning", time: "7:00 – 9:00 AM" },
      afternoon: {
        label: "Afternoon",
        time: "12:00 – 2:00 PM",
      },
      evening: { label: "Evening", time: "8:00 – 10:00 PM" },
    },
    items: {
      1: "Wake up",
      2: "Drink some water",
      3: "Take morning medication and vitamins",
      4: "Eat breakfast",
      5: "Get ready for the day",
      6: "Eat lunch",
      7: "Take afternoon medication",
      8: "Do homework",
      9: "Prepare clothes for tomorrow",
      10: "Wind-down activity (reading/music)",
      11: "Check to-do list",
      12: "Lights out",
    },
  },

  habits: {
    heading: "Habit Tracker",
    description:
      "Small habits, big difference. Tap to mark done today.",
    addHabit: "Add a habit",
    namePlaceholder: "Habit name…",
    deleteHabit: "Delete habit",
    noHabits: "No habits yet. Add one below!",
    emptyTitle: "No habits yet",
    emptySubtitle: "Start with something simple — one small habit makes a difference.",
    cancel: "Cancel",
    items: [
      {
        key: "water",
        name: "Drink 8 glasses of water",
        emoji: "💧",
      },
      { key: "move", name: "Move my body", emoji: "🚶" },
      {
        key: "screens",
        name: "No screens 1 hr before bed",
        emoji: "📵",
      },
      {
        key: "journal",
        name: "Journal or gratitude note",
        emoji: "📝",
      },
    ],
  },

  focus: {
    heading: "Focus Timer",
    description:
      "Pick a time, start, and do one thing at a time. You've got this.",
    start: "Start",
    pause: "Pause",
    reset: "Reset",
    done: "🎉 Great work! Time for a break.",
  },

  note: {
    heading: "Daily Note",
    description:
      "No pressure — just a space to write down anything on your mind.",
    prompts: [
      "What's one thing you're looking forward to today?",
      "What's something small you're proud of recently?",
      "What do you need most right now?",
      "What's one thing you want to let go of today?",
      "How can you be kind to yourself today?",
    ],
    placeholder: "Write anything here...",
    characters: "characters",
    save: "Save",
    saved: "Saved ✓",
  },

  profile: {
    heading: "About Me",
    description:
      "This is just for you — it helps Steady feel personal.",
    pickAvatar: "Pick your avatar",
    emojiAvatar: "Emoji avatar",
    shownWhenNoPhoto: "shown when no photo",
    addPhoto: "Add photo",
    changePhoto: "Change",
    removePhoto: "Remove photo",
    optionalPhoto: "Optional photo",
    photoSet: "Photo set",
    namePlaceholder: "Your name or nickname",
    pronounsLabel: "Pronouns (optional)",
    pronounsOptions: ["he/him", "she/her", "they/them", "he/they", "she/they", "any/all"],
    aboutLabel: "A note to yourself (optional)",

    sensory: {
      heading: "My Sensory Profile",
      description:
        "Select what applies to you. This helps you understand yourself better.",
      options: [
        {
          key: "Noise-sensitive",
          label: "Noise-sensitive",
          emoji: "🔇",
        },
        {
          key: "Light-sensitive",
          label: "Light-sensitive",
          emoji: "💡",
        },
        {
          key: "Need lots of movement",
          label: "Need lots of movement",
          emoji: "🚶",
        },
        {
          key: "Need stillness",
          label: "Need stillness",
          emoji: "🧘",
        },
        {
          key: "Texture-sensitive",
          label: "Texture-sensitive",
          emoji: "🤲",
        },
        {
          key: "Smell-sensitive",
          label: "Smell-sensitive",
          emoji: "👃",
        },
      ],
    },

    support: {
      heading: "What Helps Me",
      description:
        "Good to know what works for you. Select all that apply.",
      options: [
        {
          key: "Gentle reminders",
          label: "Gentle reminders",
          emoji: "🔔",
        },
        { key: "Checklists", label: "Checklists", emoji: "✅" },
        {
          key: "Quiet focus time",
          label: "Quiet focus time",
          emoji: "🤫",
        },
        {
          key: "Written instructions",
          label: "Written instructions",
          emoji: "📋",
        },
        {
          key: "Extra time to process",
          label: "Extra time to process",
          emoji: "⏳",
        },
        {
          key: "Visual cues",
          label: "Visual cues",
          emoji: "👁️",
        },
      ],
    },

    save: "Save my profile",
    saved: "✓ Profile saved!",
  },

  a11y: {
    heading: "Accessibility",
    description:
      "Make Steady work the way that's easiest for you.",
    fontSize: {
      label: "Text size",
      normal: "Normal",
      normalHint: "Default",
      large: "Large",
      largeHint: "A bit bigger",
      xlarge: "Extra large",
      xlargeHint: "Biggest",
    },
    font: {
      label: "Font style",
      standard: "Standard",
      standardHint: "Nunito — rounded & friendly",
      readable: "Dyslexia-friendly",
      readableHint: "Atkinson Hyperlegible",
    },
    lineSpacing: {
      label: "Line spacing",
      normal: "Normal",
      spacious: "Spacious",
      spaciousHint: "More breathing room",
    },
    reduceMotion: {
      label: "Reduce motion",
      description:
        "Turns off animations and transitions across the app",
    },
    highContrast: {
      label: "High contrast",
      description:
        "Darker text and stronger borders for easier reading",
    },
    darkMode: {
      label: "Dark mode",
      description: "Switches the app to a dark colour theme",
    },
    language: {
      label: "Language",
      en: "English",
      da: "Dansk",
    },
    instantNote:
      "💡 These settings will be applied automatically — no need to save.",
  },
};

const da: typeof en = {
  lang: "da" as Lang,
  dateLocale: "da-DK",

  greeting: {
    morning: "God morgen",
    afternoon: "God eftermiddag",
    evening: "God aften",
  },

  nav: {
    overview: "Hjem",
    tasks: "Opgaver",
    routines: "Rutiner",
    habits: "Vaner",
    focus: "Fokus",
    note: "Note",
    profile: "Profil",
  },

  auth: {
    signUp: "Opret konto",
    logIn: "Log ind",
    emailLabel: "E-mailadresse",
    passwordLabel: "Adgangskode",
    confirmPasswordLabel: "Bekræft adgangskode",
    emailPlaceholder: "dig@eksempel.dk",
    passwordPlaceholder: "Mindst 6 tegn",
    confirmPasswordPlaceholder: "Gentag din adgangskode",
    createAccount: "Opret konto",
    continueWithGoogle: "Fortsæt med Google",
    continueWithApple: "Fortsæt med Apple",
    continueAsGuest: "Fortsæt som gæst (uden konto)",
    socialComingSoon: "Social login kommer snart — brug e-mail i mellemtiden.",
    passwordsNoMatch: "Adgangskoderne stemmer ikke overens.",
    emailRequired: "Indtast venligst din e-mailadresse.",
    passwordTooShort: "Adgangskoden skal være mindst 6 tegn.",
    emailInUse: "Der findes allerede en konto med denne e-mail.",
    invalidCredentials: "Forkert e-mail eller adgangskode.",
    localDataNote: "Dine data gemmes lokalt på denne enhed. Intet sendes til nogen server.",
  },

  account: {
    heading: "Konto",
    guestHeading: "Gæstekonto",
    guestNote: "Du bruger Steady som gæst. Opret en konto for at beskytte dine indstillinger.",
    createAccount: "Opret en konto",
    emailLabel: "E-mail",
    changeEmail: "Skift e-mail",
    newEmailLabel: "Ny e-mailadresse",
    newEmailPlaceholder: "ny@eksempel.dk",
    verifyPasswordLabel: "Nuværende adgangskode (til bekræftelse)",
    changePassword: "Skift adgangskode",
    currentPasswordLabel: "Nuværende adgangskode",
    newPasswordLabel: "Ny adgangskode",
    confirmNewPasswordLabel: "Bekræft ny adgangskode",
    save: "Gem ændringer",
    saved: "Gemt!",
    cancel: "Annuller",
    signOut: "Log ud",
    wrongPassword: "Den nuværende adgangskode er forkert.",
    passwordTooShort: "Ny adgangskode skal være mindst 6 tegn.",
    passwordsNoMatch: "Adgangskoderne stemmer ikke overens.",
    emailInUse: "Denne e-mail er allerede i brug.",
    emailRequired: "Indtast venligst en ny e-mailadresse.",
  },

  settings: {
    title: "Indstillinger",
    sections: {
      appearance: "Udseende",
      readability: "Læsbarhed",
      language: "Sprog",
      data: "Data og privatliv",
      account: "Konto",
    },
    darkMode: { label: "Mørk tilstand", description: "Skift til et mørkt farvetema" },
    fontSize: { label: "Tekststørrelse", normal: "Normal", large: "Stor", xlarge: "Ekstra stor" },
    font: { label: "Skrifttype", standard: "Standard", readable: "Dysleksivenlig (Atkinson)" },
    lineSpacing: { label: "Linjeafstand", normal: "Normal", spacious: "Rumlig" },
    reduceMotion: { label: "Reducér bevægelse", description: "Sluk for animationer i appen" },
    highContrast: { label: "Høj kontrast", description: "Stærkere tekst- og kantkontrast" },
    resetOnboarding: "Genstart opsætning",
    clearData: "Ryd alle mine data",
    clearConfirm: "Er du sikker? Dette sletter alle opgaver, noter, vaner og stemningshistorik.",
    clearYes: "Ja, ryd alt",
    clearNo: "Annuller",
    dataCleared: "Alle data er ryddet.",
  },

  moodHistory: {
    heading: "Stemningshistorik",
    description: "Dine tjek-ind de seneste 7 dage.",
    noData: "Ingen stemningsindtastninger endnu — tjek ind dagligt fra Hjem.",
    days: ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"],
  },

  strengths: {
    heading: "Mine styrker",
    description: "Dette er dine superkræfter. Fejr dem.",
    options: [
      { key: "hyperfocus", label: "Hyperfokus", emoji: "🎯" },
      { key: "creative", label: "Kreativ tænkning", emoji: "🎨" },
      { key: "patterns", label: "Mønstergenkendelse", emoji: "🔍" },
      { key: "empathy", label: "Dyb empati", emoji: "💗" },
      { key: "detail", label: "Øje for detaljer", emoji: "🔬" },
      { key: "outofbox", label: "Originale idéer", emoji: "💡" },
      { key: "passionate", label: "Lidenskabelige interesser", emoji: "⭐" },
      { key: "honest", label: "Ærlig og direkte", emoji: "💬" },
      { key: "solver", label: "Kreativ problemløser", emoji: "🧩" },
      { key: "intuition", label: "Stærk intuition", emoji: "🌊" },
    ],
  },

  noteHistory: {
    heading: "Tidligere noter",
    empty: "Ingen tidligere noter endnu.",
    today: "I dag",
    deleteEntry: "Slet denne note",
  },

  onboarding: {
    welcome: {
      title: "Velkommen til Steady",
      subtitle:
        "Din rolige daglige følgesvend for neurodivergente sind.",
      start: "Kom i gang",
      returning: "Jeg har været her før",
    },
    name: {
      title: "Hvad skal vi kalde dig?",
      subtitle:
        "Et navn eller kaldenavn — hvad der føles rigtigt.",
      namePlaceholder: "Dit navn…",
      pronounPlaceholder: "Pronomener (valgfrit)",
    },
    avatar: {
      title: "Vælg din avatar",
      subtitle: "Vælg én der føles som dig.",
    },
    language: {
      title: "Vælg dit sprog",
      subtitle:
        "Du kan ændre dette når som helst i din profil.",
    },
    sensory: {
      title: "Hvad kan nogle gange være svært?",
      subtitle:
        "Vælg hvad der føles sandt — eller spring over. Det er kun for dig.",
      skip: "Spring dette trin over",
    },
    support: {
      title: "Hvad hjælper dig mest?",
      subtitle: "Disse former dine daglige tips i appen.",
      skip: "Spring dette trin over",
    },
    setup: {
      title: "Hvordan skal appen se ud?",
      subtitle: "Du kan ændre alt dette senere i din profil.",
      textSize: "Tekststørrelse",
      darkMode: "Mørk tilstand",
      font: "Dysleksivenlig skrift",
    },
    done: {
      title: "Du er klar!",
      subtitle:
        "Steady er klar. Lad os tage dagen ét lille skridt ad gangen.",
      enter: "Start min dag",
    },
    next: "Næste",
    back: "Tilbage",
    stepOf: (current: number, total: number) =>
      `${current} af ${total}`,
  },

  overview: {
    tasksLeft: "Opgaver tilbage",
    habitsDone: "Vaner klaret",
    streakDays: "Dages streak",
    reminderTitle: "💡 Påmindelse",
    reminderText:
      "Du behøver ikke gøre alt perfekt. Tag bare det næste lille skridt. Det er nok.",
    tipForYou: "✨ Et tip til dig",
  },

  supportTips: {
    "Gentle reminders":
      "En blid påmindelse: tag et øjeblik til at tjekke din rutinoversigt.",
    Checklists:
      "Prøv at dele din største opgave i dag op i 3 små trin.",
    "Quiet focus time":
      "Klar til fokus? Slå notifikationer fra og prøv timeren.",
    "Written instructions":
      "Skriv dine top 3 must-dos ned, inden du starter dagen.",
    "Extra time to process":
      "Det er okay at tage din tid. Du behøver ikke skynde dig.",
    "Visual cues":
      "Dine farvekodede rutiner er klar, når du har brug for et visuelt overblik.",
    default:
      "Du klarer dig godt. Tag det ét lille skridt ad gangen.",
  } as Record<string, string>,

  sensoryTips: {
    "Noise-sensitive":
      "🎧 Hvis det er støjende, prøv høretelefoner eller ørepropper.",
    "Light-sensitive":
      "🌙 Mørk tilstand er slået til. Du kan også sænke skærmens lysstyrke.",
    "Need lots of movement":
      "🚶 Husk at tage korte bevægelsespauser i løbet af dagen.",
    "Need stillness":
      "🧘 Find et roligt sted, inden du går i gang — ro hjælper.",
    "Texture-sensitive":
      "🤲 Bær behageligt tøj i dag — komfort støtter fokus.",
    "Smell-sensitive":
      "🪟 At åbne et vindue for frisk luft kan hjælpe med at rydde hovedet.",
  } as Record<string, string>,

  mood: {
    heading: "Hvordan har du det lige nu?",
    description:
      "Vælg bare den, der føles tættest på — der er intet forkert svar.",
    result: (label: string, emoji: string) =>
      `Forstået — du har det ${label.toLowerCase()} ${emoji}. Det er okay.`,
    options: [
      { key: "Tired", label: "Træt", emoji: "😴" },
      { key: "Stressed", label: "Stresset", emoji: "😟" },
      { key: "Okay", label: "Okay", emoji: "😐" },
      { key: "Good", label: "Godt", emoji: "🙂" },
      { key: "Great", label: "Fantastisk", emoji: "😄" },
    ],
  },

  tasks: {
    heading: "Dagens opgaver",
    description: "Sæt kryds efterhånden — alt tæller!",
    left: "tilbage",
    placeholder: "Tilføj en ny opgave...",
    add: "Tilføj",
    markComplete: "Markér som færdig",
    markIncomplete: "Markér som ufærdig",
    remove: "Fjern opgave",
    emptyTitle: "Ingen opgaver endnu",
    emptySubtitle: "Tilføj noget lille for at starte — selv én ting er nok.",
  },

  routines: {
    heading: "Daglige rutiner",
    description:
      "Din dag opdelt i nemme trin. Tryk på en sektion for at åbne den.",
    addStepPlaceholder: "Tilføj et trin…",
    addStepButton: "Tilføj",
    deleteStep: "Slet trin",
    noSteps: "Ingen trin endnu — tryk nedenfor for at tilføje det første.",
    sections: {
      morning: { label: "Morgen", time: "7:00 – 9:00" },
      afternoon: {
        label: "Eftermiddag",
        time: "12:00 – 14:00",
      },
      evening: { label: "Aften", time: "20:00 – 22:00" },
    },
    items: {
      1: "Vågn op",
      2: "Drik noget vand",
      3: "Tag morgen-medicin og vitaminer",
      4: "Spis morgenmad",
      5: "Gør dig klar til dagen",
      6: "Spis frokost",
      7: "Tag eftermiddags-medicin",
      8: "Lav lektier",
      9: "Læg tøj frem til i morgen",
      10: "Afslappende aktivitet (læsning/musik)",
      11: "Tjek opgavelisten",
      12: "Sluk lyset",
    },
  },

  habits: {
    heading: "Vane-tracker",
    description:
      "Små vaner, stor forskel. Tryk for at markere som gjort i dag.",
    addHabit: "Tilføj en vane",
    namePlaceholder: "Vanenavn…",
    deleteHabit: "Slet vane",
    noHabits: "Ingen vaner endnu. Tilføj en nedenfor!",
    emptyTitle: "Ingen vaner endnu",
    emptySubtitle: "Start med noget enkelt — én lille vane gør en forskel.",
    cancel: "Annuller",
    items: [
      { key: "water", name: "Drik 8 glas vand", emoji: "💧" },
      { key: "move", name: "Bevæg kroppen", emoji: "🚶" },
      {
        key: "screens",
        name: "Ingen skærm 1 time før sengetid",
        emoji: "📵",
      },
      {
        key: "journal",
        name: "Dagbog eller taknemlighedsnote",
        emoji: "📝",
      },
    ],
  },

  focus: {
    heading: "Fokus-timer",
    description:
      "Vælg en tid, start, og gør én ting ad gangen. Du kan det!",
    start: "Start",
    pause: "Pause",
    reset: "Nulstil",
    done: "🎉 Godt klaret! Tid til en pause.",
  },

  note: {
    heading: "Daglig note",
    description:
      "Intet pres — bare et sted at skrive alt, hvad du har på hjertet.",
    prompts: [
      "Hvad er ét ting, du glæder dig til i dag?",
      "Hvad er noget lille, du er stolt af for nylig?",
      "Hvad har du mest brug for lige nu?",
      "Hvad er ét ting, du gerne vil slippe i dag?",
      "Hvordan kan du være venlig over for dig selv i dag?",
    ],
    placeholder: "Skriv hvad som helst her...",
    characters: "tegn",
    save: "Gem",
    saved: "Gemt ✓",
  },

  profile: {
    heading: "Om mig",
    description:
      "Dette er bare for dig — det hjælper Steady med at føles personlig.",
    pickAvatar: "Vælg din avatar",
    emojiAvatar: "Emoji-avatar",
    shownWhenNoPhoto: "vises når der ikke er foto",
    addPhoto: "Tilføj foto",
    changePhoto: "Skift",
    removePhoto: "Fjern foto",
    optionalPhoto: "Valgfrit foto",
    photoSet: "Foto valgt",
    namePlaceholder: "Dit navn eller kaldenavn",
    pronounsLabel: "Pronomener (valgfrit)",
    pronounsOptions: ["han/ham", "hun/hende", "de/dem", "han/de", "hun/de", "alle"],
    aboutLabel: "En note til dig selv (valgfrit)",

    sensory: {
      heading: "Mit sensoriske profil",
      description:
        "Vælg det, der gælder for dig. Det hjælper dig med at forstå dig selv bedre.",
      options: [
        {
          key: "Noise-sensitive",
          label: "Lydfølsom",
          emoji: "🔇",
        },
        {
          key: "Light-sensitive",
          label: "Lysfølsom",
          emoji: "💡",
        },
        {
          key: "Need lots of movement",
          label: "Har brug for bevægelse",
          emoji: "🚶",
        },
        {
          key: "Need stillness",
          label: "Har brug for ro",
          emoji: "🧘",
        },
        {
          key: "Texture-sensitive",
          label: "Teksturfølsom",
          emoji: "🤲",
        },
        {
          key: "Smell-sensitive",
          label: "Lugtefølsom",
          emoji: "👃",
        },
      ],
    },

    support: {
      heading: "Hvad hjælper mig",
      description:
        "Godt at vide hvad der virker for dig. Vælg alt der gælder.",
      options: [
        {
          key: "Gentle reminders",
          label: "Blide påmindelser",
          emoji: "🔔",
        },
        { key: "Checklists", label: "Tjeklister", emoji: "✅" },
        {
          key: "Quiet focus time",
          label: "Stille fokustid",
          emoji: "🤫",
        },
        {
          key: "Written instructions",
          label: "Skriftlige instruktioner",
          emoji: "📋",
        },
        {
          key: "Extra time to process",
          label: "Ekstra tid til bearbejdning",
          emoji: "⏳",
        },
        {
          key: "Visual cues",
          label: "Visuelle signaler",
          emoji: "👁️",
        },
      ],
    },

    save: "Gem min profil",
    saved: "✓ Profil gemt!",
  },

  a11y: {
    heading: "Tilgængelighed",
    description:
      "Gør Steady til at fungere på den måde, der er nemmest for dig.",
    fontSize: {
      label: "Tekststørrelse",
      normal: "Normal",
      normalHint: "Standard",
      large: "Stor",
      largeHint: "Lidt større",
      xlarge: "Ekstra stor",
      xlargeHint: "Størst",
    },
    font: {
      label: "Skriftstil",
      standard: "Standard",
      standardHint: "Nunito — rundet & læsevenlig",
      readable: "Dysleksivenlig",
      readableHint: "Atkinson Hyperlegible",
    },
    lineSpacing: {
      label: "Linjeafstand",
      normal: "Normal",
      spacious: "Rumlig",
      spaciousHint: "Mere luft",
    },
    reduceMotion: {
      label: "Reducér bevægelse",
      description:
        "Slukker for animationer og overgange i hele appen",
    },
    highContrast: {
      label: "Høj kontrast",
      description:
        "Mørkere tekst og stærkere kanter for nemmere læsning",
    },
    darkMode: {
      label: "Mørk tilstand",
      description: "Skifter appen til et mørkt farvetema",
    },
    language: {
      label: "Sprog",
      en: "English",
      da: "Dansk",
    },
    instantNote:
      "💡 Disse indstillinger træder i kraft automatisk — du behøver ikke gemme.",
  },
};

export const translations: Record<Lang, typeof en> = { en, da };
export type T = typeof en;