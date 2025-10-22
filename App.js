import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PaginaSabores from './components/PaginaSabores';
import PaginaDados from './components/PaginaDados';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={PaginaSabores} />
        <Stack.Screen name="Dados" component={PaginaDados} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
