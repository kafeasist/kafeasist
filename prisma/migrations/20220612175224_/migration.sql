/*
  Warnings:

  - You are about to alter the column `amount` on the `FoodOnTable` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Made the column `total` on table `Table` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FoodOnTable" ALTER COLUMN "amount" SET DEFAULT 1,
ALTER COLUMN "amount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Table" ALTER COLUMN "total" SET NOT NULL;
