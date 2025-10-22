// PaginaDados.js
import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,

} from 'react-native';
import { styles } from './styles';

export default function PaginaDados({ route }) {
  const carrinho = route.params?.carrinho || [];

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [troco, setTroco] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [bairro, setBairro] = useState('');

  const formas = ['Cartão', 'Pix', 'Dinheiro'];

  const bairros = [
    { nome: 'Banco de Areia', taxa: 5 },
    { nome: 'BNH', taxa: 5 },
    { nome: 'Rocha Sobrinho', taxa: 4 },
    { nome: 'Jaqueira', taxa: 2 },
    { nome: 'Vila Norma', taxa: 5 },
    { nome: 'Vila Emil', taxa: 6 },
    { nome: 'Santo Elias', taxa: 6 },
    { nome: 'Jacutinga', taxa: 5 },
    { nome: 'Cosmorama', taxa: 6 },
    { nome: 'Meu bairro não aparece', taxa: 0 },
  ];

  const subtotalSalgados = useMemo(() => {
    return carrinho.reduce(
      (sum, item) => sum + item.quantidade * (item.tipo === 'fritos' ? 4.0 : 3.5),
      0
    );
  }, [carrinho]);

  const taxa = bairros.find((b) => b.nome === bairro)?.taxa || 0;
  const totalComTaxa = subtotalSalgados + taxa;

  const handlePagamento = (forma) => {
    setFormaPagamento(forma);
    if (forma !== 'Dinheiro') setTroco('');
  };

  const finalizarPedido = () => {
    const camposFaltando = [];
    if (!nome) camposFaltando.push('Nome');
    if (!telefone) camposFaltando.push('Telefone');
    if (!endereco) camposFaltando.push('Endereço');
    if (!bairro) camposFaltando.push('Bairro');
    if (!formaPagamento) camposFaltando.push('Forma de Pagamento');
    if (formaPagamento === 'Dinheiro' && !troco) camposFaltando.push('Troco');

    if (camposFaltando.length > 0) {
      Alert.alert('Campos faltando', camposFaltando.join('\n'));
      return;
    }

    let mensagem = `*Pedido de ${nome}*\n\n`;
    mensagem += `Telefone: ${telefone}\nEndereço: ${endereco}\nBairro: ${bairro}\nForma de Pagamento: ${formaPagamento}\n`;
    if (formaPagamento === 'Dinheiro' && troco) mensagem += `Troco para: R$ ${troco}\n`;
    mensagem += `\n*Itens do pedido:*\n`;
    carrinho.forEach((item) => {
      if (item.quantidade > 0) mensagem += `- ${item.id} (${item.tipo}) x ${item.quantidade}\n`;
    });
    mensagem += `\nSubtotal: R$ ${subtotalSalgados.toFixed(2)}\n`;
    mensagem += bairro === 'Meu bairro não aparece' ? 'Verificar a taxa:\n' : `Taxa do bairro: R$ ${taxa.toFixed(2)}\n`;
    mensagem += `*Total: R$ ${totalComTaxa.toFixed(2)}*`;

    const numeroWhats = '5521973598731';
    const url = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(mensagem)}`;
    Linking.openURL(url).catch(() => Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.'));
  };

  // Bairro Selector Modal interno
  const BairroSelector = ({ bairro, setBairro, bairros }) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
      <View style={{ marginBottom: 12 }}>
        <Text style={styles.label}>Escolha o seu bairro:</Text>
        <TouchableOpacity
          style={styles.pickerFake}
          onPress={() => setModalVisible(true)}
        >
          <Text>{bairro || 'Selecione um bairro'}</Text>
        </TouchableOpacity>

        {modalVisible && (
          <View style={styles.modalBg}>
            <View style={styles.modalContainerScroll}>
              <ScrollView>
                {bairros.map((item) => (
                  <TouchableOpacity
                    key={item.nome}
                    style={styles.modalItem}
                    onPress={() => {
                      setBairro(item.nome);
                      setModalVisible(false);
                    }}
                  >
                    <Text>{item.nome}{item.taxa === 0 ? ' - verificar valor' : ''}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={[styles.modalItem, { backgroundColor: '#eee', marginTop: 10 }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ textAlign: 'center' }}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.pageContainer}>
        <Text style={styles.pageTitle}>Informações do Pedido</Text>

        <Text style={styles.label}>Nome:</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome completo" />

        <Text style={styles.label}>Telefone:</Text>
        <TextInput
          style={styles.input}
          value={telefone}
          onChangeText={(t) => setTelefone(t.replace(/\D/g, ''))}
          placeholder="(99) 99999-9999"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Endereço completo:</Text>
        <TextInput style={styles.input} value={endereco} onChangeText={setEndereco} placeholder="Rua, Nº, Bloco, Apto" />

        <BairroSelector bairro={bairro} setBairro={setBairro} bairros={bairros} />

        <Text style={styles.label}>Forma de Pagamento:</Text>
        <View style={styles.paymentButtons}>
          {formas.map((forma) => (
            <TouchableOpacity
              key={forma}
              style={[styles.pill, formaPagamento === forma && styles.pillSelected]}
              onPress={() => handlePagamento(forma)}
            >
              <Text style={formaPagamento === forma ? styles.pillSelectedText : styles.pillText}>{forma}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {formaPagamento === 'Dinheiro' && (
          <>
            <Text style={styles.label}>Troco para quanto?</Text>
            <TextInput
              style={styles.input}
              value={troco}
              onChangeText={(t) => setTroco(t.replace(/\D/g, ''))}
              keyboardType="numeric"
            />
          </>
        )}

        <View style={styles.totalBox}>
          <Text style={styles.totalText}>Total: R$ {totalComTaxa.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={finalizarPedido}>
          <Text style={styles.primaryBtnText}>Finalizar Pedido</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
