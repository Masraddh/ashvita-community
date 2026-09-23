import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Ashvita database seed...");

  // Clean existing tables
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.amenityBooking.deleteMany();
  await prisma.amenitySlot.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.visitorLog.deleteMany();
  await prisma.visitorPass.deleteMany();
  await prisma.complaintComment.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.maintenanceBill.deleteMany();
  await prisma.resident.deleteMany();
  await prisma.securityStaff.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.tower.deleteMany();
  await prisma.building.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("Password123!", 10);

  // 1. Create Building & Towers
  const building = await prisma.building.create({
    data: { name: "Mahindra Ashvita Lifespaces" },
  });

  const towerA = await prisma.tower.create({ data: { buildingId: building.id, name: "Tower A" } });
  const towerB = await prisma.tower.create({ data: { buildingId: building.id, name: "Tower B" } });
  const towerC = await prisma.tower.create({ data: { buildingId: building.id, name: "Tower C" } });
  const towerD = await prisma.tower.create({ data: { buildingId: building.id, name: "Tower D" } });
  const towerE = await prisma.tower.create({ data: { buildingId: building.id, name: "Tower E" } });

  // 2. Create Units
  const unitA1204 = await prisma.unit.create({
    data: { towerId: towerA.id, unitNumber: "A-1204", floor: 12, status: "OCCUPIED" },
  });

  const unitB802 = await prisma.unit.create({
    data: { towerId: towerB.id, unitNumber: "B-802", floor: 8, status: "OCCUPIED" },
  });

  const unitC301 = await prisma.unit.create({
    data: { towerId: towerC.id, unitNumber: "C-301", floor: 3, status: "OCCUPIED" },
  });

  const unitD105 = await prisma.unit.create({
    data: { towerId: towerD.id, unitNumber: "D-105", floor: 1, status: "VACANT" },
  });

  // 3. Create Users & Roles
  // ADMIN Account
  const adminUser = await prisma.user.create({
    data: {
      name: "Vikram Sharma (Facility Mgr)",
      email: "admin@ashvita.demo",
      passwordHash: hashedPassword,
      phone: "+91 98765 43210",
      role: "ADMIN",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    },
  });

  // RESIDENT Account
  const residentUser = await prisma.user.create({
    data: {
      name: "Rahul Verma",
      email: "resident@ashvita.demo",
      passwordHash: hashedPassword,
      phone: "+91 98123 45678",
      role: "RESIDENT",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    },
  });

  const residentProfile = await prisma.resident.create({
    data: {
      userId: residentUser.id,
      unitId: unitA1204.id,
      residentType: "OWNER",
      emergencyContact: "+91 98123 99999",
    },
  });

  // SECOND RESIDENT Account
  const residentUser2 = await prisma.user.create({
    data: {
      name: "Priya Sundaram",
      email: "priya@ashvita.demo",
      passwordHash: hashedPassword,
      phone: "+91 97777 88888",
      role: "RESIDENT",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
    },
  });

  const residentProfile2 = await prisma.resident.create({
    data: {
      userId: residentUser2.id,
      unitId: unitB802.id,
      residentType: "TENANT",
      emergencyContact: "+91 97777 00000",
    },
  });

  // SECURITY Account
  const securityUser = await prisma.user.create({
    data: {
      name: "Inspector Suresh Kumar",
      email: "security@ashvita.demo",
      passwordHash: hashedPassword,
      phone: "+91 91111 22222",
      role: "SECURITY",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
    },
  });

  const securityStaff = await prisma.securityStaff.create({
    data: {
      userId: securityUser.id,
      badgeId: "SEC-1092",
      shift: "Morning Shift (06:00 AM - 02:00 PM)",
    },
  });

  // 4. Maintenance Bills & Payments
  const bill1 = await prisma.maintenanceBill.create({
    data: {
      unitId: unitA1204.id,
      billingMonth: "September 2026",
      amount: 2450,
      dueDate: new Date("2026-09-28"),
      status: "PENDING",
    },
  });

  const bill2 = await prisma.maintenanceBill.create({
    data: {
      unitId: unitA1204.id,
      billingMonth: "August 2026",
      amount: 2450,
      dueDate: new Date("2026-08-28"),
      status: "PAID",
    },
  });

  await prisma.payment.create({
    data: {
      billId: bill2.id,
      residentId: residentProfile.id,
      amount: 2450,
      paymentMethod: "UPI / PhonePe",
      transactionId: "TXN9928310481",
      paidAt: new Date("2026-08-25"),
    },
  });

  const bill3 = await prisma.maintenanceBill.create({
    data: {
      unitId: unitB802.id,
      billingMonth: "September 2026",
      amount: 3100,
      dueDate: new Date("2026-09-20"),
      status: "OVERDUE",
    },
  });

  // 5. Complaints
  const complaint1 = await prisma.complaint.create({
    data: {
      ticketNo: "CMP-2026-0041",
      residentId: residentProfile.id,
      category: "Plumbing",
      priority: "HIGH",
      title: "Master bathroom flush leak & low pressure",
      description: "Water leaking constantly from the concealed cistern valve in the master bedroom flush unit.",
      status: "IN_PROGRESS",
      assignedTo: "Rajesh (Senior Plumber)",
    },
  });

  await prisma.complaintComment.create({
    data: {
      complaintId: complaint1.id,
      authorName: "Vikram Sharma (Facility Mgr)",
      authorRole: "ADMIN",
      message: "Technician Rajesh assigned. He will visit today between 3 PM and 4 PM.",
    },
  });

  const complaint2 = await prisma.complaint.create({
    data: {
      ticketNo: "CMP-2026-0038",
      residentId: residentProfile.id,
      category: "Lift / Elevator",
      priority: "URGENT",
      title: "Tower A Lift B making screeching sound",
      description: "Lift B produces loud metallic noise between 8th and 12th floor.",
      status: "RESOLVED",
      assignedTo: "Otis Elevator Engineer",
    },
  });

  // 6. Visitors & Visitor Passes
  const visitorPass1 = await prisma.visitorPass.create({
    data: {
      passCode: "VP-849201",
      residentId: residentProfile.id,
      visitorName: "Amit Sharma",
      visitorPhone: "+91 99887 66554",
      vehicleNo: "TS 09 EQ 4821",
      purpose: "Family Dinner & Weekend Visit",
      visitorType: "GUEST",
      expectedTime: new Date("2026-09-24T18:30:00Z"),
      status: "EXPECTED",
    },
  });

  const visitorPass2 = await prisma.visitorPass.create({
    data: {
      passCode: "VP-102938",
      residentId: residentProfile.id,
      visitorName: "Amazon Delivery Agent",
      visitorPhone: "+91 94444 33333",
      purpose: "Parcel Delivery",
      visitorType: "DELIVERY",
      expectedTime: new Date("2026-09-23T14:00:00Z"),
      status: "CHECKED_IN",
    },
  });

  await prisma.visitorLog.create({
    data: {
      passId: visitorPass2.id,
      checkInTime: new Date("2026-09-23T14:05:00Z"),
      checkedInById: securityStaff.id,
    },
  });

  // 7. Amenities & Slots
  const pool = await prisma.amenity.create({
    data: {
      name: "Temperature Controlled Swimming Pool",
      description: "Semi-olympic size indoor heated swimming pool with toddler pool section.",
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
      location: "Clubhouse 1st Floor",
      capacity: 25,
      operatingHours: "06:00 AM - 09:00 PM",
      rules: "Proper swimwear mandatory. Children under 12 require adult supervision.",
      bookingFee: 0,
    },
  });

  const court = await prisma.amenity.create({
    data: {
      name: "Indoor Badminton Court (Court 1)",
      description: "Synthetic wooden floor court with professional LED lighting.",
      image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
      location: "Sports Complex Ground Floor",
      capacity: 4,
      operatingHours: "06:00 AM - 10:00 PM",
      rules: "Non-marking shoes only.",
      bookingFee: 150,
    },
  });

  const slot1 = await prisma.amenitySlot.create({
    data: {
      amenityId: court.id,
      slotTime: "07:00 AM - 08:00 AM",
      date: "2026-09-25",
      maxCapacity: 4,
    },
  });

  await prisma.amenityBooking.create({
    data: {
      slotId: slot1.id,
      residentId: residentProfile.id,
      bookingDate: "2026-09-25",
      status: "BOOKED",
    },
  });

  // 8. Notices
  await prisma.notice.create({
    data: {
      title: "🚨 URGENT: Scheduled Water Supply Maintenance on Sept 25th",
      content: "Overhead tank cleaning and main inlet valve replacement will take place on Friday Sept 25 from 10:00 AM to 02:00 PM. Please store adequate water for household usage.",
      category: "WATER",
      priority: "URGENT",
      authorId: adminUser.id,
      publishedAt: new Date("2026-09-22"),
    },
  });

  await prisma.notice.create({
    data: {
      title: "🎉 Ashvita Dandiya & Diwali Cultural Fest 2026 Announcement",
      content: "Join us at the Central Lawn on Oct 10th for evening Dandiya beats, food stalls, and community celebrations! Registration open for kid dance performances.",
      category: "EVENT",
      priority: "NORMAL",
      authorId: adminUser.id,
      publishedAt: new Date("2026-09-20"),
    },
  });

  // 9. Notifications
  await prisma.notification.create({
    data: {
      userId: residentUser.id,
      type: "WARNING",
      title: "Maintenance Bill Due",
      message: "September 2026 maintenance bill of ₹2,450 is due on Sept 28th.",
      link: "/resident/payments",
    },
  });

  await prisma.notification.create({
    data: {
      userId: residentUser.id,
      type: "INFO",
      title: "Plumbing Complaint Assigned",
      message: "Technician Rajesh has been assigned to ticket #CMP-2026-0041.",
      link: "/resident/complaints",
    },
  });

  // 10. Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: "NOTICE_PUBLISHED",
      entity: "Notice",
      details: "Published urgent water maintenance notice",
    },
  });

  console.log("✅ Ashvita database seed finished successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
