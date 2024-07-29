import { rooms } from '@/constants/rooms';
import { Room } from '@/types/roomType';
import { getFavoriteRooms, getRoomIdString } from '@/utils/dataHandlingUtils';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Button } from 'react-native-paper';
import { Link } from 'expo-router';
import { global } from '@/utils/global';



export default function Tab() {

  const [roomModal, setRoomModal] = React.useState(false);
  const [currentRoom, setCurrentRoom] = React.useState<Room>({} as Room);
  const favorites = React.useRef<Room[]>(getFavoriteRooms(rooms))


  const showModal = (roomId: number) => {
    console.log('roomId', roomId);
    setCurrentRoom(rooms[roomId]);
    setRoomModal(true);
    
  }

  const closeModalBack = () => {
    setRoomModal(false);
  }

  const closeModalAccept = () => {
    setRoomModal(false);
    global.trigger = !global.trigger
    global.selectedRoom = currentRoom;
  }

  console.log('currentRoom' , currentRoom.description);


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favoriten</Text>
      <View id='favoriteList' style={styles.liste}>
        <ScrollView>
          {favorites.current.map((room, index) => (
             <TouchableOpacity style={styles.touchElement} key={Math.random()} onPress={() => showModal(room.roomId)}>
              <View id={room.roomId.toString()} key={room.roomId} style={styles.roomContainer}>
                <Text style={styles.roomId}>{getRoomIdString(room.roomId)}</Text>
                <Text style={styles.description}>{room.description}</Text>
                <Text style={styles.level}>Stock: {room.Level}</Text>
                <Ionicons name="chevron-forward" size={20} color="white" />
              </View>
            </TouchableOpacity>

          ))}
        </ScrollView>
      </View>

      {roomModal && <BlurView intensity={100} style={StyleSheet.absoluteFill} tint="systemMaterial" >
        <Modal animationType='slide' transparent={true} visible={roomModal}>
          <View style={modalStyles.modalBackground}>
            <Text style={modalStyles.modalHeader}>Auftrag Bestätigen</Text>
            <View id={currentRoom.roomId.toString()} key={currentRoom.roomId} style={[styles.roomContainer, {top: 20}]}>
              <Text style={[styles.roomId, {color: 'black'}]}>{getRoomIdString(currentRoom.roomId)}</Text>
              <Text style={[styles.description, {color: 'black'}]}>{currentRoom.description}</Text>
              <Text style={[styles.level, {color: 'black'}]}>Stock: {currentRoom.Level}</Text>
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
    </View>
    
   
  );
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#426EB8'
  },
  header: {
    fontSize: 30,
    flex: 0.5,
    textAlign: 'center',
    top: 100,
    color: 'white'
  },
  liste: {
    width: '80%',
    flex: 2,
  },
  roomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  touchElement: {
    width: '100%',
    height: 60,
    color: 'white'
    
  },
  roomId: {
    flex: 1,
    fontSize: 19,
    color: 'white'
  },
  description: {
    flex: 2,
    textAlign: 'center',
    right: -30,
    color: 'white'
  },
  level: {
    flex: 3,
    textAlign: 'right',
    right: 40,
    color: 'white'
  }
});
