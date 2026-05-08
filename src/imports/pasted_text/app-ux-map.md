Here is the complete UX Architecture and User Journey Map for your app. This is the exact blueprint your team’s frontend developer and UI designer need to build the app screen by screen.
I have structured the user flow to be extremely kid-friendly (very few clicks, highly visual) while showing a deep logical structure to impress the jury.
Phase 1: The App User Flow (High-Level Journey)
When a child opens the web app, this is their journey from start to finish:
Launch ➡️ Splash Screen ➡️ Profile Select ➡️ Sadeen Galaxy (Hub) ➡️ Choose Island ➡️ Click Level Node ➡️ Complete Lesson/Game/Quiz ➡️ Celebration Screen ➡️ Back to Map ➡️ Go to Store (Spend Gems).
Phase 2: Screen-by-Screen Breakdown
Screen 1: Splash & Login
Visuals: Big app logo, the Mascot "Sadeen" waving. Beautiful Algerian landscape in the background.
Contents:
Large primary button: "Play (Child)" (Takes them to profile select).
Small subtle link at bottom: "Parents & Teachers Zone" (Passcode protected).
UX Rule: Keep it bright and instant. No long sign-up forms for the kid.
Screen 2: The "Sadeen Galaxy" (Main Hub)
Visuals: A 2.5D space map with 5 floating themed islands.
Header (Top Nav Bar):
Left: Kid’s Avatar face (clickable to go to Profile/Shop).
Center: Currencies: [⭐️ 12] [💎 150].
Right: Settings (Sound on/off) & Parent dashboard button.
Contents (The 5 Islands):
🌱 Math Garden
🏺 History Desert / Zaman Map
🕌 Deen Mosque
🏡 Manners Village
🎨 Art & Build Sandbox
UX Rule: Islands should have a slight floating animation to feel alive.
Screen 3: The Profile & Store (The "Dopamine" Room)
Accessed by clicking the Avatar in the Hub.
Left Side (My Profile): Shows the current 3D/2D kid avatar. Shows a shelf with their Badges (e.g., "Addition Hero 🥇").
Right Side (The Souk/Store):
Tabs: [Clothes] [Hats] [Pets]
Items show a price tag in 💎 Gems.
Action: Clicking a 50💎 Traditional Burnous deducts gems and equips it to the avatar instantly.
Phase 3: The "Inside-the-Island" Flow (The Core Gameplay Loop)
When a kid clicks an island (e.g., History Desert), here is exactly what happens.
1. The Island Map Screen
A winding dirt path showing connected circles (Nodes).
Node 1 (Green/Unlocked). Node 2 (Gray/Locked).
User Action: Kid clicks "Node 1: Ancient Numidia".
2. The Level Popup (Menu)
Instead of forcing the kid into a quiz immediately, a cute window pops up with Sadeen the mascot:
"Welcome to Ancient Numidia!"
Button 1: 📖 Learn (The Lesson)
Button 2: 🎮 Play (The Game/Quiz) -> (Locked until they watch the lesson for the first time)
3. The "Learn" Screen (Mini-Lesson)
A simple, visually rich carousel (like Instagram stories but landscape).
Screen 1: Picture of Massinissa. Mascot text: "King Massinissa was a great Numidian leader." (Next button)
Screen 2: Picture of a horse. "Numidians were famous for their horses."
Finish: Kid earns +10 💎 for reading. The "Play" button is now unlocked!
4. The "Play" Screen (Game + Quiz phase)
This is where they earn their Stars (⭐️).
Phase 1 (The Game): They play the mini-game (e.g., dress the Numidian soldier).
Phase 2 (The Quiz Check): After the game, the mascot asks 1 to 3 quick questions to lock in the knowledge.
Question: "What animal were Numidians famous for?" -> [Pictures of: Camel, Horse, Fish]. -> Kid clicks Horse.
5. The Celebration Screen (Results)
Animation: 3 large star silhouettes.
Depending on performance (did they get the quiz right on the first try?), stars fill up with a satisfying PING PING PING sound.
UI Text: "Awesome! You earned ⭐️⭐️⭐️ and 50 💎!"
Buttons:[Retry Level] or [Next Level] or [Back to Map].
Phase 4: Track-Specific UX Examples (How it works in every track)
To help your team understand the variety, here is the flow for each subject using the UX rules above:
🟢 Math Track (The Garden)
Click Node 1: Addition Apples.
Lesson Button: Short animation showing 1 apple joining 2 apples to make 3.
Play Button: Mascot says "Put 3 apples in my basket." Kid drags them.
Quiz: "Count them! What is 1+2?" Kids click a number block (3).
🟠 History Track (The Desert)
Click Node 2: The Casbah Era.
Lesson Button: Comic-book style pictures of traditional Algiers, ships, and old streets.
Play Button: Timeline sort (drag the oldest picture to the left).
Quiz: "Where is this white city?"[Images: Desert tent vs. Casbah houses].
🔵 Deen Track (The Mosque)
Click Node 1: Wudu (Ablution).
Lesson Button: Mascot Sadeen visually does Wudu step-by-step.
Play Button: Jigsaw ordering. Kid drags the action cards (wash face, wash arms, wash feet) into the 1st, 2nd, and 3rd boxes.
Quiz: "Which comes first?" Multiple choice with images.
🟡 Manners Track (The Village)
Click Node 1: Sharing Toys.
Lesson Button: Short visual story about two kids fighting over a toy, then getting sad.
Play Button (Interactive Story): Sadeen is on screen holding a toy. A sad kid walks up.
Option A: Keep the toy. (Sadeen cries, you lose a star).
Option B: Share the toy. (Both kids smile, stars explode!)
🟣 Art & Build Track (The Creative Sandbox)
No lessons or quizzes here! This is purely a reward track.
Kid clicks the "Casbah City Builder" node.
App checks: "Do you have the Casbah Architect Badge (earned in History Node 2)?"
If Yes -> Opens an empty screen with geometric blocks and traditional windows/doors at the bottom. Kid freely drags them onto the screen to build their own Algerian city.
🔥 What you should say to the Developers today:
"Hey team, we are building a 3-layer architecture:
Layer 1: Global UI (The NavBar, Avatar, Gems, Maps).
Layer 2: The Modals (Popups showing 'Learn', 'Play', 'Results').
Layer 3: The Canvas (Where the actual dragging, dropping, or selecting happens for games).
For the hackathon, we only build 1 Canvas scene per world. If you click level 2 or 3, it just shows a "Coming Soon!" popup. We will fake the depth, but the architecture will prove it works."
This User Journey is tight, gamified, and proves extreme digital maturity to the hackathon jury! Ready to code?