import "dotenv/config";
import pool from "./connection/database";
import { ResultSetHeader } from "mysql2";
import { generatePublicId } from "./utils/generate";

const announcements = [
  {
    title: "Expanding Our Collection: We Now Accept HDPE Plastics!",
    description: "We are thrilled to officially announce the expansion of our community recycling initiative! Starting this coming Monday, all Rise to Rice redemption centers and smart collection hubs will begin accepting High-Density Polyethylene (HDPE) plastics. This includes commonly used household containers such as milk jugs, juice bottles, shampoo and conditioner containers, laundry detergent jugs, and household cleaning bottles. HDPE is one of the most versatile and highly recyclable plastics available today, renowned for its strength, durability, and resistance to chemical degradation. By expanding our collection to include this valuable material, we are taking a massive step forward in diverting dense consumer waste from local open-air landfills and preventing it from polluting our precious local waterways. When plastics end up in landfills, they can take hundreds of years to break down, releasing harmful microplastics into the surrounding soil and water tables. By recycling them, we give them a second life. To ensure the safety of our sorting teams and maintain the purity of the raw materials sent to our local recycling partners, please follow these simple preparation guidelines: 1) Rinse Thoroughly: Make sure all containers are completely empty of any chemical residues, soap, or food particles. 2) Dry Cleanly: Allow the containers to air dry upside down before bringing them to the hub. 3) Remove Caps and Pumps: Bottle caps and pump mechanisms are often made of a different type of plastic (usually polypropylene) and must be sorted separately. 4) Compress When Possible: Flattening your jugs saves massive storage space in our smart bins, allowing us to transport more materials in fewer trips. To celebrate the launch of this program, we are offering premium point values for all HDPE submissions during the first month. Every kilogram of clean, dry HDPE will earn you 150 points. Gather your household jugs, head down to your nearest depot this Monday, and let's make this launch an incredible community success!",
    image_url: "https://images.unsplash.com/photo-1528190336454-13cd56b45b5a?auto=format&fit=crop&q=80&w=800"
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
    description: "Have you ever wondered what happens to the PET bottles and plastic containers you drop off at our smart collection bins? Many people believe that recycling stops the moment their waste is sorted, but at Rise to Rice, that is just the very beginning of an incredible circular journey. Through our strong partnerships with local green manufacturers and eco-innovative startups, your recycled plastics are carefully sorted, washed, shredded into tiny flakes, and melted down into high-purity resin pellets. These pellets are then transformed into durable, high-quality building materials, such as eco-bricks, sustainable decking, and public park benches. Additionally, high-grade PET is spun into strong polyester fibers and woven into eco-textiles for reusable bags and clothing. By participating in the Rise to Rice program, you are not just earning points for premium organic grains; you are actively fueling a local circular economy. You are keeping valuable raw materials in use, reducing the demand for virgin fossil fuels, and preserving our natural ecosystems. Every bottle you bring to our hub helps create a cleaner, greener community. Thank you for choosing to make trash a valuable community resource instead of landfill waste!",
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
    description: "Meet Aling Nena, one of our top recyclers from Barangay San Jose, who has successfully supported her family's weekly grocery needs entirely through clean recycling. Before joining the Rise to Rice initiative, Aling Nena was struggling to make ends meet as a freelance helper. By dedicating a few hours every evening to collecting discarded plastics from her neighborhood and sorting them meticulously with her children, she now earns enough premium points to redeem high-quality organic rice for her entire household of four every single month. Her neat sorting habits have also inspired her neighbors, who now save their clean bottles and hand them over directly to her. Aling Nena's journey is a beautiful reminder of how caring for the environment can uplift lives in our local community, transforming waste into a reliable food security bridge. \"This program gave me a way to feed my family with dignity while keeping our streets clean,\" Nena shares in her interview. She has now become an official recycling ambassador in her barangay, hosting small segregation sessions for local mothers. Read her full inspiring story on our blog and share your own eco-journeys with us!",
    image_url: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Tips for Proper Waste Segregation at Home",
    description: "Are you looking to maximize your points return on every recycling drop-off? The secret lies in clean sorting: separate clear PET bottles from opaque jugs and compress them to save space. Removing bottle caps and labels before surrender speeds up the verification process, allowing us to credit your account instantly. By practicing clean segregation at home, you help maintain the high quality of raw materials entering the recycling stream. Thank you for being a responsible and smart recycler!",
    image_url: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Partnering with Local Schools for the Green Campus Challenge",
    description: "We are proud to launch the Green Campus Challenge in collaboration with district public schools to encourage young minds to embrace sustainability. Students can bring household recyclable plastics to designated campus bins, earning points that go directly towards funding new school library books and sports gear. This initiative aims to foster eco-consciousness from an early age while supporting public education. Help us cheer on our local youth as they compete to build the greenest school in the region!",
    image_url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Announcing the Premium Organic Rice Harvest Collection",
    description: "We have heard your feedback and are excited to introduce a premium variety of locally sourced organic brown rice to our redemption catalog starting next month. This high-nutrient addition requires 20% fewer points than standard imports, helping you enjoy healthier meals sooner. We are proud to source this grain directly from sustainable farmers in the nearby province, ensuring every grain supports both your family and local agriculture. Stock is limited, so start saving your plastics today!",
    image_url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800"
  }
];

function getRandomDateInLastTwoMonths(): Date {
  const now = new Date();
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(now.getMonth() - 2);

  const startTime = twoMonthsAgo.getTime();
  const endTime = now.getTime();

  const randomTime = startTime + Math.random() * (endTime - startTime);
  return new Date(randomTime);
}

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

    // Clear existing announcements
    console.log("Deleting all existing announcements (cascades to reactions)...");
    await pool.query("DELETE FROM announcement");

    for (const post of announcements) {
      const announcementId = generatePublicId();
      const randomDate = getRandomDateInLastTwoMonths();
      await pool.query<ResultSetHeader>(
        "INSERT INTO announcement (announcement_id, title, description, image_url, author_id, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
        [announcementId, post.title, post.description, post.image_url, authorId, randomDate]
      );
      console.log(`Inserted post: "${post.title}" (ID: ${announcementId}, Date: ${randomDate.toISOString().split('T')[0]})`);
    }

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
