// importing all of our react libs
import React, { useRef, useState, useEffect } from "react"; // standard react to edit elements etc
import axios from "axios"; // ezpz web comm

import {
  IonApp,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonAlert,
  IonText,
  IonPage,
} from "@ionic/react";

import { arrowForwardOutline, eyeOutline, eyeOffOutline, banOutline } from "ionicons/icons";

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
import "./../theme/variables.css";
import { useHistory } from "react-router-dom";
import { data_send, data_recieve, save_login } from "./data";

const Login = (props) => {
  let history = useHistory();

  // states
  const [connected_status, set_connected_status] = useState();
  const [logged_in, set_logged_in] = useState();
  const [show_pass, set_show_pass] = useState(true);
  const [pass_shown, set_pass_shown] = useState("password");
  const [error, set_error] = useState();

  // refs
  const username_ref = useRef(null);
  const password_ref = useRef(null);

  // website
  var login_url = "https://ziadabdelati.com/check.php?type=login&email=";
  var register_url = "https://ziadabdelati.com/check.php?type=register&email="
  
  const http_get = (URL) => {
    return axios({
      url: URL,
    }).then((response) => {
      console.log(response);
      return response.data;
    });
  };

  const send = () => {
    const username = username_ref.current.value; // the ? after current checks if the connections (refs) exists or not, an ! means we garauntee the fact that the value exists
    const password = password_ref.current.value;

    if (!username || !password) return;

    login_url += username + "&pword=" + password;
    console.log(login_url);
    var res = http_get(login_url).then((response) => {
      if (response == 240) {
        console.log("correct data sent, redirecting");
        set_logged_in("");
        save_login(username, password);
        data_recieve();

        history.push('./TabManager');
        history.replace("./TabManager");
      } else {
        console.log("incorrect pass");
        set_logged_in("Failed to log in!");
      }
    });
    console.log("return: " + res);
  };

  const register = () => {
    const username = username_ref.current.value; // the ? after current checks if the connections (refs) exists or not, an ! means we garauntee the fact that the value exists
    const password = password_ref.current.value;

    if (!username || !password) return;

    register_url += username + "&pword=" + password;
    http_get(register_url).then((response) => {
      console.log(response);
    });
  }

  const toggle_pass = () => {
    set_show_pass(!show_pass);
    set_pass_shown(show_pass ? "text" : "password");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary" className="title-th">
          <IonTitle>Smart Home</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Email</IonLabel>
                <IonInput clearInput={true} type="email" ref={username_ref}></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Password</IonLabel>
                <IonInput clearOnEdit={false} type={pass_shown} ref={password_ref}></IonInput>
                {!show_pass && (
                <IonIcon onClick={toggle_pass} slot="end" icon={eyeOutline}/>
                )}
                {show_pass && (
                <IonIcon onClick={toggle_pass} slot="end" icon={eyeOffOutline}/>
                )}
              </IonItem>
              {logged_in && (
                <IonText>
                  <p className="error">Incorrect Password!</p>
                </IonText>
              )}
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol className="ion-text-left">
              <IonButton onClick={send}>
                <IonIcon slot="end" icon={arrowForwardOutline} />
                Send
              </IonButton>
            </IonCol>

            <IonCol className="ion-text-right">
              <IonButton onClick={register}>
                <IonIcon slot="end" icon={banOutline} />
                Register
              </IonButton>
            </IonCol>
          </IonRow>
          {connected_status && (
            <IonRow>
              <IonCol>
                <IonCard>
                  <IonCardContent>
                    <h2>{connected_status}</h2>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;
