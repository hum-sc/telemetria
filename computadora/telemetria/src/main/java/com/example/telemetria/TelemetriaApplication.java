package com.example.telemetria;

import com.sun.management.OperatingSystemMXBean;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.json.JsonParseException;
import org.springframework.boot.json.JsonParser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import oshi.SystemInfo;
import oshi.hardware.HardwareAbstractionLayer;
import oshi.hardware.NetworkIF;



import java.lang.management.ManagementFactory;


import java.lang.management.ManagementFactory;
import java.util.List;
import java.util.Map;


@SpringBootApplication
@RestController
public class TelemetriaApplication {

	long[] prevTicks =null;


	public static void main(String[] args) {
		SpringApplication.run(TelemetriaApplication.class, args);
	}

	@GetMapping("/memoria")
	public String memory() {
		SystemInfo si = new SystemInfo();
		HardwareAbstractionLayer hal = si.getHardware();
		long totalMemory = hal.getMemory().getTotal() / 1024 / 1024;
		long freeMemory = hal.getMemory().getAvailable() / 1024 / 1024;
		long usedMemory = totalMemory - freeMemory;
		String unidad = "MB";
		int timestamp = (int) (System.currentTimeMillis() / 1000);
		return "{\n" +
				"\"valor\":" + usedMemory + ",\n" +
				"\"unidad\":\"" + unidad + "\",\n" +
				"\"timestamp\":" + timestamp + "\n" +
				"}";
	}

	@GetMapping("/cpu")
	public String cpuLoad() {
		OperatingSystemMXBean osBean = ManagementFactory.getPlatformMXBean(
				OperatingSystemMXBean.class);
		double cpuLoad = osBean.getCpuLoad();
		String unidad = "%";
		int timestamp = (int) (System.currentTimeMillis() / 1000);
		return "{\n" +
				"\"valor\":" + cpuLoad + ",\n" +
				"\"unidad\":\"" + unidad + "\",\n" +
				"\"timestamp\":" + timestamp + "\n" +
				"}";
	}

	@PostMapping({"*/accion", "/accion"})
	public String accion(@RequestBody String body) {
		// Obtener el valor de la accion despues de "accion": y entre las primeras comillas
		String accion = "";
		accion = body.split("\"accion\":")[1].split("\"")[1];

		switch (accion){
			case "alerta":
				System.out.println("Alerta");
				// executa esto > rundll32 user32.dll,MessageBeep 5 veces
				try{
					try {
						for (int i = 0; i < 5; i++) {
							ProcessBuilder pb = new ProcessBuilder("cmd", "/c", "rundll32 user32.dll,MessageBeep");
							Process p = pb.start();
							int exitCode = p.waitFor();
							System.out.println("Alerta");
							assert exitCode == 0;
							Thread.sleep(2000); // Wait for 2 seconds
						}
					} catch (Exception e) {
						System.out.println("Error al ejecutar el comando");
					}
				}catch (Exception e){
					System.out.println("Error al ejecutar el comando");
				}
				break;
			case "peligro":
				System.out.println("Peligro");
				// executa esto > rundll32 user32.dll,MessageBeep 10 veces
				try{
					try {
						for (int i = 0; i <20; i++) {
							ProcessBuilder pb = new ProcessBuilder("cmd", "/c", "rundll32 user32.dll,MessageBeep");
							Process p = pb.start();
							int exitCode = p.waitFor();
							System.out.println("Peligro");
							assert exitCode == 0;
							Thread.sleep(1000); // Wait for 1 seconds
						}
					} catch (Exception e) {
						System.out.println("Error al ejecutar el comando");
					}
				}catch (Exception e){
					System.out.println("Error al ejecutar el comando");
				}

				// Si no se mueve el mouse en 10 segundos, apagar la computadora
				// executa esto > shutdown -s -t 10
				
					try {
						ProcessBuilder pb = new ProcessBuilder("cmd", "/c", "shutdown -s -t 10");
						System.out.println("Apagando");
						Process p = pb.start();
						int exitCode = p.waitFor();

						assert exitCode == 0;
					} catch (Exception e) {
						System.out.println("Error al ejecutar el comando");
					}
				break;


		}

		return accion;
	}
}