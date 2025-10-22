import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { styles } from './styles';

const logo = require('../assets/logo.png');

const SABORES_INICIAIS = [
  { id: 'Queijo', tipo: 'fritos' },
  { id: 'Queijo com Alho', tipo: 'fritos' },
  { id: 'Kibe', tipo: 'fritos' },
  { id: 'Bacon c/ Cheddar', tipo: 'fritos' },
  { id: 'Coxinha', tipo: 'fritos' },
  { id: 'Salsicha', tipo: 'fritos' },
  { id: 'Calabresa', tipo: 'fritos' },
  { id: 'Queijo c/ Presunto', tipo: 'fritos' },
];

export default function PaginaSabores({ navigation }) {
  const [pedido, setPedido] = useState(
    SABORES_INICIAIS.map((sabor) => ({ ...sabor, quantidade: 0 }))
  );

  const alterarTipo = (index, tipo) => {
    const novo = [...pedido];
    novo[index].tipo = tipo;
    setPedido(novo);
  };

  const alterarQuantidade = (index, quantidade) => {
    if (quantidade < 0) quantidade = 0;
    const novo = [...pedido];
    novo[index].quantidade = quantidade;
    setPedido(novo);
  };

  const totalPedido = useMemo(() => {
    return pedido.reduce((sum, item) => sum + item.quantidade * (item.tipo === 'fritos' ? 4.0 : 3.5), 0);
  }, [pedido]);

  const irParaDados = () => {
    const totalUnidades = pedido.reduce((s, it) => s + it.quantidade, 0);
    if (totalUnidades < 3) {
      Alert.alert('Atenção', 'O pedido mínimo é de 3 porções!');
      return;
    }
    navigation.navigate('Dados', { carrinho: pedido });
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{item.id}</Text>
        <Text style={styles.subtotal}>R$ {(item.quantidade * (item.tipo === 'fritos' ? 4.0 : 3.5)).toFixed(2)}</Text>
      </View>

      <View style={[styles.row, styles.tipoQtd]}>
        <View style={styles.tipoBlock}>
          <Text style={styles.label}>Tipo:</Text>
          <View style={styles.pillsRow}>
            <TouchableOpacity
              style={[styles.pill, item.tipo === 'fritos' && styles.pillSelected]}
              onPress={() => alterarTipo(index, 'fritos')}
            >
              <Text style={item.tipo === 'fritos' ? styles.pillSelectedText : styles.pillText}>Fritos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pill, item.tipo === 'congelados' && styles.pillSelected]}
              onPress={() => alterarTipo(index, 'congelados')}
            >
              <Text style={item.tipo === 'congelados' ? styles.pillSelectedText : styles.pillText}>Congelados</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.qtdBlock}>
          <Text style={styles.label}>Quantidade:</Text>
          <View style={styles.qtdButtons}>
            <TouchableOpacity style={styles.qbtn} onPress={() => alterarQuantidade(index, item.quantidade - 1)}>
              <Text style={styles.qbtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtext}>{item.quantidade}</Text>
            <TouchableOpacity style={styles.qbtn} onPress={() => alterarQuantidade(index, item.quantidade + 1)}>
              <Text style={styles.qbtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.pageContainer}>
        <View style={styles.logoTop}>
          <Image source={logo} style={styles.logo} resizeMode="stretch" />
        </View>

        <Text style={styles.pageTitle}>Joana Salgados!</Text>
        <Text style={styles.infoPorcao}>Cada quantidade equivale a uma porção de 10 unidades de salgadinhos (~14g cada)</Text>

        <FlatList
          data={pedido}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          scrollEnabled={false}
        />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>R$ {totalPedido.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={irParaDados}>
          <Text style={styles.primaryBtnText}>Confirmar Sabores</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
