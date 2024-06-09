/*
  Warnings:

  - Added the required column `unidadMedida` to the `Sensor` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sensor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "umbralAlerta" REAL NOT NULL DEFAULT 0.0,
    "umbralPeligro" REAL NOT NULL DEFAULT 0.0,
    "online" BOOLEAN NOT NULL DEFAULT false,
    "unidadMedida" TEXT NOT NULL
);
INSERT INTO "new_Sensor" ("id", "nombre", "umbralAlerta", "umbralPeligro", "url") SELECT "id", "nombre", "umbralAlerta", "umbralPeligro", "url" FROM "Sensor";
DROP TABLE "Sensor";
ALTER TABLE "new_Sensor" RENAME TO "Sensor";
CREATE UNIQUE INDEX "Sensor_url_key" ON "Sensor"("url");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
