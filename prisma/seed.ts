import { seedDemoUsers } from "../src/lib/store";

async function main() {
  console.log("Seeding MarsaTrade database…");
  await seedDemoUsers();
  console.log("Done. Demo accounts:");
  console.log("  youssef@marsatrade.com / demo123");
  console.log("  admin@marsatrade.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
