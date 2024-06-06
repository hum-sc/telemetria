#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include <ArduinoJson.h>

const char* ssid = "C";
const char* password = "123456780";
const char* host = "sensorhumedad";
// unidades
const char* unidades = "g/m^3";


WebServer server(80);

const int led = 13;

// esta funcion regresa la medida del sensor, se queda sin implementar

char* getMedida(){
  return "0.0";
}


// Regresa la medida del sensor, y las unidades en un formato json
void handleRoot() {
  digitalWrite(led, 1);
  char* medida = getMedida();
  String message = "{\"medida\": ";
  message += medida;
  message += ", \"unidades\": \"";
  message += unidades;
  message += "\"}";
  server.send(200, "application/json", message);
  digitalWrite(led, 0);
}
  // /action recives a POST request with the following body as json
  // {
  //   "accion": <"notificacion"| "alerta">
  //   "tiempo": <numero | null>
  // }
void handleAccion(){
  digitalWrite(led, 1);
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
  if(accion == "notificacion"){
    // Realiza la notificación
    Serial.println("Notificacion");
  }else if(accion == "alerta"){
    // Realiza la alerta
    Serial.println("Alerta");
  }else{
    server.send(400, "application/json", "{\"error\": \"bad request\"}");
    digitalWrite(led, 0);
    return;
  }
  // Regresa un mensaje de exito
  server.send(200, "application/json", "{\"message\": \"success\"}");
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
  digitalWrite(led, 0);
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("");

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  if (MDNS.begin(host)) {
    Serial.println("MDNS responder started");
  }

  server.on("/", handleRoot);

  server.on("/inline", []() {
    server.send(200, "text/plain", "this works as well");
  });

  server.on("/accion", HTTP_POST, handleAccion);


  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("HTTP server started");
}

void loop(void) {
  server.handleClient();
  delay(2);//allow the cpu to switch to other tasks
}
