import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'navigation';

export type ScreenNavigationProps = StackNavigationProp<RootStackParamList>;

export type SreenRouteProp = RouteProp<RootStackParamList>;
