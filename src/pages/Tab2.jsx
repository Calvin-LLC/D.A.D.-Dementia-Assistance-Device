import {
  IonContent,
  IonPage,
  IonDatetime,
} from "@ionic/react";
import { useState, useEffect, useRef } from "react";
import "./Tab2.css";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import ".././theme/variables.css";

import { format, parseISO } from "date-fns";

const Tab2 = () => {
  const mounted_prop = useRef(true); // Initial value _isMounted = true

  useEffect(() => {
    return () => {
      // ComponentWillUnmount in Class Component
      mounted_prop.current = false;
    };
  }, []);

  const [selectedDate, setSelectedDate] = useState("2012-12-15T13:47:20.789");
  const [popoverDate, setPopoverDate] = useState("");
  const [popoverDate2, setPopoverDate2] = useState("");

  const customDatetime = useRef();
  const confirm = () => {
    if (customDatetime === undefined) return;

    customDatetime.confirm();
  };

  const reset = () => {
    if (customDatetime === undefined) return;

    customDatetime.reset();
  };

  const formatDate = (value) => {
    return format(parseISO(value), "MMM dd yyyy");
  };

  /*
  var old_length = null;
  const update_reminder = () => {
    get_reminder_data().then((response) => {
      var len = response.data.length;
      if (len = old_length) len = 0;
      for (var i = 0; i < len; ++i) {
        setReminders((reminders) => [...reminders, response.data[i].reminder]);
      }
      old_length = len;
    });
  };

  const add_reminder = () => {
    const reminder_msg = reminder_message.current.value;
    const reminder_time = time_of_reminder.current.value;

    if (!reminder_msg || !reminder_time) return;

    send_reminder_data({"date":reminder_time, "reminder":reminder_msg}).then(() => {
      update_reminder();
    });
  };*/

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonDatetime color='#eb445a' showClearButton={true}/>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
