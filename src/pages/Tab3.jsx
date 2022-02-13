import {
  IonContent,
  IonPage,
  IonToast,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonLabel,
  IonCheckbox,
  IonSelect,
  IonSelectOption,
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
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { base64FromPath } from "../componets/camera";

// for contact system, give option for user & family member
// carrier dropdown, it's in e_message.py

const Tab3 = () => {
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
  const [contact_info, set_contact_info] = useState(0);
  const [family_mode, set_family_mode] = useState(false);
  const [tablet_mode, set_tablet_mode] = useState(false);
  const [phone_carrier, set_phone_carrier] = useState(0);
  const [current_location, set_current_location] = useState();

  var old_obj = new Array();
  var parsed_data = new Array();

  const take_picture = async () => {
    const cameraPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });
    let base64 = await base64FromPath(cameraPhoto.webPath);
    send_picture(base64);
  };

  const add_reminder_person = () => {
    var reminder_info = reminder_data.current.value;

    if (!reminder_info) {
      set_toast_data2(true);
      return;
    }

    send_reminder_contact(reminder_info, phone_carrier, contact_info).then((response) => {
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

  const set_location = async () => {
    // get current location from geolocation plugin
    const coords = await Geolocation.getCurrentPosition();

    // convert it to an obj and send to server
    await send_geolocation(to_object(coords), true);

    var response = await get_geolocation();
    console.log(response);
    set_current_location(response);
  };

  const family_manager = async () => {
    set_family_mode(!family_mode);
    db_set("family_mode", !family_mode);
  };

  const tablet_manager = async () => {
    set_tablet_mode(!tablet_mode);
    db_set("tablet_mode", !tablet_mode);
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
    db_get("family_mode").then((response) => {
      if (response != null) set_family_mode(response);
    });
    db_get("tablet_mode").then((response) => {
      if (response != null) set_tablet_mode(response);
    });
    console.log("updated objs");
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
            <IonSelect
              value={contact_info}
              placeholder="Type of person"
              onIonChange={(e) => set_contact_info(e.detail.value)}
            >
              <IonSelectOption value={"user"}>{"user"}</IonSelectOption>
              <IonSelectOption value={"caretaker"}>{"family member"}</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonSelect
              value={phone_carrier}
              placeholder="Service Provider"
              onIonChange={(e) => set_phone_carrier(e.detail.value)}
            >
              <IonSelectOption value={"at&t"}>{"At&t"}</IonSelectOption>
              <IonSelectOption value={"sprint"}>{"Sprint"}</IonSelectOption>
              <IonSelectOption value={"t-mobile"}>{"T-mobile"}</IonSelectOption>
              <IonSelectOption value={"verizon"}>{"Verizon"}</IonSelectOption>
              <IonSelectOption value={"boost mobile"}>{"Boost mobile"}</IonSelectOption>
              <IonSelectOption value={"cricket"}>{"Cricket"}</IonSelectOption>
              <IonSelectOption value={"metro pcs"}>{"Metro Pcs"}</IonSelectOption>
              <IonSelectOption value={"tracfone"}>{"Tracfone"}</IonSelectOption>
              <IonSelectOption value={"u.s. cellular"}>{"U.S Cellular"}</IonSelectOption>
              <IonSelectOption value={"virgin mobile"}>{"Virgin Mobile"}</IonSelectOption>
            </IonSelect>
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
          {family_mode && (
            <IonItem>
              <IonButton onClick={set_location}>
                Set Current Location as home
              </IonButton>
            </IonItem>
          )}
          <IonItem>
            <IonButton onClick={() => take_picture()}>Take a picture</IonButton>
          </IonItem>
          <IonItem>
            <IonLabel>Family Mode</IonLabel>
            <IonCheckbox
              checked={family_mode}
              onIonChange={family_manager}
            ></IonCheckbox>
          </IonItem>
          <IonItem>
            <IonLabel>Tablet Mode</IonLabel>
            <IonCheckbox
              checked={tablet_mode}
              onIonChange={tablet_manager}
            ></IonCheckbox>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
