import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { TiendaProvider, TiendaContext } from './src/context/TiendaContext';
import CatalogoScreen from './src/screens/CatalogoScreen';
import CarritoScreen from './src/screens/CarritoScreen';
import GestionScreen from './src/screens/GestionScreen';

const Tab = createBottomTabNavigator();

function NavegacionPrincipal() {
  const { carrito } = useContext(TiendaContext);
  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: '#0f172a' },
          headerTintColor: '#fff',
          tabBarActiveTintColor: '#0284c7',
          tabBarInactiveTintColor: '#64748b',
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Catálogo') iconName = 'grid-outline';
            else if (route.name === 'Carrito') iconName = 'cart-outline';
            else if (route.name === 'Gestión') iconName = 'briefcase-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Catálogo"
          component={CatalogoScreen}
          options={{ title: 'IPASA - Catálogo' }}
        />
        <Tab.Screen
          name="Carrito"
          component={CarritoScreen}
          options={{
            title: 'Carrito de Venta',
            tabBarBadge: cantidadTotal > 0 ? cantidadTotal : null,
          }}
        />
        <Tab.Screen
          name="Gestión"
          component={GestionScreen}
          options={{ title: 'Inventario y Ventas' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <TiendaProvider>
      <NavegacionPrincipal />
    </TiendaProvider>
  );
}
