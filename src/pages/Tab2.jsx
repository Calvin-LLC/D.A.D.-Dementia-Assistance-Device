import {
  IonContent,
  IonPage,
  IonDatetime,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonInput,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonListHeader,
  IonItemDivider,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonPopover,
  IonText,
  IonIcon,
} from "@ionic/react";
import { useState, useEffect, useRef } from "react";
import "./Tab2.css";
import {
  get_reminder_data,
  send_reminder_data,
  remove_reminder_data,
} from "../componets/data";
import { format, parseISO } from "date-fns";
import { db_set, db_get } from "../componets/storage";
import { closeOutline, addOutline } from "ionicons/icons";

const Tab2 = () => {
  const mounted_prop = useRef(true);

  useEffect(() => {
    return () => {
      mounted_prop.current = false;
    };
  }, []);

  const reminder_data = useRef(null);
  const [selectedDate, setSelectedDate] = useState();
  const [raw_date, set_raw_date] = useState(0);
  const [raw_time, set_raw_time] = useState(0);
  const [reminder_modal, set_reminder_modal] = useState(false);
  const [time, set_time] = useState();
  const [cols, setCols] = useState([]);
  const [value, setValue] = useState(0);
  const [reminder_type, set_reminder_type] = useState(0);

  var old_obj = new Array();
  var parsed_obj = new Array();

  const update_reminder = () => {
    get_reminder_data()
      .then((response) => {
        var len = response.data.length;
        if (response.data == old_obj) return;
        for (var i = 0; i < len; ++i) {
          var dt = format(parseISO(response.data[i].date), "PPPPpppp");
          parsed_obj[i] = {
            date: dt.substring(0, dt.length - 10),
            reminder: response.data[i].reminder,
          };
        }
        if (mounted_prop.current) setCols(parsed_obj);
        db_set("reminder_obj", parsed_obj);
      })
      .catch((err) => {
        console.log("2nd Error caught: " + err);
      });
  };

  const add_reminder = () => {
    const reminder_msg = reminder_data.current.value;

    if (!reminder_msg || !selectedDate || !time) return;

    send_reminder_data({
      date: raw_date + raw_time,
      reminder: reminder_msg,
      minutes_before: value,
      type: reminder_type,
    }).then(() => {
      update_reminder();
    });
    set_reminder_modal(false);
  };

  const date_picker = (e) => {
    var date = e.detail.value;
    set_raw_date(date.substring(0, 10));
    date = date.substring(0, 10);
    setSelectedDate(date);
  };

  const time_picker = (e) => {
    var tme = e.detail.value;
    set_raw_time(tme.substring(10, tme.length));
    tme = tme.substring(11, tme.length - 6);
    if (tme.substring(0, 2) - 12 > 0)
      tme = tme.substring(0, 2) - 12 + tme.substring(2, tme.length) + " PM";
    else tme = tme.concat(" AM");
    set_time(tme);
  };

  useEffect(() => {
    setInterval(() => {
      if (!mounted_prop.current) return;
      update_reminder();
    }, 2000);
  }, []);

  useEffect(() => {
    db_get("reminder_obj").then((response) => {
      if (response) setCols(response);
    });
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary" className="title-th">
          <center>
            <IonTitle>Reminders</IonTitle>
          </center>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {cols.map((col, i) => (
            <div key={i + 1}>
              <IonListHeader lines="none">
                <IonLabel>
                  <b>{col.date}</b>
                </IonLabel>
              </IonListHeader>
              <IonItem lines="full">
                <IonLabel>{"- " + col.reminder}</IonLabel>
                <IonButton
                  size="small"
                  fill="outline"
                  onClick={() => {
                    remove_reminder_data(i);
                  }}
                >
                  <IonIcon icon={closeOutline}></IonIcon>
                </IonButton>
              </IonItem>
            </div>
          ))}
          <center>
            <IonButton
              id="reminder_modal"
              onClick={() => set_reminder_modal(true)}
            >
              <IonIcon icon={addOutline} />
            </IonButton>
          </center>

          <IonModal
            trigger="reminder_modal"
            isOpen={reminder_modal}
            swipeToClose={true}
            breakpoints={[0.1, 0.5, 1]}
            initialBreakpoint={0.5}
          >
            <IonContent>
              <IonItemDivider />
              <IonItem button={true} id="open-date-input">
                <IonLabel>Date</IonLabel>
                <IonText slot="end">{selectedDate}</IonText>
                <IonPopover trigger="open-date-input" showBackdrop={false}>
                  <IonDatetime
                    presentation="date"
                    onIonChange={(e) => date_picker(e)}
                  />
                </IonPopover>
              </IonItem>
              <IonItem button={true} id="open_time">
                <IonLabel>Time</IonLabel>
                <IonText slot="end">{time}</IonText>
                <IonPopover trigger="open_time" showBackdrop={false}>
                  <IonDatetime
                    presentation="time"
                    onIonChange={(e) => time_picker(e)}
                  />
                </IonPopover>
              </IonItem>

              <IonItem>
                <IonLabel>Minutes Before</IonLabel>
                <IonSelect
                  value={value}
                  placeholder="Select One"
                  onIonChange={(e) => setValue(e.detail.value)}
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
              </IonItem>

              <IonItem>
                <IonLabel>Who to remind</IonLabel>
                <IonSelect
                  value={reminder_type}
                  placeholder="Select One"
                  onIonChange={(e) => set_reminder_type(e.detail.value)}
                >
                  <IonSelectOption value={"user"}>user</IonSelectOption>
                  <IonSelectOption value={"caretaker"}>family</IonSelectOption>
                  <IonSelectOption value={"both"}>both</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonInput ref={reminder_data} placeholder="Reminder message" />
              </IonItem>

              <center>
                <IonButton size="small" onClick={add_reminder}>
                  Add Reminder
                </IonButton>
              </center>
            </IonContent>
          </IonModal>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
