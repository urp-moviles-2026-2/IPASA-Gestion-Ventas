import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TiendaContext } from '../context/TiendaContext';

export default function CatalogoScreen() {
  const { productos, agregarAlCarrito } = useContext(TiendaContext);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  const categorias = ['Todas', 'Válvulas', 'Instrumentación', 'Bombeo', 'Tuberías'];

  const productosFiltrados = productos.filter((prod) => {
    const coincideTexto =
      prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      prod.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoriaSeleccionada === 'Todas' || prod.categoria === categoriaSeleccionada;
    return coincideTexto && coincideCategoria;
  });

  const handleAgregar = (producto) => {
    if (producto.stock <= 0) {
      Alert.alert('Sin Stock', 'Este producto se encuentra agotado.');
      return;
    }
    const agregado = agregarAlCarrito(producto);
    if (agregado) {
      Alert.alert('¡Agregado!', `${producto.nombre} se añadió al carrito.`);
    } else {
      Alert.alert('Límite alcanzado', 'No hay más unidades disponibles en stock.');
    }
  };

  const renderProducto = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imagen }} style={styles.imagen} />
      <View style={styles.info}>
        <View style={styles.filaSuperior}>
          <Text style={styles.categoria}>{item.categoria}</Text>
          <Text style={[styles.stock, item.stock === 0 && styles.sinStock]}>
            Stock: {item.stock}
          </Text>
        </View>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.descripcion} numberOfLines={2}>
          {item.descripcion}
        </Text>
        <View style={styles.filaInferior}>
          <Text style={styles.precio}>S/ {item.precio.toFixed(2)}</Text>
          <TouchableOpacity
            style={[styles.botonAgregar, item.stock === 0 && styles.botonDeshabilitado]}
            onPress={() => handleAgregar(item)}
            disabled={item.stock === 0}
          >
            <Ionicons name="cart-outline" size={18} color="#fff" />
            <Text style={styles.textoBoton}>Agregar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Buscador */}
      <View style={styles.buscadorContainer}>
        <Ionicons name="search-outline" size={20} color="#64748b" />
        <TextInput
          style={styles.input}
          placeholder="Buscar productos IPASA..."
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {/* Filtros por categoría */}
      <View style={styles.categoriasContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categorias}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.chip,
                categoriaSeleccionada === item && styles.chipActivo,
              ]}
              onPress={() => setCategoriaSeleccionada(item)}
            >
              <Text
                style={[
                  styles.chipTexto,
                  categoriaSeleccionada === item && styles.chipTextoActivo,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Lista de productos */}
      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderProducto}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.vacio}>No se encontraron productos.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  buscadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    elevation: 2,
  },
  input: { flex: 1, paddingVertical: 10, marginLeft: 8, fontSize: 15 },
  categoriasContainer: { paddingHorizontal: 12, marginBottom: 8 },
  chip: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  chipActivo: { backgroundColor: '#0f172a' },
  chipTexto: { color: '#334155', fontWeight: '600', fontSize: 13 },
  chipTextoActivo: { color: '#fff' },
  lista: { paddingHorizontal: 12, paddingBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 3,
  },
  imagen: { width: '100%', height: 150, backgroundColor: '#cbd5e1' },
  info: { padding: 14 },
  filaSuperior: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  categoria: { fontSize: 12, fontWeight: '700', color: '#0284c7', textTransform: 'uppercase' },
  stock: { fontSize: 12, fontWeight: '600', color: '#16a34a' },
  sinStock: { color: '#dc2626' },
  nombre: { fontSize: 17, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
  descripcion: { fontSize: 13, color: '#64748b', marginBottom: 12 },
  filaInferior: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  precio: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  botonAgregar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284c7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  botonDeshabilitado: { backgroundColor: '#94a3b8' },
  textoBoton: { color: '#fff', fontWeight: 'bold', marginLeft: 6 },
  vacio: { textAlign: 'center', marginTop: 40, color: '#64748b', fontSize: 15 },
});
