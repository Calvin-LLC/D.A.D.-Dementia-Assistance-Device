import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import axios from "axios";
import { useState } from "react";
import ExploreContainer from "../components/ExploreContainer";
import { Geolocation, Geoposition } from "@ionic-native/geolocation";
import "./Tab2.css";

const Tab2: React.FC = () => {
  // states
  const [weather_data, set_weather_data] = useState<string>();

  // data variables
  var grid_order = [];
  var grid_type = [];
  var grid_number: number = 10;

  const http_get = (URL: string) => {
    return axios({
      url: URL,
    }).then((response) => {
      return response.data;
    });
  };

  var weather_url =
    "http://api.weatherapi.com/v1/current.json?key=7640a167775a47be9a842820212111&q=";

  const get_location = () => {
    return Geolocation.getCurrentPosition().then((response: Geoposition) => {
      return (
        weather_url +
        response.coords.longitude +
        "," +
        response.coords.latitude +
        "&aqi=no"
      );
    });
  };

  const update_weather = () => {
    get_location().then((url: string) => {
      console.log(url);
      http_get(url).then((response: any) => {
        var weather_obj = JSON.parse(JSON.stringify(response));
        console.log(weather_obj);
        set_weather_data(weather_obj.current.condition.text);
      });
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Tab 2 page" />
        <IonButton onClick={update_weather}>Update Weather Widget!</IonButton>
        <IonGrid>
          <IonRow>
          <div>
            {Array(grid_number)
              .fill(grid_number)
              .map((_, i) => (
                <div>
                  <IonCol>
                    <IonCard>
                      <IonCardHeader>{weather_data}</IonCardHeader>
                    </IonCard>
                  </IonCol>
                </div>
              ))}
          </div>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardHeader>{weather_data}</IonCardHeader>
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard>
                <IonCardHeader>Hallo</IonCardHeader>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardHeader>Hallo</IonCardHeader>
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard>
                <IonCardHeader>Hallo</IonCardHeader>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardHeader>Hallo</IonCardHeader>
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard>
                <IonCardHeader>Hallo</IonCardHeader>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
