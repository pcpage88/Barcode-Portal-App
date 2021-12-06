import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import FlatButton from '../barcodeScanner/shared/button';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { render } from 'react-dom';

export default function App() {

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Hover over a barcode to scan');
  const [readyToScan,setReadyToScan] = useState(true);
  var barcodeData = null;
  var axiosData = null;

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status == 'granted')
    })()
  }

  //Request Camera Permission with no requirements (the [] at the end)
  useEffect(() => {
    askForCameraPermission();
  }, []);
  

  //Function called to hit the API with the barcode
  //and store data for use
  goForAxios = (barcodeData) => {
    console.log(barcodeData)
    axios.get("https://python-mobile-scraper.herokuapp.com/api/v1/barcode?barcode=" + barcodeData)
        .then(response => {
            console.log('getting data from axios', response.data);
            setTimeout(() => {
                axiosData = response.data;
                console.log('item: ', axiosData.products[0].brand);
                var item = axiosData.products[0].brand;
                displayResults(item);
            }, 2000)
        })
        .catch(error => {
            console.log(error);
        });
  }


  //function called when we scan the barcode
  const handleScannedBarCode = ({type,data}) => {
    setScanned(true);
    setText(data);
    console.log('Type: ' + type + '\nData: ' + data)
    barcodeData = data;
    console.log('Barcode data is: ' + barcodeData)
    goForAxios(barcodeData);
  }

  // Function that checks permissions and return the screens
  if (hasPermission == null) {
    return (
      <View style={styles.container}>
        <Image style={styles.logo1} source={require('./assets/Barcode-Portal-logo2.png')} />
        <StatusBar style="auto" />
      </View>
    );
  }

  //If permission is denied, show this screen
  if( hasPermission == false) {
    return (
      <View style={styles.container}>
        <Image style={styles.logo2} source={require('./assets/Barcode-Portal-logo2.png')} />
        <Text style={styles.noPermission}>No Access To Camera</Text>
        <FlatButton text='Click to Scan Barcode' onPress={() => askForCameraPermission} color='#00FF85' />        
        <StatusBar style="auto" />
      </View>
    );
  }

  const displayResults = (props) => {
      return(
        <View style={styles.container}>
          <Image style={styles.upperLogo} source={require('./assets/Barcode-Portal-logo2.png')} />
          <View>
            <Text>{props.item}</Text>
          </View>
          <FlatButton text='Scan Another Item' onPress={setReadyToScan(true)} color='#00FF85' />
        </View>
      );
  }

  if(readyToScan == true){
  //Display the main scanner view
    return (
      <View style={styles.container}>
        <Image style={styles.logo2} source={require('./assets/Barcode-Portal-logo2.png')} />
        <View style={styles.barcodeBox}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleScannedBarCode}
            style={{height: 400, width: 400}} />
        </View>
        <Text style={styles.textView}>{text}</Text>
        {setReadyToScan(false)}
        {scanned && <FlatButton text='Click to Scan Again' onPress={() => setScanned(false)} color='#00FF85' />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0098FF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  barcodeBox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    borderTopWidth: 30,
    borderBottomWidth: 30,
    borderTopColor: '#00FF85',
    borderBottomColor: '#00FF85',
    backgroundColor: '#00FF85'
  },
  textView: {
    fontSize: 18,
    margin: 20,
    color: '#085700'
  },
  logo1: {
    width: 150,
    height: 150,
  },
  logo2: {
    width: 250,
    height: 250,
    marginTop: 75,
    marginBottom: 25,
  },
  uppderLogo: {
    width: 75,
    height: 75,
    justifyContent: 'flex-start',
  },

  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 100,
    color: '#00FF85'
  }

})