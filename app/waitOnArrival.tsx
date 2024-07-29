import React from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';
import { MqttHandler } from '@/mqtt/mqttHandler';
import { global } from '@/utils/global';
import { getStateDisplay } from '@/utils/dataHandlingUtils';
import MissionState from '@/types/missionStateType';
import { WaitState } from '@/constants/waitStateEnum';
import { MissionDTO } from '@/types/missionDTOType';
import { Room } from '@/types/roomType';

// Was für States haben wir im Phone: 
// 1. Senden von Mission DTO und warten auf Bestätigung vom Server
// 2. Mission DTO wurde bestätigt und wir warten auf die Ankunft von Frodo
// 3. Frodo ist angekommen und wir geben eine SuccessNachricht raus
// 4. Frodo ist nicht angekommen und wir geben eine FailureNachricht raus
// 5. Zum Schluss Routen wir wieder zurück zu (tabs)



export default function WaitOnArrival() {

  const [phoneId, setPhoneId] = React.useState<string | null>(global.phoneId);
  const [mqttHandler, setMqttHandler] = React.useState<MqttHandler | null>(global.mqttHandler);

  const [state, setState] = React.useState<WaitState>(WaitState.sendingMission);
  const triedConnecting = React.useRef(false);
  const [trigger, setTrigger] = React.useState(false);





  React.useEffect(() => {

    console.log('Callbacks setzen');
    // On Message Arrived definieren Callback

      console.log(mqttHandler);
      mqttHandler!.client.onMessageArrived = ((message) => {
      const missionState: MissionState = JSON.parse(message.payloadString);

      console.log('Nachricht erhalten: ', missionState);

      if (missionState.state === WaitState.robotOnTheWay) {
        setState(WaitState.robotOnTheWay);
      } else if (missionState.state === WaitState.noFrodoFound) {
        setState(WaitState.noFrodoFound);
      } else if (missionState.state === WaitState.frodoCrashed) {
        setState(WaitState.frodoCrashed);
      } else if (missionState.state === WaitState.frodoArrived) {
        setState(WaitState.frodoArrived);
      }
    })
    
  }, []);




  //deactivate back button
  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => { 
      return true; 
    });

  }, []);



  React.useEffect(() => {
    if (mqttHandler != null && trigger == global.trigger) {

    if (state === WaitState.sendingMission) {

      console.log('PIIING');

      const missionDTO: MissionDTO = {
        missionId: (Math.floor((Math.random() * 100000000))).toString(),
        phoneId: phoneId!,
        roomId: global.selectedRoom!.roomId.toString(),  // Das sollte nie ein Problem sein
      }
      mqttHandler.sendMessage("missionDataCruncher", JSON.stringify(missionDTO));
      setState(WaitState.waitingForConfirmation);
    }
    }
  }), [trigger];

  if (global.trigger != trigger) {
    setState(WaitState.sendingMission);
    setTrigger(global.trigger);
  }

  return (
    <View style={styles.container}>
      {getStateDisplay(state)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})