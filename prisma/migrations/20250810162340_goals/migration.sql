/*
  Warnings:

  - You are about to drop the column `targetDate` on the `goals_tracker` table. All the data in the column will be lost.
  - Added the required column `target_date` to the `goals_tracker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `goals_tracker` DROP COLUMN `targetDate`,
    ADD COLUMN `target_date` DATETIME(3) NOT NULL;
