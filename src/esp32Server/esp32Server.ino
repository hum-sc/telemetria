#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <EasyBuzzer.h>
#include "time.h"
#define dht_pin 4
#define DHTTYPE DHT11
#define led 16
#define buzzer 21

int duracionTono = 250;
int fMin = 2000;
int fMax = 4000;
int delayAlerta = 1000;
int delayPeligo = 500;

int duracionAlerta = 5;
int duracionPeligro = 20;
float temperature;
float humidity;

DHT dht(dht_pin, DHTTYPE);

const char* ssid = "C";
const char* password = "123456780";
const char* host = "sensorhumedad";
// unidades
const char* unidadesTemparatura = "°C";
const char* unidadesHumedad = "%";
time_t current_time;

const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 0;
const int daylightOffset_sec = 3600;

int Do = 261;
int Re = 293;
int Mi = 329;
int Fa = 349;
int Sol = 392;
int La = 440;
int Si = 493;

int negra = 250;
int mediaNegra = negra/2;
int blanca = 500;
int retardo = 3000;

WebServer server(80);

void nota(int nota, int duracion){
  EasyBuzzer.singleBeep(nota, duracion);
  delay(duracion);
  EasyBuzzer.stopBeep();
  delay(30);
}


void cancion(){
  for (int i = 0; i < duracionAlerta; i++){
    nota(La, negra);
    delay(mediaNegra);
  }

}

void cancionPeligro(){
  for (int i = 0; i < duracionPeligro; i++){
    nota(Si, negra);
    delay(mediaNegra);
  }
}

// esta funcion regresa la medida del sensor, se queda sin implementar

char* getTemperature(){
  temperature = dht.readTemperature(false);
  // convierte la medida a un char*
  char* medidaChar = (char*)malloc(10);
  dtostrf(temperature, 4, 2, medidaChar);
  return medidaChar;
}

char* getHumidity(){
  humidity = dht.readHumidity();
  // convierte la medida a un char*
  char* medidaChar = (char*)malloc(10);
  dtostrf(humidity, 4, 2, medidaChar);
  return medidaChar;
}


// Regresa la medida de temperatura, y las unidades en un formato json
void handleRoot() {
  analogWrite(led, 255);

  // obtiene la hora actual con time.h
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
  }else Serial.println(&timeinfo, "%A, %B %d %Y %H:%M:%S");
  current_time = mktime(&timeinfo);
  char* medida = getTemperature();
  String message = "{\"valor\": ";
  message += medida;
  message += ", \"unidades\": \"";
  message += unidadesTemparatura;
   message += "\", \"timestamp\": ";
  message += current_time;
  message += "}";
  server.send(200, "application/json", message);
  analogWrite(led, 0);
}

void handleHumidity() {
  analogWrite(led, 255);
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
  }else Serial.println(&timeinfo, "%A, %B %d %Y %H:%M:%S");
  current_time = mktime(&timeinfo);
  char* medida = getHumidity();
  String message = "{\"valor\": ";
  message += medida;
  message += ", \"unidades\": \"";
  message += unidadesHumedad;
  message += "\", \"timestamp\": ";
  message += current_time;
  message += "}";
  server.send(200, "application/json", message);
  analogWrite(led, 0);
}

  // /action recives a POST request with the following body as json
  // {
  //   "accion": <"peligro"| "alerta">
  // }

void fadeIn(int duration){
  for(int i = 0; i < 256; i++){
    analogWrite(led, i);
    delay(duration/256);
  }
}

void fadeOut(int duration){
  for(int i = 255; i >= 0; i--){
    analogWrite(led, i);
    delay(duration/256);
  }
}

void handleAccion(){
  
  // Lee el cuerpo de la petición
  String body = server.arg("plain");
  // Parsea el json
  DynamicJsonDocument doc(1024);
  DeserializationError error = deserializeJson(doc, body);
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.c_str());
    server.send(400, "application/json", "{\"error\": \"bad request\"}");
    digitalWrite(led, 0);
    return;
  }
  
  // Obtiene los valores de accion y tiempo
  String accion = doc["accion"];
  int tiempo = doc["tiempo"];
  // Realiza la acción
  if(accion == "alerta"){
    server.send(200, "application/json", "{\"message\": \"success\"}");
    // Realiza la notificación
    cancion();
    
    Serial.println("Notificacion");
  }else if(accion == "peligro"){
    server.send(200, "application/json", "{\"message\": \"success\"}");
    // Realiza la alerta
    cancion();
    Serial.println("Alerta");
  }else{
    server.send(400, "application/json", "{\"error\": \"bad request\"}");
    digitalWrite(led, 0);
    return;
  }
  // Regresa un mensaje de exito
 
  digitalWrite(led, 0);
}

void handleNotFound() {
  digitalWrite(led, 1);
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";
  for (uint8_t i = 0; i < server.args(); i++) {
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }
  server.send(404, "text/plain", message);
  digitalWrite(led, 0);
}

void setup(void) {
  pinMode(led, OUTPUT);
  pinMode(dht_pin, INPUT);

  dht.begin();

  EasyBuzzer.setPin(buzzer);

  digitalWrite(led, 0);
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("");

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    fadeIn(2500);
    fadeOut(2500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // Configure the current time
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  Serial.println("Configurando hora");
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
  }else Serial.println(&timeinfo, "%A, %B %d %Y %H:%M:%S");

  if (MDNS.begin(host)) {
    Serial.println("MDNS responder started");
  }

  server.on("/", handleRoot);
  server.on("/humedad", handleHumidity);

  server.on("/accion", HTTP_POST, handleAccion);
  server.on("/humedad/accion", HTTP_POST, handleAccion);

  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("HTTP server started");

}

void loop(void) {
  EasyBuzzer.update();
  while (WiFi.status() != WL_CONNECTED)
  {
    fadeIn(2500);
    fadeOut(2500);
    Serial.print(".");
  }
  
  server.handleClient();
  delay(2);//allow the cpu to switch to other tasks

  // Obtiene la hora actual
  // Imprime la hora actual
  }
