import { useState, useEffect } from 'react'
import { View, Alert, ScrollView, SafeAreaView, TouchableOpacity, Text } from 'react-native'
import { supabase } from '~/services/superbase'
import { useAuth } from '~/providers/AuthProvider'
import Avatar from '~/components/Avatar'
import { Pressable, TextInput } from 'react-native-gesture-handler'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

export default function Account() {
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState('')
    const [fullName, setFullName] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')

    const { session } = useAuth();

    useEffect(() => {
        if (session) getProfile()
    }, [session])

    async function getProfile() {
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`username, full_name, avatar_url`)
                .eq('id', session?.user.id)
                .single()
            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setUsername(data.username)
                setFullName(data.full_name)
                setAvatarUrl(data.avatar_url)
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    async function updateProfile({
        username,
        full_name,
        avatar_url,
    }: {
        username: string
        full_name: string
        avatar_url: string
    }) {
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')

            const updates = {
                id: session?.user.id,
                username,
                full_name,
                avatar_url,
                updated_at: new Date(),
            }

            const { error } = await supabase.from('profiles').upsert(updates)

            if (error) {
                throw error
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView className='flex-1 pb-20 mt-3 px-3'>
            <ScrollView>
                <View className='text-start my-4'>
                    <Pressable onPress={() => supabase.auth.signOut()}>
                        <SimpleLineIcons name="logout" size={24} color="black" />
                    </Pressable>
                </View>
                <View className='flex-row justify-center'>
                    <Avatar
                        size={200}
                        url={avatarUrl}
                        onUpload={(url: string) => {
                            setAvatarUrl(url)
                            updateProfile({ username, full_name:fullName, avatar_url: url })
                        }}
                    />
                </View>

                <View className='w-fit mt-5'>
                    <Text className='text-gray-600'>Email</Text>
                    <TextInput className='p-4 border rounded-lg border-gray-500 text-gray-500' value={session?.user?.email} editable={false} />
                </View>
                <View className='w-fit mt-3'>
                    <Text className='text-gray-600'>User Name</Text>
                    <TextInput className='p-4 border rounded-lg border-gray-500' value={username || ''} onChangeText={(text) => setUsername(text)} />
                </View>
                <View className='w-fit mt-3'>
                    <Text className='text-gray-600'>Full Name</Text>
                    <TextInput className='p-4 border rounded-lg border-gray-500' value={fullName} placeholder="Enter Full Name" onChangeText={(text) => setFullName(text)} />
                </View>

                <TouchableOpacity className='mt-3 bg-black rounded-lg p-4' onPress={() => updateProfile({ username, full_name:fullName, avatar_url: avatarUrl })} disabled={loading}>
                    <Text className='text-white text-center'>{loading ? 'Loading ...' : 'Update'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}
