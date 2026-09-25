-- CreateTable
CREATE TABLE "beta_testers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "deviceType" TEXT,
    "deviceModel" TEXT,
    "osVersion" TEXT,
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "joinedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beta_testers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bug_reports" (
    "id" TEXT NOT NULL,
    "betaTesterId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "steps" TEXT,
    "expectedResult" TEXT,
    "actualResult" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'open',
    "deviceInfo" TEXT,
    "appVersion" TEXT,
    "screenshots" JSONB,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "resolution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bug_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beta_feedback" (
    "id" TEXT NOT NULL,
    "betaTesterId" TEXT NOT NULL,
    "rating" INTEGER,
    "feedback" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beta_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beta_invites" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beta_invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "beta_testers_email_key" ON "beta_testers"("email");

-- CreateIndex
CREATE INDEX "bug_reports_betaTesterId_idx" ON "bug_reports"("betaTesterId");

-- CreateIndex
CREATE INDEX "bug_reports_status_idx" ON "bug_reports"("status");

-- CreateIndex
CREATE INDEX "bug_reports_severity_idx" ON "bug_reports"("severity");

-- CreateIndex
CREATE INDEX "beta_feedback_betaTesterId_idx" ON "beta_feedback"("betaTesterId");

-- CreateIndex
CREATE INDEX "beta_feedback_category_idx" ON "beta_feedback"("category");

-- CreateIndex
CREATE UNIQUE INDEX "beta_invites_token_key" ON "beta_invites"("token");

-- AddForeignKey
ALTER TABLE "bug_reports" ADD CONSTRAINT "bug_reports_betaTesterId_fkey" FOREIGN KEY ("betaTesterId") REFERENCES "beta_testers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beta_feedback" ADD CONSTRAINT "beta_feedback_betaTesterId_fkey" FOREIGN KEY ("betaTesterId") REFERENCES "beta_testers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
