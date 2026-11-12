import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { TiendaContext } from '../context/TiendaContext';

export default function GestionScreen() {
  const { agregarNuevoProducto, historialVentas } = useContext(TiendaContext);
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('Válvulas');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleGuardarProducto = () => {
    if (!nombre.trim() || !precio || !stock) {
      Alert.alert('Campos incompletos', 'Completa nombre, precio y stock.');
      return;
    }

    agregarNuevoProducto({
      nombre: nombre.trim(),
      categoria,
      precio: parseFloat(precio),
      stock: parseInt(stock, 10),
      descripcion: descripcion.trim() || 'Producto industrial IPASA.',
    });

    setNombre('');
    setPrecio('');
    setStock('');
    setDescripcion('');
    Alert.alert('¡Éxito!', 'Producto registrado en el inventario local.');
  };

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ padding: 14 }}
      ListHeaderComponent={
        <View style={styles.formCard}>
          <Text style={styles.titulo}>Registrar Nuevo Producto</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del producto"
            value={nombre}
            onChangeText={setNombre}
          />
          <TextInput
            style={styles.input}
            placeholder="Categoría (Válvulas, Bombeo, Tuberías...)"
            value={categoria}
            onChangeText={setCategoria}
          />
          <View style={styles.filaDoble}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              placeholder="Precio (S/)"
              keyboardType="numeric"
              value={precio}
              onChangeText={setPrecio}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Stock inicial"
              keyboardType="numeric"
              value={stock}
              onChangeText={setStock}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Descripción breve"
            value={descripcion}
            onChangeText={setDescripcion}
          />
          <TouchableOpacity style={styles.boton} onPress={handleGuardarProducto}>
            <Text style={styles.botonTexto}>Guardar Producto</Text>
          </TouchableOpacity>

          <Text style={[styles.titulo, { marginTop: 24 }]}>
            Historial de Ventas ({historialVentas.length})
          </Text>
        </View>
      }
      data={historialVentas}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <Text style={styles.vacio}>Aún no se han registrado ventas.</Text>
      }
      renderItem={({ item }) => (
        <View style={styles.ventaCard}>
          <View style={styles.ventaHeader}>
            <Text style={styles.ventaCliente}>{item.cliente}</Text>
            <Text style={styles.ventaTotal}>S/ {item.total.toFixed(2)}</Text>
          </View>
          <Text style={styles.ventaFecha}>{item.fecha}</Text>
          <Text style={styles.ventaItems}>
            {item.items.map((i) => `${i.cantidad}x ${i.nombre}`).join(', ')}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  formCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  titulo: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  filaDoble: { flexDirection: 'row' },
  boton: {
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  botonTexto: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  vacio: { textAlign: 'center', color: '#64748b', marginTop: 10 },
  ventaCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
  },
  ventaHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  ventaCliente: { fontWeight: 'bold', fontSize: 15, color: '#0f172a' },
  ventaTotal: { fontWeight: 'bold', fontSize: 15, color: '#16a34a' },
  ventaFecha: { fontSize: 12, color: '#64748b', marginVertical: 2 },
  ventaItems: { fontSize: 13, color: '#334155', marginTop: 4 },
});
