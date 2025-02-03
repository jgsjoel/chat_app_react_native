import React, { useEffect, useState } from 'react'
import { Alert, View, AppState, TouchableOpacity, Text, TextInput } from 'react-native'
import { supabase } from '~/services/superbase'
import { Link } from 'expo-router'

export default function Auth() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => subscription.remove();
  }, []);

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  return (
    <View className='flex-1 p-4 justify-center items-center'>
      <View className='flex-col items-start w-full'>
        <Text className='font-bold text-3xl'>Welcome Back!</Text>
        <Text className='font-light text-3xl'>Login</Text>
      </View>
      <View className='w-full mt-10'>
        <TextInput
          className='border border-gray-500 py-4 rounded-lg p-4'
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View className='w-full mt-3'>
        <TextInput
          className='border border-gray-500 py-4 rounded-lg p-4'
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <TouchableOpacity onPress={() => signInWithEmail()} className='p-3 mt-4 text-white w-full bg-black rounded-lg' disabled={loading}>
        <Text className='text-white text-lg text-center'>SIGN IN</Text>
      </TouchableOpacity>
      <View className='mt-4 flex-row'>
        <Text className='font-normal'>Don't have an account? </Text>
        <Link href={"/register"}>
          <Text className='font-bold'>Sign Up</Text>
        </Link>
      </View>
    </View>
  )
}