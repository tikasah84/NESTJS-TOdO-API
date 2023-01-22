/*
  Warnings:

  - You are about to drop the column `completed` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `task` table. All the data in the column will be lost.
  - Made the column `userId` on table `task` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_userId_fkey`;

-- AlterTable
ALTER TABLE `task` DROP COLUMN `completed`,
    DROP COLUMN `content`,
    ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `file` VARCHAR(191) NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'not started',
    MODIFY `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
