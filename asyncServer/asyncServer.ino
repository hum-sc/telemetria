//
// A simple server implementation showing how to:
//  * serve static messages
//  * read GET and POST parameters
//  * handle missing pages / 404s
//

#include <Arduino.h>
#ifdef ESP32
#include <WiFi.h>
#include <AsyncTCP.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#endif
#include <ESPAsyncWebServer.h>
#include <ESPmDNS.h>

AsyncWebServer server(80);

const char* ssid = "C";
const char* password = "123456780";
const char* host = "sensorhumedad";

const char* PARAM_MESSAGE = "message";
const char* PARAM_ACCION = "accion";
const char* PARAM_TIEMPO = "tiempo";
const char* unidad = "g/m^3";
const int led = 2;
const int notificacion = 2;//En segundos
const int alerta = 5; // En segundos
void notFound(AsyncWebServerRequest *request) {
    request->send(404, "text/plain", "Not found");
}
// esta funcion regresa la medida del sensor, se queda sin implementar
char* getMedida(){
    //TODO
  return "0.0";
}
// Regresa la medida del sensor, y las unidades en un formato json
void handleRoot(AsyncWebServerRequest *request) {
    digitalWrite(led, 1);
    char* medida = getMedida();
    String message = "{\"medida\": ";
    message += medida;
    message += ", \"unidades\": \"";
    message += unidad;
    message += "\"}";
    request->send(200, "application/json", message);
    digitalWrite(led, 0);
}

void handleAccion(AsyncWebServerRequest *request){
    digitalWrite(led, 1);
    // Lee el cuerpo de la petición
    if(request->hasParam(PARAM_ACCION, true)){
        String accion = request->getParam(PARAM_ACCION, true)->value();
        int tiempo = 0;
        if(request->hasParam(PARAM_TIEMPO, true)){
            tiempo = request->getParam(PARAM_TIEMPO, true)->value().toInt();
        }
        // Realiza la acción
        if(accion == "notificacion"){
            //TODO
            Serial.println("Algo paso");
        }else if(accion == "alerta"){
            //TODO
            Serial.println("Aleeeeertaaaaaaaaaaaaaaaa");
        }
        request->send(200, "application/json", "{\"status\": \"ok\"}");
    }else{
        Serial.println("No tiene lo minimo");
        request->send(400, "application/json", "{\"error\": \"bad request\"}");
    }
    digitalWrite(led,0);
}

void setup() {
    pinMode(led, OUTPUT);
    digitalWrite(led, 0);
    Serial.begin(115200);
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    Serial.println("");
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());

    if(MDNS.begin(host)){
        Serial.println("MDNS responder started");
        Serial.println("You can now connect to http://" + String(host) + ".local");
    }

    server.on("/", HTTP_GET, handleRoot);
    server.on("/accion",HTTP_POST, handleAccion);

    server.onNotFound(notFound);

    server.begin();
}

void loop() {
}