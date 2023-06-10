#include <Arduino.h>
#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WebSocketsServer.h>

//use this to json format data to server
#include <ArduinoJson.h>
// #include <Hash.h>

ESP8266WiFiMulti WiFiMulti;
SoftwareSerial ArduinoUno(D2,D3); //rx tx ni bai

const char* ssid = "Smart Parking System";
const char* password = "IoT6969";

IPAddress ip(192, 168, 1, 16); //ip adress nimu bai e.change ni ang value
IPAddress gateway(192, 168, 1, 1); //same sa gateway
IPAddress subnet(255, 255, 255, 0);// unya sa  subnet

WebSocketsServer webSocket = WebSocketsServer(81);

uint8_t clientID;

#define USE_SERIAL Serial1

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {

    switch(type) {
        case WStype_DISCONNECTED:
            USE_SERIAL.printf("[%u] Disconnected!\n", num);
            break;
        case WStype_CONNECTED:
            {
                IPAddress ip = webSocket.remoteIP(num);
                USE_SERIAL.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
				
				// send message to client
				webSocket.sendTXT(num, "Connected");
            }
            break;
        case WStype_TEXT:
            USE_SERIAL.printf("[%u] get Text: %s\n", num, payload);

            // send message to client
            // webSocket.sendTXT(num, "message here");

            // send data to all connected clients
            // webSocket.broadcastTXT("message here");
            break;
        case WStype_BIN:
            USE_SERIAL.printf("[%u] get binary length: %u\n", num, length);
            hexdump(payload, length);

            // send message to client
            // webSocket.sendBIN(num, payload, length);
            break;
    }

}

void setup() {
  Serial.begin(9600);
  ArduinoUno.begin(9600);

  WiFi.config(ip, gateway, subnet);
  WiFi.begin(ssid, password);
  Serial.println("");

  while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
  }

  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  //  server.on("/", [](){
  //  server.send(200, "text/html", WebPage);
  //  });

  server.begin();

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);

  pinMode(D4, OUTPUT);
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    digitalWrite(D4, HIGH);
  } else {
      digitalWrite(D4, LOW);
  }

  webSocket.loop();
  server.handleClient();

  if (ArduinoUno.available() > 0) {
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, ArduinoUno);

    String jsonStr;
    serializeJsonPretty(doc, Serial);
    serializeJson(doc, jsonStr);

    webSocket.sendTXT(clientID, jsonStr);
  }
}

