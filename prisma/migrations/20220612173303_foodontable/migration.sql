/*
  Warnings:

  - You are about to drop the `_FoodToTable` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FoodToTable" DROP CONSTRAINT "_FoodToTable_A_fkey";

-- DropForeignKey
ALTER TABLE "_FoodToTable" DROP CONSTRAINT "_FoodToTable_B_fkey";

-- DropTable
DROP TABLE "_FoodToTable";

-- CreateTable
CREATE TABLE "FoodOnTable" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "food_id" INTEGER NOT NULL,
    "table_id" INTEGER NOT NULL,

    CONSTRAINT "FoodOnTable_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FoodOnTable" ADD CONSTRAINT "FoodOnTable_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodOnTable" ADD CONSTRAINT "FoodOnTable_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
