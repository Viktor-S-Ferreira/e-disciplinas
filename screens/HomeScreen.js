import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Modal, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ route }) => {
  const { username } = route.params;
  const [disciplinas, setDisciplinas] = useState([]);
  const [selectedDisciplina, setSelectedDisciplina] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newDisciplina, setNewDisciplina] = useState({
    title: '',
    professor: '',
    horario: '',
    sala: ''
  });

  useEffect(() => {
    fetchUserDisciplinas();
  }, []);

  const fetchUserDisciplinas = async () => {
    try {
      const userData = await AsyncStorage.getItem(username);
      if (userData) {
        const user = JSON.parse(userData);
        setDisciplinas(user.disciplinas);
      }
    } catch (error) {
      console.error('Erro ao buscar disciplinas:', error);
    }
  };

  const handleInputChange = (name, value) => {
    setNewDisciplina({ ...newDisciplina, [name]: value });
  };

  const addDisciplina = async () => {
    if (!newDisciplina.title || !newDisciplina.professor || !newDisciplina.horario || !newDisciplina.sala) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    const newId = (disciplinas.length + 1).toString();
    const disciplinaToAdd = { ...newDisciplina, id: newId };
    const updatedDisciplinas = [...disciplinas, disciplinaToAdd];

    setDisciplinas(updatedDisciplinas);
    setAddModalVisible(false);
    setNewDisciplina({ title: '', professor: '', horario: '', sala: '' });

    // Atualizar disciplinas no AsyncStorage
    try {
      const userData = await AsyncStorage.getItem(username);
      if (userData) {
        const user = JSON.parse(userData);
        user.disciplinas = updatedDisciplinas;
        await AsyncStorage.setItem(username, JSON.stringify(user));
      }
    } catch (error) {
      console.error('Erro ao atualizar disciplinas:', error);
    }
  };

  const openModal = (disciplina) => {
    setSelectedDisciplina(disciplina);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDisciplina(null);
  };

  const openAddModal = () => {
    setAddModalVisible(true);
  };

  const closeAddModal = () => {
    setAddModalVisible(false);
    setNewDisciplina({ title: '', professor: '', horario: '', sala: '' });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={disciplinas}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => openModal(item)}>
            <Text style={styles.text}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Adicionar Disciplina" onPress={openAddModal} />
      {selectedDisciplina && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Disciplina: {selectedDisciplina.title}</Text>
              <Text style={styles.modalText}>Professor: {selectedDisciplina.professor}</Text>
              <Text style={styles.modalText}>Horário: {selectedDisciplina.horario}</Text>
              <Text style={styles.modalText}>Sala: {selectedDisciplina.sala}</Text>
              <Button title="Fechar" onPress={closeModal} />
            </View>
          </View>
        </Modal>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={closeAddModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Adicionar Disciplina</Text>
            <TextInput
              style={styles.input}
              placeholder="Título"
              value={newDisciplina.title}
              onChangeText={value => handleInputChange('title', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Professor"
              value={newDisciplina.professor}
              onChangeText={value => handleInputChange('professor', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Horário"
              value={newDisciplina.horario}
              onChangeText={value => handleInputChange('horario', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Sala"
              value={newDisciplina.sala}
              onChangeText={value => handleInputChange('sala', value)}
            />
            <Button title="Salvar" onPress={addDisciplina} />
            <Button title="Cancelar" onPress={closeAddModal} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  text: {
    fontSize: 24,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#ddd',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    width: 200,
  },
});

export default HomeScreen;
