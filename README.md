# About
 BlinkCamp is a free and open sourced project, made to help you improve your vision, reaction time, and eye to hand coordination through targeted exercises.
 
# Suggestions
If you would like to suggest new features, go to our [discord channel](https://discord.gg/Fea2vU8JFC)

# Want to Contribute?
BlinkCamp is written in TypeScript, CSS, and HTML, feel free to dig into the source code contribute new routines / themes / design improvements. For core changes or support I let's have a discussion in the [discord channel](https://discord.gg/Fea2vU8JFC)

# What's next

Ideas for contributors:

- **Wire background video** — `BackgroundVideo.ts` is built but the UI toggle is commented out. Needs YouTube API integration and a checkbox to enable/disable a looping ambient video behind the dot.
- **Wire push notifications** — `PushNotifications.ts` has the permission flow but needs a backend to actually send reminders. Alternatively, use the Notification API with `setTimeout` for session-end alerts.
- **Session timer / progress tracking** — show elapsed time, routines completed, or a simple streak counter in the UI.
- **More movement routines** — Lissajous curves, spiral patterns, random-walk paths. Follow the pattern in `src/Dot/Routines/`.
- **Physical calibration slider** — a user-facing "dot travel distance" multiplier so people using large monitors can scale the amplitude to their preference. (Automatic physical-size detection is not possible from browser CSS pixels.)
- **PWA support** — add a `manifest.json` and a service worker so the app can be installed as a standalone app on phones/desktops.
- **Sound cues** — subtle audio feedback when a routine changes or on click, using the Web Audio API.
