import { HStack, useToast, VStack } from "native-base";
import { useRoute } from '@react-navigation/native';
import { Share } from "react-native";

import { Header } from "../components/Header";
import React, { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { PoolPros } from '../components/PoolCard';
import { Guesses } from '../components/Guesses';

import { api } from "../services/api";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { EmptyRakingList } from "../components/EmptyRakingList";
{ }

interface RouteParams {
  id: string;
}

export function Details() {
  const [isLoading, setIsLoading] = useState(true);
  const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>('guesses');
  const [poolDetails, setPoolDetails] = useState<PoolPros>({} as PoolPros);
  const route = useRoute();
  const toast = useToast();
  const { id } = route.params as RouteParams;

  async function fetchPoolDetails() {
    try {
      setIsLoading(true);

      const response = await api.get(`/pools/${id}`)
      setPoolDetails(response.data.pool)

    } catch (err) {
      console.log(err);
      toast.show({
        title: 'Não foi possível carregar os detalhes do bolão',
        placement: 'top',
        bgColor: 'red.500'
      })
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: poolDetails.code
    })
  }

  useEffect(() => {
    fetchPoolDetails();
  }, [id])

  if (isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title={poolDetails.title} showBackButton showShareButton onShare={handleCodeShare} />
      {
        poolDetails._count?.participents > 0 ?
          <VStack px={5} flex={1}>
            <PoolHeader
              data={poolDetails}
            />

            <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
              <Option
                title="Seus palpites"
                isSelected={optionSelected === 'guesses'}
                onPress={() => setOptionSelected('guesses')}
              />
              <Option
                title="Ranking do grupo"
                isSelected={optionSelected === 'ranking'}
                onPress={() => setOptionSelected('ranking')}
              />
            </HStack>

            {
              optionSelected === 'guesses' ?
                <Guesses
                  poolId={poolDetails.id}
                  code={poolDetails.code}
                />
                :
                <EmptyRakingList />
            }

          </VStack>
          :
          <EmptyMyPoolList code={poolDetails.code} />
      }
    </VStack>
  )
}