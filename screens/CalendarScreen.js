//CalendarScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CalendarScreen = ({ route }) => {
  const { username } = route.params;
  const [disciplinas, setDisciplinas] = useState([]);

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

  const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

  const renderDay = (day) => {
    const disciplinasForDay = disciplinas.filter(disciplina =>
      disciplina.horarios.some(horario => horario.day === day)
    );

    return (
      <View style={styles.dayContainer}>
        <Text style={styles.dayHeader}>{day}</Text>
        {disciplinasForDay.length > 0 ? (
          disciplinasForDay.map((disciplina, index) => (
            <View key={index} style={styles.disciplinaContainer}>
              <Text style={styles.disciplinaTitle}>{disciplina.title}</Text>
              {disciplina.horarios.filter(horario => horario.day === day).map((horario, idx) => (
                <Text key={idx} style={styles.horarioText}>{horario.time}</Text>
              ))}
            </View>
          ))
        ) : (
          <Text style={styles.noDisciplinasText}>Nenhuma disciplina neste dia.</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={daysOfWeek}
        keyExtractor={item => item}
        renderItem={({ item }) => renderDay(item)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  dayContainer: {
    marginBottom: 20,
  },
  dayHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  disciplinaContainer: {
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 5,
  },
  disciplinaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  horarioText: {
    fontSize: 16,
  },
  noDisciplinasText: {
    fontStyle: 'italic',
    marginLeft: 10,
    color: '#777',
  },
});

export default CalendarScreen;
