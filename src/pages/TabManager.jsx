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
import { IonReactRouter } from '@ionic/react-router';
import {
  gridSharp,
  alarmSharp,
  settingsSharp,
  logInOutline,
} from "ionicons/icons";
import Tab1 from "./Tab1";
import Tab2 from "./Tab2";
import Tab3 from "./Tab3";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./../theme/variables.css";

import { save_screen, get_current_screen } from "./data";

const TabManager = () => {
  return (
    <IonApp>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/tab1" component={Tab1} exact={true} />
          <Route path="/tab2" component={Tab2} exact={true} />
          <Route path="/tab3" component={Tab3} exact={true} />

          <Route
            exact
            path="/TabManager"
            render={() => <Redirect to="/tab1" />}
          />
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/tab1">
            <IonIcon icon={gridSharp} />
            <IonLabel>Dashboard</IonLabel>
            <Redirect to="/tab1" />
          </IonTabButton>
          <IonTabButton tab="tab2" href="/tab2">
            <IonIcon icon={alarmSharp} />
            <IonLabel>Reminders</IonLabel>
            <Redirect to="/tab2" />
          </IonTabButton>
          <IonTabButton tab="tab3" href="/tab3">
            <IonIcon icon={settingsSharp} />
            <IonLabel>Settings</IonLabel>
            <Redirect to="/tab3" />
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonApp>
  );
};

export default TabManager;
