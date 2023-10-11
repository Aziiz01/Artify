/*
  Warnings:

  - Added the required column `credits` to the `UserSubscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usersubscription` ADD COLUMN `credits` INTEGER NOT NULL;
