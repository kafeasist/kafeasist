/*
  Warnings:

  - You are about to drop the column `verifieds` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "verifieds",
ADD COLUMN     "subs_type" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
