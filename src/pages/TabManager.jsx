import { useEffect } from "react"; // standard react to edit elements etc
import { Redirect, Route } from "react-router-dom";
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import {
  gridSharp,
  alarmSharp,
  settingsSharp,
} from "ionicons/icons";
import Tab1 from "./Tab1";
import Tab2 from "./Tab2";
import Tab3 from "./Tab3";
import { Geolocation } from "@ionic-native/geolocation";
import { db_set, db_get } from "../componets/storage";
import {
  send_geolocation,
  to_object,
} from "../componets/data";

const TabManager = () => {
  const geolocation_updater = async () => {
    const tablet_mode = await db_get("tablet_mode");
    const family_mode = await db_get("family_mode");

    if (tablet_mode || family_mode) return; // if family mode or tablet mode are enabled, it shouldn't track you at all

    // get current location from geolocation plugin
    const response = await Geolocation.getCurrentPosition();

    db_set("geolocation", to_object(response));

    // convert it to an obj and send to server
    await send_geolocation(to_object(response), false);
    //console.log(response);
  };

  useEffect(() => {
    setInterval(() => {
      geolocation_updater();
    }, 10000);
  }, []);

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
