import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { signIn, clearError } from '../redux/authSlice';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (error) {
      Alert.alert('Sign In Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);
  
  const handleClear = () => {
    setEmail('');
    setPassword('');
  };
  
  const handleSignIn = () => {
    // Validate inputs
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }
    
    // Dispatch sign in action
    dispatch(signIn({ email, password }));
  };
  
  return (
    <ImageBackground 
      source={require('../assets/back1.jpg')}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.20)']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <View style={styles.formContainer}>
              <Text style={styles.title}>Sign in with email and password</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.clearButton]}
                  onPress={handleClear}
                >
                  <Ionicons name="trash-outline" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Clear</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.button, styles.signInButton]}
                  onPress={handleSignIn}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Ionicons name="log-in" size={20} color="#fff" />
                      <Text style={styles.buttonText}>Sign In</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                onPress={() => navigation.navigate('SignUp')}
                style={styles.switchContainer}
              >
                <Text style={styles.switchText}>
                  Switch to: Sign up as a new user
                </Text>
                <Ionicons name="arrow-forward-circle" size={20} color="#fff" style={styles.switchIcon} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(62, 61, 152, 0.9)',
    margin: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  clearButton: {
    backgroundColor: '#888',
  },
  signInButton: {
    backgroundColor: '#4A80F0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  switchContainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  switchText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 5,
  },
  switchIcon: {
    marginLeft: 5,
  },
});

export default SignInScreen;