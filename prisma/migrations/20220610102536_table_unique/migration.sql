/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Table` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Table" ALTER COLUMN "total" DROP NOT NULL,
ALTER COLUMN "total" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Table_name_key" ON "Table"("name");
