import { useNavigation } from '@react-navigation/native';
import { Row, Text, Pressable } from 'native-base';

export function EmptyPoolList() {
  const { navigate } = useNavigation();

  return (
    <Row flexWrap="wrap" justifyContent="center">
      <Text color="white" fontSize="sm" textAlign="center">
        Você ainda não está participando de {'\n'} nenhum bolão, que tal
        <Pressable onPress={() => navigate('find')}>
          <Text textDecorationLine="underline" color="yellow.500" textDecoration="underline">
            {'\n'} buscar um por código
          </Text>
        </Pressable>
        <Text color="white" fontSize="sm" textAlign="center" mx={1}>
          {'\n'} ou
        </Text>

        <Pressable onPress={() => navigate('new')}>
          <Text textDecorationLine="underline" color="yellow.500">
            {'\n'} criar um novo
          </Text>
        </Pressable>

        <Text color="white" fontSize="sm" textAlign="center">
          ?
        </Text>
      </Text>
    </Row>
  );
}