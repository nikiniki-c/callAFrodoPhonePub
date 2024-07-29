import { router  } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Dimensions, Image, ActivityIndicator } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';
import { MqttHandler } from '@/mqtt/mqttHandler';
import DeviceInfo from 'react-native-device-info';
import { global } from '@/utils/global';

const { width , height } = Dimensions.get('window');

export default function Index() {

  const [password, onChangePass] = React.useState('');
  const [support, setSupport] = React.useState(false);
  const [ids, setIds] = React.useState<string[]>(['04113501CA4703', '04017501674703', '0421C701294703', '0421AA01E94703', '04218401BB4703', '04E03701440703', '04D07401C30703']);
  const [phoneId, setPhoneId] = React.useState<string | null>(null);
  const [mqttHandler, setMqttHandler] = React.useState<MqttHandler | null>(null);
  const triedConnecting = React.useRef(false);
  const [connected, setConnected] = React.useState(false);

  React.useEffect(() => {
    const fetchUniqueId = async () => {
      const id = await DeviceInfo.getUniqueId();
      const newUniqueId = "Phone" + id;
      console.log(newUniqueId);

      const url = "addYourOwnUrlHere";
      const mqttHandler = new MqttHandler(url, newUniqueId, setConnected)

      global.mqttHandler = mqttHandler;
      global.phoneId = newUniqueId;

      setPhoneId(newUniqueId);
      setMqttHandler(mqttHandler)
    };
    fetchUniqueId();
  }, []);


  if (mqttHandler != null) {
    console.log("Connected: ", mqttHandler.client.isConnected());
  }

  React.useEffect(() => {
    
    if (!triedConnecting.current && mqttHandler != null) {

      if (!mqttHandler.client.isConnected()) {
        console.log('Connecting to MQTT Broker');
        mqttHandler.connectToMqttBroker();
        triedConnecting.current = true;
      }
    }
  }, [phoneId, mqttHandler]);


  React.useEffect(() => {
    if (connected) {
      mqttHandler!.subscribeToTopic(phoneId!);
    }
  }, [connected])


  React.useEffect(() => {
      const checkIsSupported = async () => {
        const deviceIsSupported = await NfcManager.isSupported()
        if (deviceIsSupported) {
          await NfcManager.start()
          setSupport(true);
        }
        console.log('hasNFC', deviceIsSupported);
      }
      checkIsSupported();

      readTag()
      NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: any) => {
        for (const id of ids){
          if(id == tag.id){
            router.push('/(tabs)/favorites');
          }
        }
      })

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    }
  }, [])

  const readTag = async () => {
    await NfcManager.registerTagEvent();
  }

  const passwordCheck = () => {
    if (password === '1166') {
      onChangePass('');
      router.push('/(tabs)/favorites');
    }
  }

  if (!connected) {
    return ( 
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>Verbindung wird hergestellt...</Text>
      </View>
    )
  }

  if(!support){
    return (
        <View style={styles.container}>
          <Text style={styles.text}>Password eingeben:</Text>
            <TextInput
                mode='outlined'
                keyboardType = 'number-pad'
                style={styles.textField}
                secureTextEntry
                onChangeText={onChangePass}
                value={password}
                placeholder="Password"
            />
            <View style={styles.buttonContainer}>
              <Button onPress={() => passwordCheck() } style={styles.loginButton}  buttonColor='#426EB8' mode='elevated' dark><Text style={styles.loginButtonText}>Login</Text></Button>
            </View>
        </View>
    )
  }else{
    return (
      <View style={styles.nfc}>
        <Image source={require('../assets/images/nfc.gif')} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    flex:1,
    backgroundColor: '#47ED87',
  },
  buttonContainer: {
    marginTop: 400,
    flex: 1,
  },
  text: {
    marginTop: 400,
    fontSize: 30,
  },
  loginButton: {
    
    height: 50,
    width: '60%',
  },
  loginButtonText: {
    paddingTop: 10,
    fontSize: 30,
    color: `white`,
  },
  textField: {
    width: '50%',
    height: 50,
    backgroundColor: 'white',
    fontSize: 30,
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlign: 'center',
    marginTop: 30,
  },
  nfc: {
    alignSelf: 'center',
    paddingTop: 250,
  }
});