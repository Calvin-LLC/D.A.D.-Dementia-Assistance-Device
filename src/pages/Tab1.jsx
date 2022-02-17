import {
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  IonCard,
  IonCardContent,
  IonImg,
  IonCardHeader,
  IonCardTitle,
  IonText,
} from "@ionic/react";

import { useState, useEffect, useRef } from "react";
import {
  data_recieve,
  send_geolocation,
  http_get,
  to_object,
  get_geolocation,
} from "../componets/data";
import { Geolocation } from "@ionic-native/geolocation";
import "./Tab1.css";
import { db_get, db_set } from "../componets/storage";
import { location } from "ionicons/icons";

const Tab1 = () => {
  const mounted_prop = useRef(true); // Initial value _isMounted = true

  useEffect(() => {
    return () => {
      mounted_prop.current = false;
    };
  }, []);

  // states
  const [cols, setCols] = useState([]);

  var old_obj = new Array();
  var parsed_data = new Array();

  const [tracker, set_tracker] = useState();
  const [weather_data, set_weather_data] = useState();

  var weather_url =
    "https://api.weatherapi.com/v1/current.json?key=7640a167775a47be9a842820212111&q=";

  const get_location = async () => {
    // get current location from geolocation plugin
    const response = await Geolocation.getCurrentPosition();

    // convert it to an obj and send to server
    await send_geolocation(to_object(response));

    return (
      weather_url +
      response.coords.latitude +
      "," +
      response.coords.longitude +
      "&aqi=no"
    );
  };

  const update_weather = async () => {
    const url = await get_location();
    const response = await http_get(url);

    var weather_obj = JSON.parse(JSON.stringify(response));
    db_set("weather_obj", weather_obj);
    set_weather_data(weather_obj);
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
        db_set("dashboard_obj", parsed_data);
        old_obj = response.data;
      })
      .catch((err) => {
        console.log("caught error: " + err);
      });
  };

  const tracker_update = async () => {
    const location_obj = await get_geolocation();
    if (!location_obj) return;
    db_set("location_obj", location_obj.current);
    set_tracker(location_obj.current);
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
      tracker_update();
    }, 2000);
  }, []);

  useEffect(() => {
    db_get("weather_obj").then((response) => {
      if (response) set_weather_data(response);
    });
    db_get("location_obj").then((r) => {
      if (r) set_tracker(r);
    });
    db_get("dashboard_obj").then((res) => {
      if (res) setCols(res);
    });
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
                      <IonCardTitle color="dark">
                        {weather_data.location.name +
                          ", " +
                          weather_data.location.region}
                      </IonCardTitle>
                    </IonCardHeader>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonText color="dark">
                      {"Condition: " + weather_data.current.condition.text}
                      <br />
                      {"Current Temp: " + weather_data.current.temp_f + "℉"}
                      <br />
                      {"Feels Like: " + weather_data.current.feelslike_f + "℉"}
                    </IonText>
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
          {tracker && (
            <IonRow>
              <IonCol>
                <IonCard>
                  <IonCardHeader>
                    <IonCardContent>
                      {"latitude: " + tracker.latitude}
                    </IonCardContent>
                    <IonCardContent>
                      {"\nlongitude: " + tracker.longitude}
                    </IonCardContent>
                  </IonCardHeader>
                </IonCard>
              </IonCol>
            </IonRow>
          )}
          <IonRow>
            {cols.map((col, i) => (
              <IonCol size="6" key={i + 1}>
                <IonCard key={i + 1}>
                  <IonCardContent color="dark" key={i + 1}>
                    {col}
                  </IonCardContent>
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
