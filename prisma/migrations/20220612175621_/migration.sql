/*
  Warnings:

  - You are about to drop the column `food_id` on the `FoodOnTable` table. All the data in the column will be lost.
  - Added the required column `name` to the `FoodOnTable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `FoodOnTable` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FoodOnTable" DROP CONSTRAINT "FoodOnTable_food_id_fkey";

-- AlterTable
ALTER TABLE "FoodOnTable" DROP COLUMN "food_id",
ADD COLUMN     "daily" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
