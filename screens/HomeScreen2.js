import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// Exemplo de eventos. Você pode carregar isso de um banco de dados SQLite.
const events = [
  { id: 1, description: 'Matemática', day: '2024-07-01', startHour: 9, endHour: 10 },
  { id: 2, description: 'Física', day: '2024-07-02', startHour: 11, endHour: 12 },
  { id: 3, description: 'Química', day: '2024-07-03', startHour: 14, endHour: 15 },
  // Adicione mais eventos aqui
];

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const WeeklyCalendar = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {daysOfWeek.map((day, index) => (
          <View key={index} style={styles.headerCell}>
            <Text style={styles.headerText}>{day}</Text>
          </View>
        ))}
      </View>
      <View style={styles.body}>
        {[...Array(24).keys()].map(hour => (
          <View key={hour} style={styles.row}>
            <View style={styles.hourCell}>
              <Text style={styles.hourText}>{hour}:00</Text>
            </View>
            {daysOfWeek.map((day, index) => (
              <View key={index} style={styles.cell}>
                {events
                  .filter(event => new Date(event.day).getDay() === index && event.startHour === hour)
                  .map(event => (
                    <View key={event.id} style={styles.event}>
                      <Text style={styles.eventText}>{event.description}</Text>
                    </View>
                  ))}
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: '#f0f0f0',
  },
  headerCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#ddd',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  body: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    height: 60,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  hourCell: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#ddd',
  },
  hourText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cell: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: '#ddd',
  },
  event: {
    backgroundColor: '#50cebb',
    margin: 2,
    borderRadius: 4,
    padding: 4,
  },
  eventText: {
    color: '#fff',
  },
});

export default WeeklyCalendar;
