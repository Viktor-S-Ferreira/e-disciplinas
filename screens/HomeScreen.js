// HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Modal, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FloatingButton from './FloatingButton';

const HomeScreen = ({ navigation, route }) => {
  const { username } = route.params;
  const [disciplinas, setDisciplinas] = useState([]);
  const [selectedDisciplina, setSelectedDisciplina] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [newDisciplina, setNewDisciplina] = useState({
    title: '',
    professor: '',
    aulasSemanais: 0,
    sala: '',
    horarios: []
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

  const handleContinue = () => {
    if (!newDisciplina.title || !newDisciplina.professor || newDisciplina.aulasSemanais === 0 || !newDisciplina.sala) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }
    const horarios = Array.from({ length: newDisciplina.aulasSemanais }, () => ({ day: '', time: '' }));
    setNewDisciplina({ ...newDisciplina, horarios });
    setAddModalVisible(false);
    setScheduleModalVisible(true);
  };

  const handleFinalSave = async () => {
    const horarios = newDisciplina.horarios;
    if (horarios.some(horario => !horario.day || !horario.time)) {
      Alert.alert('Erro', 'Todos os dias e horários são obrigatórios');
      return;
    }

    const newId = (disciplinas.length + 1).toString();
    const disciplinaToAdd = {
      ...newDisciplina,
      id: newId,
    };

    const updatedDisciplinas = [...disciplinas, disciplinaToAdd];

    setDisciplinas(updatedDisciplinas);
    setScheduleModalVisible(false);
    setNewDisciplina({ title: '', professor: '', aulasSemanais: 0, sala: '', horarios: [] });

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
    setNewDisciplina({ title: '', professor: '', aulasSemanais: 0, sala: '', horarios: [] });
  };

  const closeScheduleModal = () => {
    setScheduleModalVisible(false);
    setNewDisciplina({ title: '', professor: '', aulasSemanais: 0, sala: '', horarios: [] });
  };

  const handleCalendarPress = () => {
    navigation.navigate('Calendar', { username });
  };

  const daysOfWeek = [
    { key: 'sun', label: 'Domingo' },
    { key: 'mon', label: 'Segunda-feira' },
    { key: 'tue', label: 'Terça-feira' },
    { key: 'wed', label: 'Quarta-feira' },
    { key: 'thu', label: 'Quinta-feira' },
    { key: 'fri', label: 'Sexta-feira' },
    { key: 'sat', label: 'Sábado' },
  ];

  const handleDayChange = (index, day) => {
    const updatedHorarios = [...newDisciplina.horarios];
    updatedHorarios[index].day = day;
    setNewDisciplina({ ...newDisciplina, horarios: updatedHorarios });
  };

  const handleTimeChange = (index, time) => {
    const updatedHorarios = [...newDisciplina.horarios];
    updatedHorarios[index].time = time;
    setNewDisciplina({ ...newDisciplina, horarios: updatedHorarios });
  };

  const handleDeleteDisciplina = async (id) => {
    const updatedDisciplinas = disciplinas.filter(disciplina => disciplina.id !== id);
    setDisciplinas(updatedDisciplinas);

    try {
      const userData = await AsyncStorage.getItem(username);
      if (userData) {
        const user = JSON.parse(userData);
        user.disciplinas = updatedDisciplinas;
        await AsyncStorage.setItem(username, JSON.stringify(user));
      }
    } catch (error) {
      console.error('Erro ao deletar disciplina:', error);
    }

    closeModal(); // Fechar o modal após deletar a disciplina
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
              <Text style={styles.modalText}>Aulas Semanais: {selectedDisciplina.aulasSemanais}</Text>
              <Text style={styles.modalText}>Sala: {selectedDisciplina.sala}</Text>
              {selectedDisciplina.horarios.map((horario, index) => (
                <Text key={index} style={styles.modalText}>
                  {`Dia ${horario.day} às ${horario.time}`}
                </Text>
              ))}
              <Button title="Fechar" onPress={closeModal} />
              <TouchableOpacity onPress={() => handleDeleteDisciplina(selectedDisciplina.id)}>
                <Text style={{ color: 'red', fontSize: 18, marginTop: 10 }}>Deletar Disciplina</Text>
              </TouchableOpacity>
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
              placeholder="Número de aulas semanais"
              keyboardType="numeric"
              value={newDisciplina.aulasSemanais.toString()}
              onChangeText={value => handleInputChange('aulasSemanais', parseInt(value) || 0)}
            />
            <TextInput
              style={styles.input}
              placeholder="Sala"
              value={newDisciplina.sala}
              onChangeText={value => handleInputChange('sala', value)}
            />
            <View style={styles.buttonContainer}>
              <Button title="Continuar" onPress={handleContinue} />
              <View style={styles.buttonSpacer} />
              <Button title="Cancelar" onPress={closeAddModal} color="red" />
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={scheduleModalVisible}
        onRequestClose={closeScheduleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Horários das Aulas</Text>
            {newDisciplina.horarios.map((horario, index) => (
              <View key={index} style={{ marginVertical: 10 }}>
                <Text style={styles.modalText}>{`Aula ${index + 1}`}</Text>
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Dia:</Text>
                  <FlatList
                    horizontal
                    data={daysOfWeek}
                    keyExtractor={item => item.key}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[styles.dayButton, { backgroundColor: horario.day === item.label ? '#4CAF50' : '#DDDDDD' }]}
                        onPress={() => handleDayChange(index, item.label)}
                      >
                        <Text style={{ color: 'white' }}>{item.label.slice(0, 3)}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Horário (ex: 14:00)"
                  value={horario.time}
                  onChangeText={value => handleTimeChange(index, value)}
                />
              </View>
            ))}
            <View style={styles.buttonContainer}>
              <Button title="Salvar" onPress={handleFinalSave} />
              <View style={styles.buttonSpacer} />
              <Button title="Cancelar" onPress={closeScheduleModal} color="red" />
            </View>
          </View>
        </View>
      </Modal>
      <FloatingButton onPress={openAddModal} />
      <Button title="Ver Calendário" onPress={handleCalendarPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  item: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginVertical: 5,
  },
  text: {
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 300,
  },
  modalText: {
    marginBottom: 10,
    fontSize: 18,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    minWidth: 250,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  buttonSpacer: {
    width: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputLabel: {
    marginRight: 10,
    fontSize: 18,
  },
  dayButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 10,
  },
});

export default HomeScreen;
