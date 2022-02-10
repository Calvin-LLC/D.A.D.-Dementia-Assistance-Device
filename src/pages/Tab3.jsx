import {
  IonContent,
  IonItemDivider,
  IonPage,
  IonToast,
  IonList,
  IonItem,
  IonRow,
  IonCol,
  IonInput,
  IonButton,
  IonGrid,
  IonCard,
  IonCardContent,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonLabel,
  IonFabButton,
  IonFab,
} from "@ionic/react";
import "./Tab3.css";
import { useEffect, useRef, useState } from "react";
import {
  get_reminder_contact,
  send_reminder_contact,
  remove_reminder_contact,
  get_geolocation,
  send_geolocation,
  to_object,
  send_picture,
} from "../componets/data";
import { db_set, db_get } from "../componets/storage";
import { Geolocation } from "@ionic-native/geolocation";
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from "@capacitor/camera";
import { usePhotoGallery, base64FromPath } from "../componets/camera";

const Tab3 = () => {
  const { takePhoto } = usePhotoGallery();
  const mounted_prop = useRef(true);

  useEffect(() => {
    return () => {
      mounted_prop.current = false;
    };
  }, []);

  const reminder_data = useRef(null);

  // states
  const [cols, setCols] = useState([]);
  const [toast_data, set_toast_data] = useState();
  const [toast_data2, set_toast_data2] = useState();

  var old_obj = new Array();
  var parsed_data = new Array();

  const take_picture = async () => {
    Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    }).then((cameraPhoto) => {
      console.log("prepreboobs");
      const base64 = await base64FromPath(cameraPhoto.webPath);
      console.log("preboobs");
      const ret = await send_picture(base64);
      console.log("postboobs: " + ret);
    });
  };

  const add_reminder_person = () => {
    var reminder_info = reminder_data.current.value;

    if (!reminder_info) {
      set_toast_data2(true);
      return;
    }

    send_reminder_contact(reminder_info).then((response) => {
      set_toast_data(true);
      reminder_data.current.value = "";
    });
  };

  const store_data = () => {
    get_reminder_contact()
      .then((res) => {
        var response = res.data;
        var len = response.length;
        if (response == old_obj) len = 0;
        else if (mounted_prop.current) setCols([]);
        for (var i = 0; i < len; ++i) {
          parsed_data[i] = "~ " + response[i].contact;
          if (mounted_prop.current)
            setCols((cols) => [...cols, parsed_data[i]]);
        }
        old_obj = response;
        db_set("contact_obj", parsed_data);
      })
      .catch((err) => {
        console.log("caught error: " + err);
      });
  };

  const [current_location, set_current_location] = useState();
  const set_location = async () => {
    // get current location from geolocation plugin
    const coords = await Geolocation.getCurrentPosition();

    // convert it to an obj and send to server
    await send_geolocation(to_object(coords), true);

    var response = await get_geolocation();
    console.log(response);
    set_current_location(response);
  };

  useEffect(() => {
    setInterval(() => {
      if (!mounted_prop.current) return;
      store_data();
    }, 2000);
  }, []);

  useEffect(() => {
    db_get("contact_obj").then((response) => {
      if (response) setCols(response);
    });
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonToast
          isOpen={toast_data}
          onDidDismiss={() => set_toast_data(false)}
          message="Successfully added a contact to the notification list"
          duration={1500}
        />
        <IonToast
          isOpen={toast_data2}
          onDidDismiss={() => set_toast_data2(false)}
          message="Please fill in the input field"
          duration={1500}
        />

        <IonHeader>
          <IonToolbar color="primary" className="title-th">
            <IonTitle>Contacts</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          {cols.map((col, i) => (
            <IonItem lines="inset" key={i + 1}>
              <IonTitle key={i + 1}>{col}</IonTitle>
              <IonButton
                slot="end"
                onClick={() => {
                  remove_reminder_contact(i);
                }}
              >
                X
              </IonButton>
            </IonItem>
          ))}
          <IonItem>
            <IonInput
              ref={reminder_data}
              placeholder="Reminder Email / Phone"
            />
            <IonButton onClick={add_reminder_person}>Add Contact</IonButton>
          </IonItem>

          {current_location && (
            <IonItem>
              <div>
                {"Lat: " +
                  current_location.home.latitude +
                  ", Long: " +
                  current_location.home.longitude +
                  ", accuracy: " +
                  current_location.home.accuracy}
              </div>
            </IonItem>
          )}
          <IonItem>
            <IonButton onClick={set_location}>
              Set Current Location as home
            </IonButton>
          </IonItem>
          <IonItem>
            <IonButton onClick={() => take_picture()}>Take a picture</IonButton>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
