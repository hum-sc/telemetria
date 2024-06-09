package com.example.telemetria;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class TelemetriaApplication {

	public static void main(String[] args) {
		SpringApplication.run(TelemetriaApplication.class, args);
	}

	@GetMapping("/hello")
	public String hello() {
		return "Hello World!";
	}

	@GetMapping("/hilos")
	// regresa {
	// "valor":double,
	// "unidad":string
	// "timestamp":int
	public String hilos() {
		double valor = 0.0;
		//TODO: Leer el valor de la variable de hilos

		String unidad = "Hilos";
		int timestamp = (int) (System.currentTimeMillis() / 1000);
		return "{\n" +
				"\"valor\":" + valor + ",\n" +
				"\"unidad\":\"" + unidad + "\",\n" +
				"\"timestamp\":" + timestamp + "\n" +
				"}";

	}

	@GetMapping("/memoria")
	// regresa un json con la siguiente estructura
	/**
	 * {
	 * "valor":double,
	 * "unidad":string
	 * "timestamp":int
	 * }
	 */
	public String memoria() {
		double valor = 0.0;
		//TODO: Leer el valor de la variable de memoria
		String unidad = "MB";
		int timestamp = (int) (System.currentTimeMillis() / 1000);

		return "{\n" +
				"\"valor\":" + valor + ",\n" +
				"\"unidad\":\"" + unidad + "\",\n" +
				"\"timestamp\":" + timestamp + "\n" +
				"}";

	}

	@PostMapping("/accion")
	// El body de la peticion es solamente un json { accion: peligro|alerta }
	// regresa {}
	public void accion(@RequestBody String body) {
		//TODO: Ejecutar la accion

		// Obtiene la accion
		String accion = body.split(":")[1].split("\"")[1];

	}
}