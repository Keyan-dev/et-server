/*
  Warnings:

  - Added the required column `daily_trackerId` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `goals_tracker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `category` ADD COLUMN `daily_trackerId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `goals_tracker` ADD COLUMN `user_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `daily_tracker` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `amount` BIGINT NOT NULL,
    `notes` VARCHAR(191) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,
    `sub_category_id` INTEGER NOT NULL,
    `payment_mode_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `goals_tracker` ADD CONSTRAINT `goals_tracker_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `daily_tracker` ADD CONSTRAINT `daily_tracker_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `daily_tracker` ADD CONSTRAINT `daily_tracker_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `daily_tracker` ADD CONSTRAINT `daily_tracker_sub_category_id_fkey` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `daily_tracker` ADD CONSTRAINT `daily_tracker_payment_mode_id_fkey` FOREIGN KEY (`payment_mode_id`) REFERENCES `payment_mode`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
