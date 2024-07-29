import { rooms } from '@/constants/rooms';
import { Room } from '@/types/roomType';
import { getRoomIdString } from '@/utils/dataHandlingUtils';
import { BlurView } from 'expo-blur';
import { Link } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { Col, Grid, Row } from 'react-native-easy-grid';
import { Button } from "react-native-paper";
import { global } from '@/utils/global';


export default function Tab() {


  const [roomState, setRoomState] = React.useState('RaumNr.');

  const [correctRoomModal, setCorrectRoomModal] = React.useState(false);
  const [wrongRoomModal, setWrongRoomModal] = React.useState(false);
  const [currentRoom, setCurrentRoom] = React.useState<Room>({} as Room);

  const showModal = (roomId: number) => {
    if (rooms.hasOwnProperty(roomId)) {
      setCurrentRoom(rooms[roomId]);
      setCorrectRoomModal(true);
    } else {
      setWrongRoomModal(true);  
    }      
  }

  const closeModalBack = () => {
    setCorrectRoomModal(false);
    setWrongRoomModal(false);
  }

  const closeModalAccept = () => {
    setCorrectRoomModal(false);
    setWrongRoomModal(false);
    global.trigger = !global.trigger
    global.selectedRoom = currentRoom;
  }


  const handleRoomSelection = (value: string) => {
    
    //TODO das geht viel besser: 
    if (roomState === 'RaumNr.' && value !== '←' && value !== '→') {
      setRoomState(value);
      return;
    } 
    if (roomState === 'RaumNr.' && (value === '←' || value === '→')) {
      return;
    }
    if (value === '←') {
      setRoomState(roomState.slice(0, -1))
      return;
    }
    else if (roomState.length < 3 && value !== '→') {
      setRoomState(roomState + value)
      return;
    } else if (value === '→') {
      showModal(parseInt(roomState));
      return;
    }
  }

  const renderButton = (item: string) => {

    if (item === '←' || item === '→') {
      return (
        <Button contentStyle={{paddingVertical: 20}} onPress={() => handleRoomSelection(item)} icon={item === '←' ? "arrow-left": "arrow-right"} style={styles.iconButton} buttonColor={item === '←' ? '#BA5529': '#538569'} labelStyle={styles.iconButtonText} mode="elevated" children={undefined} />
      )
    }
    return (
      <Button contentStyle={{paddingVertical: 20}} onPress={() => handleRoomSelection(item)} style={styles.button} buttonColor="white" mode="elevated" labelStyle={styles.buttonText}>{item}</Button>
    )

  }

  return (
    <View style={styles.bigContainer}>
      
      <View style= {styles.headerContainer} >
        <Text style={styles.header2}>Raum auswählen</Text>
      </ View>
      <View id='container' style={styles.contaier}>

        <Text style={styles.raumText}>{roomState}</Text>
        <Grid style={styles.gridContainer}>
        <Row>
          <Col>{renderButton('1')}</Col>
          <Col>{renderButton('2')}</Col>
          <Col>{renderButton('3')}</Col>
        </Row>
        <Row>
          <Col>{renderButton('4')}</Col>
          <Col>{renderButton('5')}</Col>
          <Col>{renderButton('6')}</Col>
        </Row>
        <Row>
          <Col>{renderButton('7')}</Col>
          <Col>{renderButton('8')}</Col>
          <Col>{renderButton('9')}</Col>
        </Row>
        <Row>
          <Col>{renderButton('←')}</Col>
          <Col>{renderButton('0')}</Col>
          <Col>{renderButton('→')}</Col>
        </Row>
      </Grid>
      </View>
      {correctRoomModal && <BlurView intensity={100} style={StyleSheet.absoluteFill} tint="systemMaterial" >
        <Modal animationType='slide' transparent={true} visible={correctRoomModal}>
          <View style={modalStyles.modalBackground}>
            <Text style={modalStyles.modalHeader}>Auftrag Bestätigen</Text>
            <View id={currentRoom.roomId.toString()} key={currentRoom.roomId} style={[styles.roomContainer, {top: 20}]}>
              <Text style={styles.roomId}>{getRoomIdString(currentRoom.roomId)}</Text>
              <Text style={styles.description}>{currentRoom.description}</Text>
              <Text style={styles.level}>Stock: {currentRoom.Level}</Text>
            </View>
            <View style={modalStyles.buttonContainer}>
              <Button onPress={closeModalBack} buttonColor="#BA5529" mode="elevated" dark>Schließen</Button>
              <Link href="/../waitOnArrival" asChild>
                <Button onPress={closeModalAccept} buttonColor="#538569" mode="elevated" dark>Bestätigen</Button>
              </Link>
            </View>
          </View>
        </Modal>
      </BlurView>}
      {wrongRoomModal && <BlurView intensity={100} style={StyleSheet.absoluteFill} tint="systemMaterial" >
        <Modal animationType='slide' transparent={true} visible={wrongRoomModal}>
          <View style={modalStyles.modalBackground}>
            <Text style={modalStyles.modalHeader}>Den Raum gibt es nicht</Text>
            <View style={{top: 40}}>
              <Button onPress={closeModalBack} buttonColor="#BA5529" mode="elevated" dark>Schließen</Button>
            </View>
          </View>
        </Modal>
      </BlurView>}
    </ View>
  )
}


const modalStyles = StyleSheet.create({
  modalHeader: {
    fontSize: 20
  },
  modalBackground: {
    width: 360,
    height: 206,
    top: 300,
    left: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 28,
  }, 
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    padding: 10,
    marginTop: 50,
  }
});

const styles = StyleSheet.create({
  bigContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#426EB8'
  },
  headerContainer: {
    position: 'absolute',
    top: 100,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header2: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
  },
  contaier: {
    flex: 0.4,
    width: 500,
    height: 520,
    top: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  raumText: {
    fontSize: 20,
    fontStyle: 'italic',
    color: 'white',
    width: 300,
    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
    textAlign: 'center',
  },
  gridContainer: {
    width: '90%',
    justifyContent: 'center',
    top: 40,
  },
  button: {
    marginHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 10,
    margin: 5,
  }, 
  buttonText: {
    fontSize: 20,
    color: 'black',
  },
  iconButton: {
    marginHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 10,
    margin: 5,
  }, 
  iconButtonText: {
    color: 'white',
    paddingLeft: 10,
  },
  roomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  touchElement: {
    width: '100%',
    height: 60,
  },
  roomId: {
    flex: 1,
    fontSize: 19,
  },
  description: {
    flex: 2,
    textAlign: 'center',
    right: -30
  },
  level: {
    flex: 3,
    textAlign: 'right',
    right: 40
  }

});