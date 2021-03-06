import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import * as firebase from 'firebase';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { firebaseAPI_Key, signIn } from '../../constants/APIs';

try {
  !firebase.apps.length
    ? firebase.initializeApp({
        apiKey: firebaseAPI_Key,
        authDomain: 'dangguenmarketclonning.firebaseapp.com',
        projectId: 'dangguenmarketclonning',
        storageBucket: 'dangguenmarketclonning.appspot.com',
        messagingSenderId: '42558418825',
        appId: '1:42558418825:web:49ed049909f82c25f9fb58',
      })
    : firebase.app();
} catch (err) {
  console.log('err:', err);
}

export default function PhoneNumberAuth({ navigation }) {
  const recaptchaVerifier = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState();
  const [verificationId, setVerificationId] = useState();
  const [verificationCode, setVerificationCode] = useState();

  const firebaseConfig = firebase.apps.length
    ? firebase.app().options
    : undefined;
  const [message, showMessage] = useState(undefined);

  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');

  // console.log(token);

  return (
    <View style={styles.container}>
      {message && (
        <View
          style={{
            backgroundColor: 'black',
            width: '100%',
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 20, color: 'white' }}>{message}</Text>
        </View>
      )}
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={true}
        invisibleVerify={true}
      />
      <View style={styles.lockcontainer}>
        <Image
          style={styles.lock}
          source={require('../../../assets/images/lock.png')}
        />
        <Text
          style={{
            width: 260,
            paddingHorizontal: 20,
            fontSize: 15,
            lineHeight: 25,
          }}
        >
          ??????????????? ????????? ????????? ????????????. ?????????{' '}
          <Text style={{ fontWeight: '700' }}>???????????? ??????</Text>
          ??????, ???????????? ???????????? ?????????.
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="????????? ??????(-?????? ????????? ??????)"
        autoCompleteType="tel"
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        onChangeText={(phoneNumber) => setPhoneNumber(`+82${phoneNumber}`)}
        value={verificationId && phoneNumber}
      />

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor:
              (!phoneNumber && !verificationId ? '#DEE2E6' : '#EF904F') ||
              (verificationId && '#4A5056'),
          },
        ]}
        onPress={async () => {
          try {
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            const verificationId = await phoneProvider.verifyPhoneNumber(
              phoneNumber,
              recaptchaVerifier.current
            );
            setVerificationId(verificationId);
            showMessage('??????????????? ?????? ?????????????????????.');
          } catch (err) {
            console.log('error message:', err);
          }
        }}
      >
        <Text style={styles.buttonText}>
          {verificationId ? '???????????? ????????????' : '??????????????????'}
        </Text>
      </TouchableOpacity>
      {!verificationId && (
        <Text>
          ??????????????? ???????????????????
          <Text style={{ textDecorationLine: 'underline', marginLeft: 10 }}>
            ???????????? ????????????
          </Text>
        </Text>
      )}
      {verificationId && (
        <>
          <TextInput
            style={styles.input}
            placeholder="???????????? ??????"
            keyboardType="phone-pad"
            onChangeText={setVerificationCode}
          />
          <Text style={{ color: 'gray', marginBottom: 10 }}>
            ????????? ???????????? ????????? ???????????? ?????????
          </Text>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: !verificationCode ? '#DEE2E6' : '#EF904F' },
            ]}
            onPress={async () => {
              try {
                const credential = firebase.auth.PhoneAuthProvider.credential(
                  verificationId,
                  verificationCode
                );
                await firebase.auth().signInWithCredential(credential);

                await axios
                  .post(signIn, {
                    phone_number: phoneNumber,
                  })
                  .then((res) => {
                    AsyncStorage.setItem('token', res.data.token);
                    AsyncStorage.setItem('id', res.data.token);
                    setToken(res.data.token);
                    setUserId(res.data.id);
                  })
                  .then(
                    navigation.navigate('townauth', {
                      token: token,
                      userId: userId,
                    })
                  );
              } catch (err) {
                showMessage('??????????????? ?????? ?????????????????????.');
                console.log('errormsg: ', err);
              }
            }}
          >
            <Text style={styles.buttonText}>???????????? ??????</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  lockcontainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  lock: {
    width: 70,
    height: 70,
  },
  input: {
    width: '90%',
    height: 50,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    width: 340,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
});
