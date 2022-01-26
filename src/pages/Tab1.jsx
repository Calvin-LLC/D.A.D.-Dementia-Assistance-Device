import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonCard,
  IonCardContent,
  IonItemSliding,
  IonImg,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";
import axios from "axios";

import { useState, useEffect, useRef } from "react";
import {
  data_recieve,
  get_current_screen,
  save_screen,
  http_get,
} from "./data";
import { Geolocation } from "@ionic-native/geolocation";
import "./Tab1.css";

const Tab1 = () => {
  const mounted_prop = useRef(true); // Initial value _isMounted = true

  useEffect(() => {
    return () => {
      // ComponentWillUnmount in Class Component
      mounted_prop.current = false;
    };
  }, []);

  // states
  const [cols, setCols] = useState([]);

  var old_obj = new Array();
  var parsed_data = new Array();

  const [weather_data, set_weather_data] = useState();

  var weather_url =
    "http://api.weatherapi.com/v1/current.json?key=7640a167775a47be9a842820212111&q=";

  const get_location = () => {
    return Geolocation.getCurrentPosition().then((response) => {
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
    get_location().then((url) => {
      http_get(url).then((response) => {
        var weather_obj = JSON.parse(JSON.stringify(response));
        //while (!mounted_prop.current) {}
        set_weather_data(weather_obj);
      });
    });
  };

  const store_data = () => {
    data_recieve()
      .then((response) => {
        var len = response.data.length;
        if (response.data == old_obj) len = 0;
        else if (mounted_prop.current) setCols([]);
        for (var i = 0; i < len; ++i) {
          switch (response.data[i].type) {
            case "door":
              parsed_data[i] =
                "The door is " + (response.data[i].value ? "Opened" : "Closed");
              break;
            case "temp":
              parsed_data[i] =
                "Kitchen Temperature: " + response.data[i].value + "℉";
              break;
            case "oven":
              parsed_data[i] = "Oven Power: " + response.data[i].value;
              break;
            default:
              parsed_data[i] =
                response.data[i].type + ": " + response.data[i].value;
              break;
          }
          if (mounted_prop.current)
            setCols((cols) => [...cols, parsed_data[i]]);
        }
        old_obj = response.data;
      })
      .catch((err) => {
        console.log("caught error: " + err);
      });
  };

  var weather_isupdated = false;
  useEffect(() => {
    setInterval(() => {
      if (!mounted_prop.current) return;
      store_data();
      if (!weather_isupdated) {
        update_weather();
        weather_isupdated = true;
      }
    }, 2000);
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonGrid>
          {weather_data && (
            <IonRow>
              <IonCol>
                <IonCard>
                  <IonCardHeader>
                    <IonCardHeader>
                      <IonCardTitle>
                        {weather_data.location.name +
                          ", " +
                          weather_data.location.region}
                      </IonCardTitle>
                    </IonCardHeader>
                  </IonCardHeader>
                  <IonCardContent>
                    <h2>
                      {"Condition: " + weather_data.current.condition.text}
                      <br />
                      {"Current Temp: " + weather_data.current.temp_f + "℉"}
                      <br />
                      {"Feels Like: " + weather_data.current.feelslike_f + "℉"}
                    </h2>
                    <IonImg
                      className="weather-img"
                      src={weather_data.current.condition.icon}
                      alt=""
                    />
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          )}
          <IonRow>
            {cols.map((col, i) => (
              <IonCol size="6" key={i + 1}>
                <IonCard key={i + 1}>
                  <IonCardContent key={i + 1}>{col}</IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
