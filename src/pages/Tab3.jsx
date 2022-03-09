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
  IonModal,
  IonIcon,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonAlert,
  IonText,
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
  data_recieve,
  kitchen_data_add,
} from "../componets/data";
import { db_set, db_get } from "../componets/storage";
import { Geolocation } from "@ionic-native/geolocation";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { base64FromPath } from "../componets/camera";
import { fastFoodOutline } from "ionicons/icons";
import { closeOutline, cameraOutline, addOutline } from "ionicons/icons";

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
  const [recognition, set_recognition] = useState(false);

  const [kitchen_buttons, set_kitchen_buttons] = useState([
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "+",
    "0",
    "-",
  ]);
  const [kitchen_text, set_kitchen_text] = useState("00:00:00");
  const [current_kitchen_text, set_current_kitchen_text] = useState("00:00:00");

  const kitchen_button = (button) => {
    var minimal_kitchen_text = kitchen_text.replace(/:/g, "");
    var new_text;
    if (button === "-")
      new_text =
        0 + minimal_kitchen_text.substring(0, minimal_kitchen_text - 1);
    else if (button === "+") {
      kitchen_data_add({
        hours: 1 * minimal_kitchen_text.substring(0, 2),
        minutes: 1 * minimal_kitchen_text.substring(2, 4),
        seconds: 1 * minimal_kitchen_text.substring(4, 6),
      });
      console.log("sent");
      return;
    } else new_text = minimal_kitchen_text.substring(1) + button;
    new_text =
      new_text.substring(0, 2) +
      ":" +
      new_text.substring(2, 4) +
      ":" +
      new_text.substring(4, 6);
    set_kitchen_text(new_text);
  };

  const update_kitchen = async () => {
    const kitchen_value = await data_recieve();
    if (!kitchen_value) return;

    const parsed_kitchen = kitchen_value.time_string;
    if (!parsed_kitchen) return;

    set_current_kitchen_text(parsed_kitchen);
  };

  var old_obj = new Array();
  var parsed_data = new Array();

  // take a picture......
  const take_picture = async () => {
    const cameraPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });
    let base64 = await base64FromPath(cameraPhoto.webPath);
    send_picture(base64);
    set_recognition(true);
  };

  // add reminder contact information
  const add_reminder_person = () => {
    var reminder_info = reminder_data.current.value;

    if (!reminder_info) {
      set_toast_data2(true);
      return;
    }

    send_reminder_contact(reminder_info, phone_carrier, contact_info).then(
      (response) => {
        set_toast_data(true);
        reminder_data.current.value = "";
      }
    );
  };

  // store contact data
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

  // saves location and sends it to server, as home mode
  const set_location = async () => {
    // get current location from geolocation plugin
    const coords = await Geolocation.getCurrentPosition();

    // convert it to an obj and send to server
    await send_geolocation(to_object(coords), true);

    var response = await get_geolocation();
    console.log(response);
    set_current_location(response);
  };

  // checks if we are on family mode
  const family_manager = async () => {
    set_family_mode(!family_mode);
    db_set("family_mode", !family_mode);
  };

  // checks if we are on tablet mode
  const tablet_manager = async () => {
    set_tablet_mode(!tablet_mode);
    db_set("tablet_mode", !tablet_mode);
  };

  // checks to see if we are mounted in the render thread
  useEffect(() => {
    setInterval(() => {
      if (!mounted_prop.current) return;
      store_data();
      update_kitchen();
    }, 1000);
  }, []);

  // caching for all our obj'z
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
    update_kitchen(); // update kitchen once
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

        <IonAlert
          isOpen={recognition}
          onDidDismiss={() => set_recognition(false)}
          cssClass="my-custom-class"
          header={"Douglas"}
          message={"Your grandson,<br>97% confidence"}
          buttons={[
            {
              text: "",
              role: "cancel",
              cssClass: "secondary",
              id: "cancel-button",
              handler: (blah) => {
                console.log("Confirm Cancel: blah");
              },
            },
            {
              text: "Continue",
              id: "confirm-button",
              handler: () => {
                console.log("Confirm Okay");
              },
            },
          ]}
        />

        <IonHeader>
          <IonToolbar color="primary" className="title-th">
            <center>
              <IonTitle>Contacts</IonTitle>
            </center>
          </IonToolbar>
        </IonHeader>

        <IonList>
          {cols.map((col, i) => (
            <IonItem lines="inset" key={i + 1}>
              <IonTitle key={i + 1}>{col}</IonTitle>
              <IonButton
                size="small"
                fill="outline"
                onClick={() => {
                  remove_reminder_contact(i);
                }}
              >
                <IonIcon icon={closeOutline}></IonIcon>
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
              <IonSelectOption value={"caretaker"}>
                {"family member"}
              </IonSelectOption>
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
              <IonSelectOption value={"boost mobile"}>
                {"Boost mobile"}
              </IonSelectOption>
              <IonSelectOption value={"cricket"}>{"Cricket"}</IonSelectOption>
              <IonSelectOption value={"metro pcs"}>
                {"Metro Pcs"}
              </IonSelectOption>
              <IonSelectOption value={"tracfone"}>{"Tracfone"}</IonSelectOption>
              <IonSelectOption value={"u.s. cellular"}>
                {"U.S Cellular"}
              </IonSelectOption>
              <IonSelectOption value={"virgin mobile"}>
                {"Virgin Mobile"}
              </IonSelectOption>
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
          <IonItem>
            <IonLabel>Image Recognition</IonLabel>
            <IonButton id="picture_button" onClick={() => take_picture()}>
              <IonIcon icon={cameraOutline}></IonIcon>
            </IonButton>
          </IonItem>
          <IonItem>
            <IonLabel>Kitchen Page</IonLabel>
            <IonButton id="kitchen-trigger">
              <IonIcon slot="icon-only" size="small" icon={fastFoodOutline} />
            </IonButton>
            <IonModal
              backdropDismiss={true}
              animated={true}
              swipeToClose={true}
              trigger="kitchen-trigger"
            >
              <IonHeader>
                <IonToolbar color="primary" className="title-th">
                  <center>
                    <IonTitle>Kitchen Info</IonTitle>
                  </center>
                </IonToolbar>
              </IonHeader>

              <IonList>
                <IonItem>
                  <IonText slot="start">{kitchen_text}</IonText>
                  <IonText slot="end">{current_kitchen_text}</IonText>
                </IonItem>
              </IonList>
              <IonGrid>
                <IonRow>
                  {kitchen_buttons.map((current, i) => (
                    <IonCol size="4" key={"kitchen_col" + i}>
                      <IonButton
                        strong={true}
                        shape="round"
                        className="kitchen-button"
                        key={"kitchen_button" + i}
                        onClick={() => kitchen_button(current)}
                      >
                        {current}
                      </IonButton>
                    </IonCol>
                  ))}
                </IonRow>
              </IonGrid>
            </IonModal>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
