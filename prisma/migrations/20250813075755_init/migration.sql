-- DropForeignKey
ALTER TABLE "public"."LeaveRequest" DROP CONSTRAINT "LeaveRequest_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."LeaveRequest" ADD CONSTRAINT "LeaveRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
