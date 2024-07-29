import { WaitState } from "@/constants/waitStateEnum";
import { Room } from "@/types/roomType";
import { Link, router } from "expo-router";
import { Text, StyleSheet, Image } from 'react-native';
import { Button } from "react-native-paper";
import { global } from "@/utils/global";


export function getFavoriteRooms(rooms: {[key: number]: Room}): Room[] {
  return Object.values(rooms).filter(room => room.favorite);
}

export function getRoomIdString(roomId: number) {
  const roomIdString = roomId.toString();
  if (roomIdString.length === 1) {
    return `R00${roomIdString}`;
  }
  if (roomIdString.length === 2) {
    return `R0${roomIdString}`;
  }
  return `R${roomIdString}`;
}



//Ich glaube, das hier das Problem ist!!!! 
// Wenn er pusht, dann rendert Index komplett von vorne und dann ist der mqttHandler wieder null


export function getStateDisplay(state: WaitState) {

  if (state == WaitState.sendingMission) {
    return (
        <>
        <Image source={require('../assets/images/waiting.gif')}/>
        <Text style={stylesText.text}>Mission wird gesendet</Text>
        </>
    )
  } else if (state === WaitState.waitingForConfirmation) {
    return (
        <>
          <Image source={require('../assets/images/waiting.gif')}/>
          <Text style={stylesText.text}>Warten auf Bestätigung</Text>
        </>
    )
  } else if (state === WaitState.robotOnTheWay) {
    return (
      <>
      <Image source={require('../assets/images/onTheWay.gif')}/>
      <Text style={stylesText.text}>Ein Frodo ist auf dem Weg</Text>
      </>
    )
  } else if (state === WaitState.noFrodoFound) {
    return (
      <>
      <Image source={require('../assets/images/notFound.gif')}/>
      <Text style={stylesText.text}>Leider ist kein Frodo verfügbar</Text>
      <Text style={stylesText.text}>Versuche es in 20min nochmal </Text>
      <Link href='./' asChild>
        <Button style={styles.button} buttonColor="#538569" mode="elevated" labelStyle={styles.buttonText}> Accept! </Button>
      </Link>
      </>
    )
  } else if (state === WaitState.frodoCrashed) {
    return (
      <>
      <Image source={require('../assets/images/error.gif')}/>
      <Text style={stylesText.text}>Dein Frodo ist ausgefallen</Text>
      <Link href='/(tabs)/favorites' asChild>
        <Button style={styles.button} buttonColor="#538569" mode="elevated" labelStyle={styles.buttonText}> Confirm! </Button>
      </Link>
      </>
    )
  } else if (state == WaitState.frodoArrived) {
    return (
      <>
        <Image source={require('../assets/images/succsess.gif')}/>
        <Text style={stylesText.text}>Dein Frodo ist angekommen</Text>
        <Link href='./' asChild>
        <Button style={styles.button} buttonColor="#538569" mode="elevated" labelStyle={styles.buttonText}> Confirm! </Button>
        </Link>
      </>
    )
  }
  return (
    <>
       <Image source={require('../assets/images/unknown.gif')}/>
       <Text style={stylesText.text}>Unknown State</Text>
       <Link href='./' asChild>
       <Button  style={styles.button} buttonColor="#538569" mode="elevated" labelStyle={styles.buttonText}> Confirm! </Button>
        </Link>
    </>
   
  )
}

const styles = StyleSheet.create({
  button: {

  },
  buttonText: {
    fontSize: 15,
    color: 'white',
  }
})

const stylesText = StyleSheet.create({
  text: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  }
})

