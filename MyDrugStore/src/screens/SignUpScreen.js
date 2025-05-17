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
import { signUp, clearError } from '../redux/authSlice';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('male'); // Default to male
  
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (error) {
      Alert.alert('Registration Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);
  
  const handleClear = () => {
    setName('');
    setEmail('');
    setPassword('');
    setGender('male');
  };
  
  const handleSignUp = () => {
    // Validate inputs
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    
    // Dispatch sign up action
    dispatch(signUp({ name, email, password, gender }));
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
              <Text style={styles.title}>Sign up a new user</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
              />
              
              <View style={styles.genderContainer}>
                <Text style={styles.genderLabel}>Gender</Text>
                <View style={styles.genderOptions}>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      gender === 'male' && styles.genderButtonActive
                    ]}
                    onPress={() => setGender('male')}
                  >
                    <Text 
                      style={[
                        styles.genderButtonText,
                        gender === 'male' && styles.genderButtonTextActive
                      ]}
                    >
                      Male
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      gender === 'female' && styles.genderButtonActive
                    ]}
                    onPress={() => setGender('female')}
                  >
                    <Text 
                      style={[
                        styles.genderButtonText,
                        gender === 'female' && styles.genderButtonTextActive
                      ]}
                    >
                      Female
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
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
                  style={[styles.button, styles.signUpButton]}
                  onPress={handleSignUp}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Ionicons name="person-add" size={20} color="#fff" />
                      <Text style={styles.buttonText}>Sign Up</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                onPress={() => navigation.navigate('SignIn')}
                style={styles.switchContainer}
              >
                <Text style={styles.switchText}>
                  Switch to: Sign in with an existing user
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
    backgroundColor: 'rgba(152, 61, 61, 0.9)',
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
  genderContainer: {
    marginBottom: 15,
  },
  genderLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    padding: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  genderButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  genderButtonTextActive: {
    fontWeight: 'bold',
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
  signUpButton: {
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

export default SignUpScreen;