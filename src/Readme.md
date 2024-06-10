# Telemetría

Este proyecto es una implementación de telemetría para la transmisión de datos en tiempo real.

## Composicion
- En /src/ se encuentran los codigos de los arduinos, en este momento el que se utiliza es esp32 server
- En interfazV2 se encuentra el codigo de la interfaz

## Instalacion

1. Clona el repositorio: `git clone https://github.com/tu-usuario/telemetria.git`

2. Navega al directorio de la interfaz: `cd telemetria\interfazV2`
3. Instala las dependencias: `npm install`

## Uso

1. Ejecuta el cliente `npm run dev`
2. Abre el cliente de telemetría en tu navegador: `http://localhost:3000`

## Firmware Sensores

en /src/esp32server se encuentra el firmware,
- el dht se conecta al pin D4
- el led al pin D16
- el buzzer al D21


## Comunicación

Cada sensor ejecuta un servidor http



## Contribución

Si deseas contribuir a este proyecto, sigue los siguientes pasos:

1. Crea un fork del repositorio
2. Crea una rama para tu contribución: `git checkout -b feature/nueva-funcionalidad`
3. Realiza tus cambios y realiza commits: `git commit -m "Agrega nueva funcionalidad"`
4. Sube tus cambios a tu fork: `git push origin feature/nueva-funcionalidad`
5. Abre un pull request en el repositorio original

## Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.
