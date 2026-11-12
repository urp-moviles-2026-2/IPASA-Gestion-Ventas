import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TiendaContext } from '../context/TiendaContext';

export default function CarritoScreen() {
  const { carrito, eliminarDelCarrito, confirmarPedido } = useContext(TiendaContext);
  const [cliente, setCliente] = useState('');

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const handleComprar = () => {
    if (carrito.length === 0) return;
    if (!cliente.trim()) {
      Alert.alert('Dato requerido', 'Ingresa el nombre del cliente o empresa para registrar la venta.');
      return;
    }

    confirmarPedido(cliente.trim());
    setCliente('');
    Alert.alert('¡Venta Registrada!', 'El pedido se guardó localmente y se actualizó el stock.');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={carrito}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={styles.vacioContainer}>
            <Ionicons name="cart-outline" size={64} color="#cbd5e1" />
            <Text style={styles.vacioTexto}>Tu carrito está vacío</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemNombre}>{item.nombre}</Text>
              <Text style={styles.itemDetalle}>
                {item.cantidad} x S/ {item.precio.toFixed(2)}
              </Text>
            </View>
            <Text style={styles.itemSubtotal}>
              S/ {(item.precio * item.cantidad).toFixed(2)}
            </Text>
            <TouchableOpacity onPress={() => eliminarDelCarrito(item.id)}>
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}
      />

      {carrito.length > 0 && (
        <View style={styles.footer}>
          <TextInput
            style={styles.inputCliente}
            placeholder="Nombre del Cliente / Empresa..."
            value={cliente}
            onChangeText={setCliente}
          />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total a Pagar:</Text>
            <Text style={styles.totalMonto}>S/ {total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.botonConfirmar} onPress={handleComprar}>
            <Text style={styles.textoConfirmar}>Registrar Venta</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  lista: { padding: 14, flexGrow: 1 },
  vacioContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  vacioTexto: { fontSize: 16, color: '#64748b', marginTop: 12 },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  itemInfo: { flex: 1 },
  itemNombre: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
  itemDetalle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  itemSubtotal: { fontSize: 15, fontWeight: 'bold', color: '#0284c7', marginRight: 12 },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputCliente: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 15,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  totalLabel: { fontSize: 16, fontWeight: '600', color: '#334155' },
  totalMonto: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  botonConfirmar: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoConfirmar: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
