#include <SoftwareSerial.h>

SoftwareSerial espSerial(2, 3);  // RX, TX pins para maka communicate sa nodemcu

void setup() {
  Serial.begin(9600);  // monitor for debugging
  espSerial.begin(9600);  // set for esp8266 for communication
}

void loop() {
  if (espSerial.available()) {
    String receivedData = espSerial.readString();  

  }

  // Send data to ESP8266
  String sendData = "Hello from Arduino Uno!";
  espSerial.println(sendData);

  delay(1000);
}

