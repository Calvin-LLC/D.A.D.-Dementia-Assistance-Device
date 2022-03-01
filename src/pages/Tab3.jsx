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
  const [kitchen_timer, set_kitchen_timer] = useState();
  const [kitchen_input, set_kitchen_input] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [kitchen_select, set_kitchen_select] = useState(0);
  const [recognition, set_recognition] = useState(false);

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

  // update kitchen object
  const update_kitchen = async () => {
    const kitchen_value = await data_recieve();
    if (!kitchen_value) return;

    const parsed_kitchen = kitchen_value.time_string;
    if (!parsed_kitchen) return;

    set_kitchen_timer(parsed_kitchen);
  };

  // add to kitchen object
  const add_kitchen = async (type) => {
    var old_obj = kitchen_input;
    old_obj[type] = kitchen_select;
    set_kitchen_input(old_obj);
  };

  // send kitchen obj
  const send_kitchen = async () => {
    kitchen_data_add(kitchen_input);
    console.log(kitchen_input);
    set_kitchen_input({ hours: 0, minutes: 0, seconds: 0 });
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
            <IonButton id="picture_button" onClick={() => take_picture()}>
              Take a picture
            </IonButton>
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
                  <IonTitle>Kitchen Info</IonTitle>
                </IonToolbar>
              </IonHeader>
              <IonGrid>
                <IonRow>
                  <IonCol>
                    {kitchen_timer && (
                      <IonCard>
                        <IonCardContent color="dark">
                          {kitchen_timer}
                        </IonCardContent>
                      </IonCard>
                    )}
                  </IonCol>
                  <IonCol>
                    <IonCard>
                      <IonCardContent>
                        {kitchen_input &&
                          "H: " +
                            kitchen_input.hours +
                            " M: " +
                            kitchen_input.minutes +
                            " S: " +
                            kitchen_input.seconds}
                        <IonSelect
                          value={kitchen_select}
                          placeholder="Select One"
                          onIonChange={(e) =>
                            set_kitchen_select(e.detail.value)
                          }
                        >
                          <IonSelectOption value={0}>0</IonSelectOption>
                          <IonSelectOption value={1}>1</IonSelectOption>
                          <IonSelectOption value={5}>5</IonSelectOption>
                          <IonSelectOption value={10}>10</IonSelectOption>
                          <IonSelectOption value={15}>15</IonSelectOption>
                          <IonSelectOption value={20}>20</IonSelectOption>
                          <IonSelectOption value={25}>25</IonSelectOption>
                          <IonSelectOption value={30}>30</IonSelectOption>
                          <IonSelectOption value={35}>35</IonSelectOption>
                          <IonSelectOption value={40}>40</IonSelectOption>
                          <IonSelectOption value={45}>45</IonSelectOption>
                          <IonSelectOption value={50}>50</IonSelectOption>
                          <IonSelectOption value={55}>55</IonSelectOption>
                          <IonSelectOption value={60}>60</IonSelectOption>
                        </IonSelect>
                        <IonButton
                          onClick={() => {
                            add_kitchen("hours");
                          }}
                        >
                          Add as hours
                        </IonButton>
                        <IonButton
                          onClick={() => {
                            add_kitchen("minutes");
                          }}
                        >
                          Add as minutes
                        </IonButton>
                        <IonButton
                          onClick={() => {
                            add_kitchen("seconds");
                          }}
                        >
                          Add as seconds
                        </IonButton>
                        <IonButton
                          onClick={() => {
                            send_kitchen();
                          }}
                        >
                          Send the time!
                        </IonButton>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
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
