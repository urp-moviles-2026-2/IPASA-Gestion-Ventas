import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PRODUCTOS_INICIALES } from '../data/productos';

export const TiendaContext = createContext();

export const TiendaProvider = ({ children }) => {
  const [productos, setProductos] = useState(PRODUCTOS_INICIALES);
  const [carrito, setCarrito] = useState([]);
  const [historialVentas, setHistorialVentas] = useState([]);

  // Cargar datos guardados en el dispositivo al abrir la app
  useEffect(() => {
    cargarDatosLocales();
  }, []);

  const cargarDatosLocales = async () => {
    try {
      const carritoGuardado = await AsyncStorage.getItem('@ipasa_carrito');
      const ventasGuardadas = await AsyncStorage.getItem('@ipasa_ventas');
      const productosGuardados = await AsyncStorage.getItem('@ipasa_productos');

      if (carritoGuardado) setCarrito(JSON.parse(carritoGuardado));
      if (ventasGuardadas) setHistorialVentas(JSON.parse(ventasGuardadas));
      if (productosGuardados) setProductos(JSON.parse(productosGuardados));
    } catch (error) {
      console.log('Error cargando almacenamiento local:', error);
    }
  };

  const guardarEnStorage = async (clave, valor) => {
    try {
      await AsyncStorage.setItem(clave, JSON.stringify(valor));
    } catch (error) {
      console.log('Error guardando datos:', error);
    }
  };

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find((item) => item.id === producto.id);
    let nuevoCarrito;

    if (existe) {
      if (existe.cantidad >= producto.stock) return false;
      nuevoCarrito = carrito.map((item) =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      );
    } else {
      nuevoCarrito = [...carrito, { ...producto, cantidad: 1 }];
    }

    setCarrito(nuevoCarrito);
    guardarEnStorage('@ipasa_carrito', nuevoCarrito);
    return true;
  };

  const eliminarDelCarrito = (id) => {
    const nuevoCarrito = carrito.filter((item) => item.id !== id);
    setCarrito(nuevoCarrito);
    guardarEnStorage('@ipasa_carrito', nuevoCarrito);
  };

  const confirmarPedido = (clienteNombre) => {
    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    const nuevaVenta = {
      id: Date.now().toString(),
      fecha: new Date().toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      cliente: clienteNombre || 'Cliente General',
      items: carrito,
      total,
    };

    // Descontar stock localmente
    const nuevosProductos = productos.map((prod) => {
      const comprado = carrito.find((item) => item.id === prod.id);
      return comprado ? { ...prod, stock: prod.stock - comprado.cantidad } : prod;
    });

    const nuevasVentas = [nuevaVenta, ...historialVentas];

    setProductos(nuevosProductos);
    setHistorialVentas(nuevasVentas);
    setCarrito([]);

    guardarEnStorage('@ipasa_productos', nuevosProductos);
    guardarEnStorage('@ipasa_ventas', nuevasVentas);
    guardarEnStorage('@ipasa_carrito', []);
  };

  const agregarNuevoProducto = (nuevoProd) => {
    const productoConId = {
      ...nuevoProd,
      id: Date.now().toString(),
      imagen:
        nuevoProd.imagen ||
        'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=500&q=80',
    };
    const listaActualizada = [productoConId, ...productos];
    setProductos(listaActualizada);
    guardarEnStorage('@ipasa_productos', listaActualizada);
  };

  return (
    <TiendaContext.Provider
      value={{
        productos,
        carrito,
        historialVentas,
        agregarAlCarrito,
        eliminarDelCarrito,
        confirmarPedido,
        agregarNuevoProducto,
      }}
    >
      {children}
    </TiendaContext.Provider>
  );
};
