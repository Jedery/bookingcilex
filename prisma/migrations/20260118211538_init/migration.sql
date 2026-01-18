-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "category" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingId" TEXT NOT NULL,
    "eventId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT,
    "phone" TEXT,
    "notes" TEXT,
    "adminNotes" TEXT,
    "status" TEXT NOT NULL,
    "paymentMethod" TEXT,
    "price" REAL NOT NULL,
    "discount" REAL NOT NULL DEFAULT 0,
    "tax" REAL NOT NULL DEFAULT 0,
    "total" REAL NOT NULL,
    "deposit" REAL NOT NULL DEFAULT 0,
    "depositPercent" BOOLEAN NOT NULL DEFAULT false,
    "toPay" REAL NOT NULL,
    "coupon" TEXT,
    "guestList" TEXT,
    "gifts" TEXT,
    "booker" TEXT,
    "emailLanguage" TEXT NOT NULL DEFAULT 'en',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Booking_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingId_key" ON "Booking"("bookingId");
