import React, { useState } from 'react';
import { Box, Input, Button, Modal, VStack } from 'native-base';
import { Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs'; // Para formatar a data

const DateInput = () => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [formattedDate, setFormattedDate] = useState(dayjs(date).format('DD/MM/YYYY'));

  const handleChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
    setFormattedDate(dayjs(currentDate).format('DD/MM/YYYY'));
  };

  return (
    <Box>
      <VStack space={4}>
        <Input
          isReadOnly
          value={formattedDate}
          placeholder="Selecione a data"
          onPressIn={() => setShowPicker(true)}
        />

        {Platform.OS === 'ios' && (
          <Modal isOpen={showPicker} onClose={() => setShowPicker(false)} size="md">
            <Modal.Content>
              <Modal.Header>Selecionar Data</Modal.Header>
              <Modal.Body>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={handleChange}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button onPress={() => setShowPicker(false)}>Confirmar</Button>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        )}

        {Platform.OS === 'android' && showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event: any, selectedDate) => {
              setShowPicker(false);
              handleChange(event, selectedDate);
            }}
          />
        )}
      </VStack>
    </Box>
  );
};

export default DateInput;
