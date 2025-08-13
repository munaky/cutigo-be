/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `LeaveRequest` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."LeaveRequest" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "updatedAt";
