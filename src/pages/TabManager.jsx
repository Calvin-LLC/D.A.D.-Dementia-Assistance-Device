import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  gridSharp,
  alarmSharp,
  settingsSharp,
  logInOutline,
} from "ionicons/icons";
import Tab1 from "./Tab1";
import Tab2 from "./Tab2";
import Tab3 from "./Tab3";

import { save_screen, get_current_screen } from "./data";

const TabManager = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tab1" render={() => <Tab1/>} />
        <Route exact path="/tab2" render={() => <Tab2/>} />
        <Route exact path="/tab3" render={() => <Tab3/>} />
        <Redirect exact from="/" to="/tab1" />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/tab1">
          <IonIcon icon={gridSharp} />
          <IonLabel>Dashboard</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/tab2">
          <IonIcon icon={alarmSharp} />
          <IonLabel>Reminders</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/tab3">
          <IonIcon icon={settingsSharp} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default TabManager;
