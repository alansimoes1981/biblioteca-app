import React, { useState, useRef } from 'react';
import { Button, Center, AlertDialog, Text, Box } from 'native-base';

interface IDeleteModal {
  isOpen: boolean;
  closeModal: () => void;
  handleDelete: () => void;
  loadingDelete: boolean;
}

const DeleteModal = ({ isOpen, closeModal, handleDelete, loadingDelete }: IDeleteModal) => {
  const cancelRef = useRef(null);

  return (
    <Center flex={1}>
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={closeModal}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header backgroundColor={'orange.400'} color={'white'}>
            Confirmar Deleção
          </AlertDialog.Header>
          <AlertDialog.Body>
            Tem certeza de que deseja deletar este item? Esta ação não pode ser desfeita.
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={closeModal}
                ref={cancelRef}>
                Cancelar
              </Button>
              <Button onPress={handleDelete} isLoading={loadingDelete}>
                Confirmar
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
  );
};

export default DeleteModal;
