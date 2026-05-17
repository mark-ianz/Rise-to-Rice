import "dotenv/config";
import pool from "./connection/database";
import { ResultSetHeader } from "mysql2";

const announcements = [
  {
    title: "Expanding Our Collection: We Now Accept HDPE Plastics!",
    description: "Starting this Monday, our collection centers will officially begin accepting High-Density Polyethylene (HDPE) containers, such as milk jugs and shampoo bottles. This expansion is part of our commitment to diverting more complex household waste away from local landfills. Please ensure all containers are thoroughly rinsed and dried before bringing them in to ensure they qualify for maximum points. Bring your clean jugs down to the central depot and start racking up rewards today!",
    image_url: "https://images.unsplash.com/photo-1595278069441-2cf29f8db022?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Community Clean-Up Drive: Partnering for a Greener Barangay",
    description: "Join your neighbors this coming Saturday morning for our monthly community cleanup campaign starting at the barangay hall. We are focusing our efforts on clearing plastic bottles and aluminum wrappers from the riverbanks and public parks. Every participant will receive a complimentary eco-friendly starter kit and a bonus of 500 reward points credited directly to their Rise to Rice account. Let’s work together to make our home cleaner, healthier, and more vibrant for the next generation!",
    image_url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Golden Grain Milestone: 5,000 Kilograms of Rice Distributed!",
    description: "We are absolutely thrilled to announce that our community has collectively recycled enough materials to distribute over 5,000 kilograms of premium rice! This incredible milestone proves that small daily habits can lead to massive social and environmental impact. We want to extend our heartfelt gratitude to every single active recycler who contributed to this success. Stay tuned for a special double-points week starting tomorrow to celebrate this historic community achievement!",
    image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Understanding Your Impact: Where Does Your Recycled Plastic Go?",
    description: "Have you ever wondered what happens to the PET bottles you drop off at our smart bins? Through our partnership with local green manufacturers, your recycled plastics are processed, melted down, and woven into high-quality durable building materials and eco-textiles. By participating in Rise to Rice, you are not just earning points; you are actively fueling a local circular economy. Thank you for choosing to make trash a valuable resource instead of landfill waste.",
    image_url: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Scheduled Maintenance: System Upgrade on May 20th",
    description: "Please be advised that the Rise to Rice digital platform and active smart collection bins will be offline for a scheduled software update on May 20th from 2:00 AM to 5:00 AM. During this brief maintenance window, you will not be able to log in to the dashboard or redeem earned points. We are introducing a brand-new real-time weight tracking feature to make your recycling submissions faster and more transparent. We apologize for any temporary inconvenience and appreciate your continuous support.",
    image_url: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Introducing Smart Weighing Bins at the North Sector",
    description: "Recycling just got even easier with the launch of our brand new Smart Weighing Bins located at the North Market square. Equipped with high-precision sensors and instant barcode scanners, these units allow you to weigh your plastics and scan your member QR code for immediate points allocation. No more long queues or waiting for manual confirmation from center staff. Drop by today, try out the new bins, and experience the future of community recycling first-hand!",
    image_url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Success Story: How Aling Nena Swapped Waste for Family Meals",
    description: "Meet Aling Nena, one of our top recyclers from Barangay San Jose, who has successfully supported her family's weekly grocery needs entirely through recycling. By collecting discarded plastics from her neighborhood and sorting them meticulously, she earns enough premium rice every month to feed her household of four. Nena's story is a beautiful reminder of how care for the environment can uplift lives in our local community. Read her full inspiring interview on our blog and share your own stories!",
    image_url: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Tips for Proper Waste Segregation at Home",
    description: "Are you looking to maximize your points return on every recycling drop-off? The secret lies in clean sorting: separate clear PET bottles from opaque jugs and compress them to save space. Removing bottle caps and labels before surrender speeds up the verification process, allowing us to credit your account instantly. By practicing clean segregation at home, you help maintain the high quality of raw materials entering the recycling stream. Thank you for being a responsible and smart recycler!",
    image_url: "https://images.unsplash.com/photo-1605600656374-2772e2178ad7?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Partnering with Local Schools for the Green Campus Challenge",
    description: "We are proud to launch the Green Campus Challenge in collaboration with district public schools to encourage young minds to embrace sustainability. Students can bring household recyclable plastics to designated campus bins, earning points that go directly towards funding new school library books and sports gear. This initiative aims to foster eco-consciousness from an early age while supporting public education. Help us cheer on our local youth as they compete to build the greenest school in the region!",
    image_url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Announcing the Premium Organic Rice Harvest Collection",
    description: "We have heard your feedback and are excited to introduce a premium variety of locally sourced organic brown rice to our redemption catalog starting next month. This high-nutrient addition requires 20% fewer points than standard imports, helping you enjoy healthier meals sooner. We are proud to source this grain directly from sustainable farmers in the nearby province, ensuring every grain supports both your family and local agriculture. Stock is limited, so start saving your plastics today!",
    image_url: "https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&q=80&w=800"
  }
];

async function seed() {
  try {
    // Get the first user to act as the author
    const [users]: any = await pool.query(
      "SELECT user_id FROM user LIMIT 1"
    );

    if (!users || users.length === 0) {
      console.error("No users found in the database. Please register a user first.");
      process.exit(1);
    }

    const authorId = users[0].user_id;
    console.log(`Seeding announcements using author_id: ${authorId}`);

    for (const post of announcements) {
      const [res] = await pool.query<ResultSetHeader>(
        "INSERT INTO announcement (title, description, image_url, author_id) VALUES (?, ?, ?, ?)",
        [post.title, post.description, post.image_url, authorId]
      );
      console.log(`Inserted post: "${post.title}" (ID: ${res.insertId})`);
    }

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
