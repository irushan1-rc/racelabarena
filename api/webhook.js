export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  try {
    const body = req.body;

    console.log("BMC DATA:", body); // debug

    const username =
      body.name ||
      body.supporter_name ||
      body.email ||
      "anonymous";

    const amount = Number(body.amount || body.support_price || 0);

    let tier = "Supporter";
    if (amount >= 10) tier = "Race sponsor";
    else if (amount >= 5) tier = "Upgraded the build";
    else if (amount >= 2) tier = "Charged the battery";

    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/supporters`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.SUPABASE_SECRET_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          username,
          amount,
          tier,
        }),
      }
    );

    const result = await response.text();
    console.log("SUPABASE RESPONSE:", result);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
