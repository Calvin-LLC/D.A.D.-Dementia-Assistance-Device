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
  IonDatetime,
  IonButtons,
  IonItemDivider,
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
  bonus_time_add,
  wander_data_add,
  add_facial_recognition_data,
  set_notification,
} from "../componets/data";
import { db_set, db_get } from "../componets/storage";
import { Geolocation } from "@ionic-native/geolocation";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { base64FromPath } from "../componets/camera";
import {
  callOutline,
  fastFoodOutline,
  imagesOutline,
  peopleOutline,
  settingsOutline,
} from "ionicons/icons";
import { closeOutline, cameraOutline } from "ionicons/icons";
import { InAppBrowser } from "@ionic-native/in-app-browser";

const Tab3 = () => {
  const mounted_prop = useRef(true);

  useEffect(() => {
    return () => {
      mounted_prop.current = false;
    };
  }, []);

  const reminder_data = useRef(null);
  const name = useRef(null);
  const description = useRef(null);

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
  const [wander_start_time, set_wander_start_time] = useState();
  const [wander_end_time, set_wander_end_time] = useState();
  const [kitchen_trigger, set_kitchen_trigger] = useState(false);
  const [family_trigger, set_family_trigger] = useState(false);
  const [contact_trigger, set_contact_trigger] = useState(false);
  const [recognition_trigger, set_recognition_trigger] = useState(false);
  const [recognition_options, set_recognition_options] = useState(false);
  const [notification_type, set_notification_type] = useState(0);

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
    try {
      var minimal_kitchen_text = kitchen_text.replace(/:/g, "");
      var new_text;
      if (button === "-") {
        if (minimal_kitchen_text.length == 6 && minimal_kitchen_text * 1 > 0)
          new_text =
            0 + minimal_kitchen_text.substring(0, minimal_kitchen_text - 1);
      } else if (button === "+") {
        kitchen_data_add({
          hours: 1 * minimal_kitchen_text.substring(0, 2),
          minutes: 1 * minimal_kitchen_text.substring(2, 4),
          seconds: 1 * minimal_kitchen_text.substring(4, 6),
          bonus: 0,
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
    } catch (e) {
      // nothing :trollface:
    }
  };

  const bonus_button = async () => {
    await bonus_time_add({ bonus: 60 });
    console.log("sent");
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
  var current_picture;

  // take a picture......
  const take_picture = async () => {
    const cameraPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });
    let base64 = await base64FromPath(cameraPhoto.webPath);
    current_picture = base64;
  };

  // add person to recognized people list
  const send_recognition = async () => {
    var person_name = name.current.value;
    var person_description = description.current.value;

    if (!person_name || !person_description || !current_picture) {
      // error handling
      return;
    }

    await add_facial_recognition_data({
      name: person_name,
      description: person_description,
      image: current_picture,
    });
    console.log("added facial recognition data!");
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
        if (response == old_obj) return;
        parsed_data = [];
        for (var i = 0; i < len; ++i) {
          parsed_data[i] = "~ " + response[i].contact;
        }
        if (mounted_prop.current) setCols(parsed_data);
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

  // browser settings, https://ionicframework.com/docs/v3/native/in-app-browser/
  const browser_options = {
    location: "no",
    clearcache: "yes",
    hideurlbar: "yes",
    beforeload: "yes", // maybe works? i can't read so idk
  };

  // open browser view
  const open_facial_recognition = async () => {
    const browser = await InAppBrowser.create(
      "https://google.com",
      "_self",
      browser_options
    );

    browser.close();
  };

  // sets current wander time
  const wander_time = async () => {
    var wander = {
      wander_start: wander_start_time.substring(11, wander_start_time.length),
      wander_end: wander_end_time.substring(11, wander_start_time.length),
    };
    wander_data_add(wander);
    db_set("wander_obj", {
      wander_start: wander_start_time,
      wander_end: wander_end_time,
    });
  };

  // set notifications that the user wants
  const notification_add = async (notification_types) => {
    // updates the actual value displayed
    set_notification_type(notification_types);

    // add to server now
    set_notification(notification_types);
  }

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
    db_get("wander_obj").then((rr) => {
      if (rr) {
        set_wander_start_time(rr.wander_start);
        set_wander_end_time(rr.wander_end);
      }
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
              <IonTitle>Settings</IonTitle>
            </center>
          </IonToolbar>
        </IonHeader>

        <IonList>
          <IonItem>
            <IonLabel>Tablet Mode</IonLabel>
            <IonCheckbox
              checked={tablet_mode}
              onIonChange={tablet_manager}
            ></IonCheckbox>
          </IonItem>

          <IonItem>
            <IonLabel>Contact & Reminders Page</IonLabel>
            <IonButton
              onClick={() => {
                set_contact_trigger(true);
              }}
            >
              <IonIcon slot="icon-only" size="small" icon={callOutline} />
            </IonButton>

            <IonModal
              backdropDismiss={true}
              animated={true}
              swipeToClose={true}
              isOpen={contact_trigger}
            >
              <IonHeader>
                <IonToolbar color="primary" className="title-th">
                  <center>
                    <IonTitle>Contacts</IonTitle>
                  </center>
                  <IonButtons slot="end">
                    <IonButton
                      onClick={() => {
                        set_contact_trigger(false);
                      }}
                    >
                      <IonIcon icon={closeOutline}></IonIcon>
                    </IonButton>
                  </IonButtons>
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
                    <IonSelectOption value={"sprint"}>
                      {"Sprint"}
                    </IonSelectOption>
                    <IonSelectOption value={"t-mobile"}>
                      {"T-mobile"}
                    </IonSelectOption>
                    <IonSelectOption value={"verizon"}>
                      {"Verizon"}
                    </IonSelectOption>
                    <IonSelectOption value={"boost mobile"}>
                      {"Boost mobile"}
                    </IonSelectOption>
                    <IonSelectOption value={"cricket"}>
                      {"Cricket"}
                    </IonSelectOption>
                    <IonSelectOption value={"metro pcs"}>
                      {"Metro Pcs"}
                    </IonSelectOption>
                    <IonSelectOption value={"tracfone"}>
                      {"Tracfone"}
                    </IonSelectOption>
                    <IonSelectOption value={"u.s. cellular"}>
                      {"U.S Cellular"}
                    </IonSelectOption>
                    <IonSelectOption value={"virgin mobile"}>
                      {"Virgin Mobile"}
                    </IonSelectOption>
                  </IonSelect>
                  <IonButton onClick={add_reminder_person}>
                    Add Contact
                  </IonButton>
                </IonItem>

                <IonItem>
                  <IonLabel>Notification Type</IonLabel>
                  <IonSelect
                    value={notification_type}
                    placeholder="Notifications"
                    onIonChange={(e) => notification_add(e.detail.value)}
                    multiple={true}
                  >
                    <IonSelectOption value={"email"}>email</IonSelectOption>
                    <IonSelectOption value={"text"}>text</IonSelectOption>
                    <IonSelectOption value={"call"}>text</IonSelectOption>
                  </IonSelect>
                </IonItem>
              </IonList>
            </IonModal>
          </IonItem>

          <IonItem>
            <IonLabel>Family Page</IonLabel>
            <IonButton
              onClick={() => {
                set_family_trigger(true);
              }}
            >
              <IonIcon slot="icon-only" size="small" icon={peopleOutline} />
            </IonButton>

            <IonModal
              backdropDismiss={true}
              animated={true}
              swipeToClose={true}
              isOpen={family_trigger}
            >
              <IonHeader>
                <IonToolbar color="primary" className="title-th">
                  <center>
                    <IonTitle>Family Page</IonTitle>
                  </center>
                  <IonButtons slot="end">
                    <IonButton
                      onClick={() => {
                        set_family_trigger(false);
                      }}
                    >
                      <IonIcon icon={closeOutline}></IonIcon>
                    </IonButton>
                  </IonButtons>
                </IonToolbar>
              </IonHeader>

              <IonList>
                <IonItem>
                  <IonLabel>Family Mode</IonLabel>
                  <IonCheckbox
                    checked={family_mode}
                    onIonChange={family_manager}
                  ></IonCheckbox>
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
                {family_mode && (
                  <div>
                    <IonItem>
                      <IonLabel>Start Time</IonLabel>
                      <IonDatetime
                        slot="end"
                        value={wander_start_time}
                        onIonChange={(e) =>
                          set_wander_start_time(e.detail.value)
                        }
                        label="start time"
                        presentation="time"
                      ></IonDatetime>
                    </IonItem>

                    <IonItem>
                      <IonLabel>End Time</IonLabel>
                      <IonDatetime
                        slot="end"
                        value={wander_end_time}
                        onIonChange={(e) => set_wander_end_time(e.detail.value)}
                        label="end time"
                        presentation="time"
                      ></IonDatetime>
                    </IonItem>

                    <IonItem>
                      <IonTitle>Wander Alarm</IonTitle>
                      <IonButton onClick={() => wander_time()}>
                        Save wander alarm times!
                      </IonButton>
                    </IonItem>
                  </div>
                )}
              </IonList>
            </IonModal>
          </IonItem>

          <IonItem>
            <IonLabel>Kitchen Page</IonLabel>
            <IonButton
              onClick={() => {
                set_kitchen_trigger(true);
              }}
            >
              <IonIcon slot="icon-only" size="small" icon={fastFoodOutline} />
            </IonButton>
            <IonModal
              backdropDismiss={true}
              animated={true}
              swipeToClose={true}
              isOpen={kitchen_trigger}
            >
              <IonHeader>
                <IonToolbar color="primary" className="title-th">
                  <center>
                    <IonTitle>Kitchen Info</IonTitle>
                  </center>
                  <IonButtons slot="end">
                    <IonButton
                      onClick={() => {
                        set_kitchen_trigger(false);
                      }}
                    >
                      <IonIcon icon={closeOutline}></IonIcon>
                    </IonButton>
                  </IonButtons>
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

                <IonRow>
                  <IonButton onClick={bonus_button}>+1 Minute</IonButton>
                </IonRow>
              </IonGrid>
            </IonModal>
          </IonItem>

          <IonItem>
            <IonLabel>Facial Recognition Page</IonLabel>
            <IonButton
              onClick={() => {
                set_recognition_trigger(true);
              }}
            >
              <IonIcon slot="icon-only" size="small" icon={imagesOutline} />
            </IonButton>

            <IonModal
              backdropDismiss={true}
              animated={true}
              swipeToClose={true}
              isOpen={recognition_trigger}
            >
              <IonHeader>
                <IonToolbar color="primary" className="title-th">
                  <center>
                    <IonTitle>Facial Recognition</IonTitle>
                  </center>
                  <IonButtons slot="end">
                    <IonButton
                      onClick={() => {
                        set_recognition_trigger(false);
                      }}
                    >
                      <IonIcon icon={closeOutline}></IonIcon>
                    </IonButton>
                  </IonButtons>
                </IonToolbar>
              </IonHeader>

              <IonList>
                <IonItem>
                  <IonLabel>Live Image Recognition</IonLabel>
                  <IonButton onClick={open_facial_recognition}>
                    <IonIcon icon={cameraOutline}></IonIcon>
                  </IonButton>
                </IonItem>

                <IonItem
                  onClick={() => {
                    set_recognition_options(!recognition_options);
                  }}
                >
                  <IonText>
                    <b>
                      {!recognition_options && "> "}
                      {recognition_options && "v "}Add a new person to
                      recognized list
                    </b>
                  </IonText>
                </IonItem>

                {recognition_options && (
                  <div>
                    <IonItem>
                      <IonLabel position="floating">Name</IonLabel>
                      <IonInput
                        type="email"
                        placeholder="Name"
                        ref={name}
                      ></IonInput>
                    </IonItem>

                    <IonItem>
                      <IonLabel position="floating">Description</IonLabel>
                      <IonInput
                        type="email"
                        placeholder="Description"
                        ref={description}
                      ></IonInput>
                    </IonItem>

                    <IonItem>
                      <IonLabel>Take picture!</IonLabel>
                      <IonButton onClick={take_picture}>
                        <IonIcon icon={cameraOutline}></IonIcon>
                      </IonButton>
                    </IonItem>

                    <center>
                      <IonButton onClick={send_recognition}>
                        Add person to recognized list
                      </IonButton>
                    </center>
                  </div>
                )}
              </IonList>
            </IonModal>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;