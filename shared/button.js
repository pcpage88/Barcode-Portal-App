import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View } from 'react-native';

export default function FlatButton({ text, onPress }){
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>{text}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginTop: 10,
        marginBottom: 20,
        backgroundColor: '#00FF85'
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 15,
        textAlign: 'center',
    }
})