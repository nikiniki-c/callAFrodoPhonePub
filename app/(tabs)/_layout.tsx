import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Entypo } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#538569', headerShown: false }}>
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoriten',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="heart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="keyPad"
        options={{
          title: 'KeyPad',
          tabBarIcon: ({ color }) => <Entypo size={28} name="dial-pad" color={color} />,
        }}
      />
    </Tabs>
  );
}
