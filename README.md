# Thesis App
- Mobile app intended for android use for our high-school senior thesis
- Uses Ionic with capacitor to build onto android (ios not setup)
- Won State level in the Samsung Solve for Tomorrow event, winning $6,500 for our school
- Youtube video that showcases each item of the smart-home, and what we submitted for the project: 
[![Smart Home Video](https://img.youtube.com/vi/NEFJ0SKq-_A/0.jpg)](https://www.youtube.com/watch?v=NEFJ0SKq-_A)

<img src="docs/img/hw-pill-dispenser.png" alt="Pill dispenser on a kitchen counter" width="280"/><img src="docs/img/hw-pill-dispenser-lcd.png" alt="Pill dispenser screen prompting the user to drop pills" width="280"/><img src="docs/img/hw-bathtub-sensor.png" alt="Bathtub water level sensor next to the app" width="280"/>

<img src="docs/img/architecture-slide.png" alt="Three server designs considered, ending with ESP8266 modules, a Raspberry Pi and a database" width="560"/>

- Parts not shown in the repo:
- each module's code
- server-side code

pages:
- Fully featured login page that interacts with php api (not in repo)
  <br><img src="docs/img/app-login.png" alt="Login page" width="260"/>
- Caching of all information (including login)
- Dashboard that has map widget, weather information, and status of all smart home modules
  <br><img src="docs/img/app-dashboard.png" alt="Dashboard with weather and module status" width="260"/>
- Reminders page that communicated with the server to set reminders
  <br><img src="docs/img/app-reminders.png" alt="Reminders page" width="260"/>
- Settings page that has a ton of different individual pages
  <br><img src="docs/img/app-settings.png" alt="Settings page" width="260"/>
  - Ability to add contact information
    <br><img src="docs/img/app-contacts.png" alt="Contacts page" width="260"/>
  - Family Page
    <br><img src="docs/img/app-wander-alarm.png" alt="Family page with wander alarm hours" width="260"/>
  - Facial Recognition utilizing the face-api.min.js library (hosted on server, not in repo) 
    <br><img src="docs/img/app-facial-recognition.png" alt="Facial recognition page" width="260"/><img src="docs/img/app-live-recognition.png" alt="Live facial recognition labeling a face" width="260"/>
