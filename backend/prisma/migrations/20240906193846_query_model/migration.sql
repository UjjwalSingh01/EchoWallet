-- CreateTable
CREATE TABLE "Query" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL,

    CONSTRAINT "Query_pkey" PRIMARY KEY ("id")
);
