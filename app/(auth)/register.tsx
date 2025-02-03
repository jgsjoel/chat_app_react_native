import React, { useState } from 'react'
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { supabase } from '~/services/superbase'
import { Link } from 'expo-router'

export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)

    async function validateFields() {
        if (!email || !password || !username) {
            Alert.alert('Warning', 'All fields are required');
            return false;
        }
        await checkUserName();
    }

    async function checkUserName() {
        const { data, error } = await supabase.from("profiles").select("*").eq("username", username).single();
        if (data) {
            alert("User with same email already exist!")
        } else {
            signUpWithEmail();
        }
    }

    async function updateUserName(userId: string) {
        const { error } = await supabase
            .from('profiles')
            .update({ username })
            .eq("id", userId);

        if (error) {
            console.error("Error updating username:", error);
        } else {
            console.log("Username updated successfully");
        }
    }

    async function signUpWithEmail() {
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            Alert.alert(error.message);
            setLoading(false);
            return;
        }

        const userId = data?.user?.id;
        if (userId) {
            await updateUserName(userId);
        }

        setLoading(false);
    }


    return (
        <View className='flex-1 p-4 justify-center items-center'>
            <View className='flex-col items-start w-full'>
                <Text className='font-bold text-3xl'>Register To Continue!</Text>
                <Text className='font-light text-3xl'>Register</Text>
            </View>
            <View className='w-full mt-10'>
                <TextInput
                    className='border border-gray-500 py-4 rounded-lg p-4'
                    onChangeText={(text) => setUsername(text)}
                    value={username}
                    placeholder="Enter user name..."
                    autoCapitalize={'none'}
                />
            </View>
            <View className='w-full mt-3'>
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
            <TouchableOpacity onPress={() => validateFields()} className='p-3 mt-4 text-white w-full bg-black rounded-lg' disabled={loading}>
                <Text className='text-white text-lg text-center'>SIGN UP</Text>
            </TouchableOpacity>
            <View className='mt-4 flex-row'>
                <Text className='font-normal'>Have an account? </Text>
                <Link href={"/index"}>
                    <Text className='font-bold'>Sign In</Text>
                </Link>
            </View>
        </View>
    )
}
