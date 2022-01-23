import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab3.css';
import {useEffect} from 'react';
import { save_screen } from './data';

const Tab3 = () => {
  function LoaderFunc(params){
    useEffect(()=>{
      save_screen(3);
    }, [])
    return <div></div>
  }

  return (
    <IonPage>
      <LoaderFunc/>
      
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 3</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
