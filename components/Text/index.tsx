import React from 'react';
import { Text as TextReactNative, TextStyle, StyleSheet } from 'react-native';

interface TextProps {
  children: React.ReactNode; // Conteúdo do texto
  style?: TextStyle; // Estilos personalizados
  size?: number; // Tamanho da fonte
  color?: string; // Cor do texto
  weight?: 'normal' | 'bold'; // Peso da fonte
}

const Text: React.FC<TextProps> = ({
  children,
  style,
  size = 14, // Tamanho padrão
  color = '#000', // Cor padrão
  weight = 'normal', // Peso padrão
}) => {
  const textStyle = {
    fontSize: size,
    color: color,
    fontWeight: weight,
  };

  return <TextReactNative style={[textStyle, style]}>{children}</TextReactNative>;
};

export default Text;
