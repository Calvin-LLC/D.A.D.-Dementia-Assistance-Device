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
  IonModal,
  IonButton,
  IonItem,
  IonLabel,
  IonDatetime,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonIcon,
  IonList,
  IonButtons,
  IonBackButton,
} from "@ionic/react";

import { useState, useEffect, useRef } from "react";
import {
  data_recieve,
  send_geolocation,
  http_get,
  to_object,
  get_geolocation,
  wander_data_add,
  barcode_add,
} from "../componets/data";
import { Geolocation } from "@ionic-native/geolocation";
import "./Tab1.css";
import { db_get, db_set } from "../componets/storage";
import { BarcodeScanner } from "@awesome-cordova-plugins/barcode-scanner";
import { barcodeOutline, closeOutline, settingsOutline } from "ionicons/icons";

import { Map } from "../componets/maps";

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
  const [pill_modal, set_pill_modal] = useState(false);
  const [bathtub_modal, set_bathtub_modal] = useState(false);

  const [barcode, set_barcode] = useState("Barcode: ");

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
        if (response.data == old_obj) return;
        parsed_data = [];

        for (var i = 0; i < len; ++i) {
          parsed_data.push({ header: "", body: "" });
          switch (response.data[i].type) {
            case "door":
              parsed_data[i].header = response.data[i].type;
              parsed_data[i].body = response.data[i].value
                ? "Opened"
                : "Closed";
              break;
            case "temp":
              parsed_data[i].header = response.data[i].type;
              parsed_data[i].body = response.data[i].value + "℉";
              break;
            case "oven":
              parsed_data[i].header = response.data[i].type;
              parsed_data[i].body = Math.round(response.data[i].value) + "℉";
              break;
            case "pill":
              parsed_data[i].header = response.data[i].type;
              parsed_data[i].body = response.data[i].value;
              break;
            case "bathtub":
              parsed_data[i].header = response.data[i].type;
              parsed_data[i].body = response.data[i].value;
              break;
            default:
              parsed_data[i].header = response.data[i].type;
              parsed_data[i].body = response.data[i].value;
              break;
          }
          //if (mounted_prop.current) setCols((cols) => [...cols, parsed_data[i]]);

          if (parsed_data[i].header == "" && parsed_data[i].body)
            parsed_data.pop();
        }
        if (old_obj != response.data) setCols(parsed_data);

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

  const scan_barcode = async () => {
    const barcode_data = await BarcodeScanner.scan();
    console.log(barcode_data.text);
    set_barcode("barcode: " + barcode_data.text);
    barcode_add({barcode: barcode_data.text});
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
        <IonGrid className="centerandresize">
          {/*<IonButton id="pill-trigger">Butt</IonButton>*/}

          <IonModal
            isOpen={pill_modal}
            backdropDismiss={true}
            animated={true}
            swipeToClose={true}
          >
            <IonHeader>
              <IonToolbar color="primary" className="title-th">
                <center>
                  <IonTitle>Pill Dispenser</IonTitle>
                </center>
                <IonButtons slot="end">
                  <IonButton
                    onClick={() => {
                      set_pill_modal(false);
                    }}
                  >
                    <IonIcon icon={closeOutline}></IonIcon>
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>

            <IonList>
              <IonItem>
                <IonText>{barcode}</IonText>
              </IonItem>
              <IonItem>
                <IonLabel>Barcode Scanner</IonLabel>
                <IonButton
                  onClick={() => {
                    scan_barcode();
                  }}
                >
                  <IonIcon
                    slot="icon-only"
                    size="small"
                    icon={barcodeOutline}
                  />
                </IonButton>
              </IonItem>
            </IonList>
          </IonModal>

          <IonModal
            backdropDismiss={true}
            animated={true}
            swipeToClose={true}
            isOpen={bathtub_modal}
          >
            <IonHeader>
              <IonToolbar color="primary" className="title-th">
                <center>
                  <IonTitle>Bathtub</IonTitle>
                </center>
                <IonButtons slot="end">
                  <IonButton
                    onClick={() => {
                      set_bathtub_modal(false);
                    }}
                  >
                    <IonIcon icon={closeOutline}></IonIcon>
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>

            <IonList></IonList>
          </IonModal>

          {weather_data && (
            <IonRow>
              <IonCol>
                <IonCard className="modd">
                  <IonCardHeader>
                    <IonCardHeader>
                      <IonCardTitle color="dark">
                        {weather_data.location.name +
                          ", " +
                          weather_data.location.region}
                      </IonCardTitle>
                    </IonCardHeader>
                  </IonCardHeader>

                  <IonCardContent className="weathergrid">
                    <IonText color="dark">
                      {"Condition: " + weather_data.current.condition.text}
                      <br />
                      {"Current Temp: " + weather_data.current.temp_f + "℉"}
                      <br />
                      {"Feels Like: " + weather_data.current.feelslike_f + "℉"}
                    </IonText>
                    <IonImg
                      className="weather-img weathergriditem"
                      src={"https://" + weather_data.current.condition.icon}
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
                    <IonCardContent className="grid">
                      <h3>
                        <b>
                          {"lat: " + tracker.latitude} <br />
                          {"long: " + tracker.longitude}
                        </b>
                      </h3>  
                    </IonCardContent>
                    <Map />
                    {/*<IonImg src="https://ziadabdelati.com/google_maps.png"></IonImg>*/}
                  </IonCardHeader>
                </IonCard>
              </IonCol>
            </IonRow>
          )}

          <IonRow>
            {cols.map((col, i) => (
              <IonCol size="6" key={"col" + i + 1}>
                {col.header && (
                  <IonCard className="modd" key={"card" + i + 1}>
                    <IonCardHeader
                      className="connected modgrid"
                      color="dark"
                      key={col.header + "header" + i + 1}
                    >
                      {col.header}
                      {col.header == "pill" && (
                        <IonButton
                          onClick={() => {
                            set_pill_modal(true);
                          }}
                        >
                          <IonIcon
                            slot="icon-only"
                            size="small"
                            icon={settingsOutline}
                          />
                        </IonButton>
                      )}

                      {col.header == "bathtub" && (
                        <IonButton
                          onClick={() => {
                            set_bathtub_modal(true);
                          }}
                        >
                          <IonIcon
                            slot="icon-only"
                            size="small"
                            icon={settingsOutline}
                          />
                        </IonButton>
                      )}
                    </IonCardHeader>

                    <IonCardContent
                      className="bigone modgrid"
                      color="dark"
                      key={col.body + "body" + i + 1}
                    >
                      {col.body}
                    </IonCardContent>
                  </IonCard>
                )}
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
