-- CreateTable
CREATE TABLE "Sensor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "umbralAlerta" REAL NOT NULL,
    "umbralPeligro" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Medicion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "valor" REAL NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sensorId" INTEGER NOT NULL,
    CONSTRAINT "Medicion_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_url_key" ON "Sensor"("url");
