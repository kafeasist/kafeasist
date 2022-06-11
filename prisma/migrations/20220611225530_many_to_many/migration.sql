-- CreateTable
CREATE TABLE "_FoodToTable" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FoodToTable_AB_unique" ON "_FoodToTable"("A", "B");

-- CreateIndex
CREATE INDEX "_FoodToTable_B_index" ON "_FoodToTable"("B");

-- AddForeignKey
ALTER TABLE "_FoodToTable" ADD CONSTRAINT "_FoodToTable_A_fkey" FOREIGN KEY ("A") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FoodToTable" ADD CONSTRAINT "_FoodToTable_B_fkey" FOREIGN KEY ("B") REFERENCES "Table"("id") ON DELETE CASCADE ON UPDATE CASCADE;
